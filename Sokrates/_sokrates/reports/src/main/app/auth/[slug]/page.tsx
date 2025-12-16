"use client";
import { Button } from "flowbite-react";
import { FormItem } from "@/app/_components/FormItem";

import { TransitionLink } from "@/app/utils/TransitionLink";
import { getErrorMessage } from "@/app/utils/api-helpers";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { CountrySelect } from "@/app/_components/CountrySelect";

import { BirthdayPicker } from "@/app/_components/BirthdayPicker";
import { Checkbox } from "@/components/ui/checkbox";
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
      const message = getErrorMessage(err);
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
                  <FormItem
                    label="Email address"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    autoComplete="email"
                  />

                  <FormItem
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="********"
                    required
                    autoComplete="current-password"
                  />

                  <div className="flex items-center justify-between">
                    <label className="text-text flex items-center gap-2 text-sm">
                      <Checkbox id="remember" />
                      <span className="text-text-muted">Remember me</span>
                    </label>

                    <a
                      href="#"
                      className="text-accent text-sm font-medium hover:opacity-90"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Sign in
                  </Button>

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
                  <FormItem
                    label="Email address"
                    id="email-signup"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />

                  <FormItem
                    label="Name"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Jane"
                    required
                    autoComplete="given-name"
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormItem
                      label="Password"
                      id="password-signup"
                      type="password"
                      name="password"
                      placeholder="********"
                      required
                      autoComplete="new-password"
                    />
                    <FormItem
                      label="Confirm password"
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="********"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div id="countries">
                    <CountrySelect value={country} onValueChange={setCountry} />
                  </div>

                  <BirthdayPicker
                    birthday={birthday}
                    setBirthday={setBirthday}
                    error={error}
                  />

                  <div className="flex flex-wrap items-center gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                      Submit
                    </Button>

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
