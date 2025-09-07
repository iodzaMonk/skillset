import prisma from "@/lib/prisma";
export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-Faustina mb-8 text-4xl font-bold">Superblog</h1>
      <ol className="list-inside list-decimal font-[family-name:var(--font-geist-sans)]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
