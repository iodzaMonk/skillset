"use client";
import { Button, Datepicker } from "flowbite-react";
import { TransitionLink } from "@/app/utils/TransitionLink";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { format } from "date-fns";
import countries from "@/lib/countries.json";
import { useAuth } from "@/app/context/AuthContext";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition";

const labelBase = "mb-2 block text-sm font-medium text-text";
const hintText = "text-sm text-text-muted";

export default function Auth() {
  const { slug } = useParams<{ slug: string }>();
  const [country, setCountry] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = slug === "login";

  const router = useRouter();
  const { refresh } = useAuth();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const form = new FormData(e.currentTarget);
    setError(null);
    setIsSubmitting(true);

    try {
      if (login) {
        const payload = {
          email: form.get("email"),
          password: form.get("password"),
        };
        await axios.post("/api/user/login", payload);
      } else {
        const payload = {
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
          country,
          birthday,
        };
        await axios.post("/api/user/register", payload);
      }

      await refresh();
      router.push("/");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {login ? (
        <div className="flex w-full flex-col items-center !font-sans">
          <section className="w-full max-w-md px-4 md:px-0">
            <div className="border-border bg-surface/90 mx-auto w-full rounded-lg border shadow-lg backdrop-blur">
              <div className="space-y-4 p-6 sm:p-8">
                <h1 className="text-text text-2xl font-bold">
                  Sign in to your account
                </h1>

                <form className="space-y-5" onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="email" className={labelBase}>
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      className={inputBase}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className={labelBase}>
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="********"
                      className={inputBase}
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-text flex items-center gap-2 text-sm">
                      <input
                        id="remember"
                        type="checkbox"
                        className="border-border bg-surface/60 text-secondary h-4 w-4 rounded focus:ring-2 focus:ring-[--color-ring] focus:outline-none"
                      />
                      <span className="text-text-muted">Remember me</span>
                    </label>

                    <a
                      href="#"
                      className="text-accent text-sm font-medium hover:opacity-90"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-text-onAccent hover:bg-accent-hover focus:ring-ring w-full cursor-pointer rounded-md px-5 py-2.5 text-center text-sm font-semibold transition focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Sign in
                  </button>

                  {error ? <p className="text-red-600">{error}</p> : null}

                  <p className={hintText}>
                    Dont have an account yet?{" "}
                    <TransitionLink
                      href="/auth/signup"
                      className="text-accent hover:opacity-90"
                    >
                      Sign up
                    </TransitionLink>
                  </p>
                </form>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center !font-sans">
          <section className="mb-10 w-full max-w-2xl px-4 md:px-0">
            <div className="border-border bg-surface/90 mx-auto w-full rounded-lg border shadow-lg backdrop-blur">
              <div className="space-y-6 p-6 sm:p-8">
                <h1 className="text-text text-2xl font-bold">
                  Create your account
                </h1>

                <form className="space-y-6" onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="email" className={labelBase}>
                      Email address
                    </label>
                    <input
                      name="email"
                      type="email"
                      className={inputBase}
                      placeholder="you@example.com"
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
                      required
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="password" className={labelBase}>
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className={inputBase}
                        placeholder="********"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className={labelBase}>
                        Confirm password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className={inputBase}
                        placeholder="********"
                        required
                        autoComplete="new-password"
                      />
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
                        {countries.map((c, i) => (
                          <SelectItem
                            className="data-[highlighted]:!bg-accent/20 data-[highlighted]:!text-text data-[state-checked]:!bg-accent data-[state-checked]:!text-text-onAccent cursor-pointer px-3 py-2 text-sm data-[disabled]:opacity-50"
                            key={i}
                            value={c.code}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`fi fi-${c.code.toLowerCase()}`}
                              />
                              {c.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-accent text-text-onAccent hover:bg-accent-hover focus:ring-ring cursor-pointer rounded-md px-5 py-2.5 text-sm font-semibold transition focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Submit
                    </button>

                    <TransitionLink href="/auth/login">
                      <Button
                        color="light"
                        className="border-border bg-surface text-text hover:bg-surface-2 cursor-pointer border"
                      >
                        Or click here to login
                      </Button>
                    </TransitionLink>
                  </div>

                  <p className={hintText}>
                    By continuing you agree to our{" "}
                    <a href="#" className="text-accent hover:opacity-90">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-accent hover:opacity-90">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
