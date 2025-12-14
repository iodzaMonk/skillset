"use client";

import { BirthdayPicker } from "@/app/_components/BirthdayPicker";
import { getErrorMessage } from "@/app/utils/api-helpers";

import { FormItem } from "@/app/_components/FormItem";

import { useMemo, useState } from "react";
import { CountrySelect } from "@/app/_components/CountrySelect";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import type { User } from "../../types/User";
import Modal from "./modal";
import { Button } from "@/components/ui/button";
import ConnectStripeButton from "./StripeConnectButton";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      const message = getErrorMessage(err);
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
      const message = getErrorMessage(err);
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
        <FormItem
          label="Email address"
          id="email-settings"
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue={user.email ?? ""}
          required
          autoComplete="email"
        />

        <FormItem
          label="Name"
          id="name"
          type="text"
          name="name"
          placeholder="Jane"
          defaultValue={user.name ?? ""}
          required
          autoComplete="given-name"
        />

        <div>
          <Label htmlFor="password" className="mb-2">
            Current password
          </Label>
          <div className="flex items-center gap-5">
            <Input
              type={showPassCurrent ? "text" : "password"}
              name="password"
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
          <Label htmlFor="newPassword" className="mb-2">
            New password
          </Label>
          <div className="flex items-center gap-5">
            <Input
              type={showPassConfirm ? "text" : "password"}
              name="newPassword"
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

        <BirthdayPicker
          birthday={birthday}
          setBirthday={setBirthday}
          error={error}
        />

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
