"use client";

import { Datepicker } from "flowbite-react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import countries from "@/lib/countries.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import type { User } from "../types/User";

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
        ? err.response?.data?.message ?? "Something went wrong"
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
        password: form.get("password"),
        country,
        birthday,
      };
      await axios.patch("/api/user/update", payload);
      await refresh();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Something went wrong"
        : "Something went wrong";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-surface border-border mx-auto my-20 min-h-[30vh] w-4/5 rounded border p-20">
      <h1 className="pt-5 text-center text-5xl">Settings</h1>
      <form className="mx-auto w-full space-y-6" onSubmit={updateUser}>
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
          <label htmlFor="confirmPassword" className={labelBase}>
            Confirm password
          </label>
          <div className="flex items-center gap-5">
            <input
              type={showPassConfirm ? "text" : "password"}
              name="confirmPassword"
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
          <label
            htmlFor="countries"
            className="text-text mb-2 block text-sm font-medium"
          >
            Country
          </label>

          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-surface w-full">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="start"
              sideOffset={6}
              className="border-border bg-surface text-text z-[9999] rounded-md border shadow-xl"
            >
              {countries.map((c) => (
                <SelectItem
                  className="data-[highlighted]:!bg-accent/20 data-[highlighted]:!text-text data-[state-checked]:!bg-accent data-[state-checked]:!text-text-onAccent cursor-pointer px-3 py-2 text-sm data-[disabled]:opacity-50"
                  key={c.code}
                  value={c.code}
                >
                  <div className="flex items-center gap-2">
                    <span className={`fi fi-${c.code.toLowerCase()}`} />
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Datepicker id="datepicker" onChange={setBirthday} value={birthday ?? undefined} />
        <input
          type="hidden"
          name="birthday"
          value={birthday ? format(birthday, "yyyy-MM-dd") : ""}
        />

        {error ? <p className="text-red-600">{error}</p> : null}

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg border border-blue-600 px-5 py-2.5 text-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Update settings
          </button>
          <button
            type="button"
            onClick={deleteUser}
            disabled={isDeleting}
            className="inline-flex items-center rounded-lg border border-red-600 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:ring-4 focus:ring-red-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className="mr-1 -ml-1 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Delete account
          </button>
        </div>
      </form>
    </div>
  );
}

