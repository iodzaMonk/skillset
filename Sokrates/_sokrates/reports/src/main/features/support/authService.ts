import bcrypt from "bcryptjs";
import { LoginBody, loginUser } from "../../app/lib/auth/login.ts";
import { encrypt } from "../../app/lib/session/tokens.ts";
import { prisma } from "../../lib/prisma.ts";

class DatabaseAuthService {
  private trackedEmails: Set<string> = new Set();

  async seed(rows: Array<Record<string, string>>) {
    const tableRows = rows.map((row) => {
      const email = row.email?.trim();
      const password = row.password ?? "";
      if (!email) {
        throw new Error("Each row must include an email column");
      }
      return { email, password };
    });

    for (const row of tableRows) {
      const { email, password } = row;
      await prisma.users.delete({ where: { email } }).catch(() => null);

      const hashed = await bcrypt.hash(password, 10);
      await prisma.users.create({
        data: {
          email,
          password: hashed,
          name: email.split("@")[0] ?? "Cucumber User",
          country: "US",
        },
      });
      this.trackedEmails.add(email);
    }
  }

  async cleanup() {
    if (this.trackedEmails.size === 0) return;
    await prisma.users.deleteMany({
      where: { email: { in: Array.from(this.trackedEmails) } },
    });
    this.trackedEmails.clear();
  }

  async login(body: LoginBody) {
    const result = await loginUser(body);
    if (result.status !== 200) {
      return result;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = await encrypt({
      userId: result.body.userId,
      expiresAt: expiresAt.toISOString(),
    });

    return {
      status: 200,
      body: { token },
    };
  }
}

export const authService = new DatabaseAuthService();
