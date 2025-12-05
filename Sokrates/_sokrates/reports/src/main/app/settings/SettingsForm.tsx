"use client";

import { Datepicker } from "flowbite-react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CountrySelect } from "@/app/_components/CountrySelect";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import type { User } from "../../types/User";
import Modal from "./modal";
import { Button } from "@/components/ui/button";
import ConnectStripeButton from "./StripeConnectButton";

const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition";

const labelBase = "mb-2 block text-sm font-medium text-text";

export function SettingsForm({ user }: { user: User }) {
  const initialBirthday = useMemo(() => {
    if (!user.birthday) return null;
    const date = new Date(user.birthday);
    return Number.isNaN(date.valueOf()) ? null : date;
  }, [user.birthday]);

  const [country, setCountry] = useState(user.country ?? "");
  const [birthday, setBirthday] = useState<Date | null>(initialBirthday);
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const { refresh, setUser } = useAuth();

  async function deleteUser() {
    if (isDeleting) return;
    setError(null);
    setIsDeleting(true);
    try {
      await axios.delete("/api/user/delete");
      setUser(null);
      router.push("/auth/signup");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  }

  async function updateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving) return;

    const form = new FormData(e.currentTarget);
    setError(null);
    setIsSaving(true);

    try {
      const payload = {
        id: user.id,
        email: form.get("email"),
        name: form.get("name"),
        password: form.get("newPassword"),
        country,
        birthday,
      };
      await axios.patch("/api/user/update", payload);
      await refresh();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-surface border-border mx-auto my-20 min-h-[30vh] w-4/5 rounded border p-20">
      <h1
        className="pt-5 text-center text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        data-testid="settings-title"
      >
        Settings
      </h1>
      <form className="mx-auto w-full space-y-6" onSubmit={updateUser}>
        <h1 className="text-1xl mt-10 text-center md:text-4xl">
          Edit User Info
        </h1>
        <div className="bg-text my-10 h-0.5 w-full rounded-2xl" />
        <div>
          <label htmlFor="email" className={labelBase}>
            Email address
          </label>
          <input
            name="email"
            type="email"
            className={inputBase}
            placeholder="you@example.com"
            defaultValue={user.email ?? ""}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="name" className={labelBase}>
            Name
          </label>
          <input
            type="text"
            name="name"
            className={inputBase}
            placeholder="Jane"
            defaultValue={user.name ?? ""}
            required
            autoComplete="given-name"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelBase}>
            Current password
          </label>
          <div className="flex items-center gap-5">
            <input
              type={showPassCurrent ? "text" : "password"}
              name="password"
              className={inputBase}
              placeholder="********"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="text-text hover:text-accent"
              onClick={() => setShowPassCurrent((prev) => !prev)}
            >
              {showPassCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className={labelBase}>
            New password
          </label>
          <div className="flex items-center gap-5">
            <input
              type={showPassConfirm ? "text" : "password"}
              name="newPassword"
              className={inputBase}
              placeholder="********"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="text-text hover:text-accent"
              onClick={() => setShowPassConfirm((prev) => !prev)}
            >
              {showPassConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div id="countries">
          <CountrySelect value={country} onValueChange={setCountry} />
        </div>

        <Datepicker
          id="datepicker"
          onChange={setBirthday}
          value={birthday ?? undefined}
        />
        <input
          type="hidden"
          name="birthday"
          value={birthday ? format(birthday, "yyyy-MM-dd") : ""}
        />

        {error ? <p className="text-red-600">{error}</p> : null}

        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <Button type="submit" disabled={isSaving} variant="update">
            Update
          </Button>
          <Button
            variant="delete"
            onClick={() => setOpenModal(true)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </form>
      <div className="bg-text my-10 h-0.5 w-full rounded-2xl" />

      {/* MODAL */}
      <Modal
        open={openModal}
        setOpenModal={setOpenModal}
        onDelete={deleteUser}
      />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Settings</h3>
        <ConnectStripeButton />
      </div>
    </div>
  );
}
