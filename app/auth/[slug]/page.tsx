"use client";
import { Button } from "flowbite-react";
import { TransitionLink } from "@/app/utils/TransitionLink";
import { useParams } from "next/navigation";

const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-none focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition";

const labelBase = "mb-2 block text-sm font-medium text-text";
const hintText = "text-sm text-text-muted";

export default function Auth() {
  const { slug } = useParams<{ slug: string }>();
  const login = slug === "login";

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

                <form className="space-y-5" action="#">
                  <div>
                    <label htmlFor="email" className={labelBase}>
                      Your email
                    </label>
                    <input
                      type="email"
                      id="email"
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
                      id="password"
                      placeholder="••••••••"
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
                    className="bg-accent text-text-onAccent hover:bg-accent-hover focus:ring-ring w-full cursor-pointer rounded-md px-5 py-2.5 text-center text-sm font-semibold transition focus:ring-2 focus:outline-none"
                  >
                    Sign in
                  </button>

                  <p className={hintText}>
                    Don’t have an account yet?{" "}
                    <TransitionLink
                      href="/auth/signup"
                      className="text-accent font-medium hover:opacity-90"
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
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 !font-sans">
          <h1 className="text-text text-4xl font-bold">Sign up</h1>

          <form className="mx-auto w-full space-y-6">
            <div>
              <label htmlFor="floating_email" className={labelBase}>
                Email address
              </label>
              <input
                type="email"
                id="floating_email"
                className={inputBase}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="floating_first_name" className={labelBase}>
                  First name
                </label>
                <input
                  type="text"
                  id="floating_first_name"
                  className={inputBase}
                  placeholder="Jane"
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="floating_last_name" className={labelBase}>
                  Last name
                </label>
                <input
                  type="text"
                  id="floating_last_name"
                  className={inputBase}
                  placeholder="Doe"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="floating_phone" className={labelBase}>
                  Phone number
                </label>
                <input
                  type="tel"
                  id="floating_phone"
                  className={inputBase}
                  placeholder="123-456-7890"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="floating_company" className={labelBase}>
                  Company (optional)
                </label>
                <input
                  type="text"
                  id="floating_company"
                  className={inputBase}
                  placeholder="Acme Inc."
                  autoComplete="organization"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="floating_password" className={labelBase}>
                  Password
                </label>
                <input
                  type="password"
                  id="floating_password"
                  className={inputBase}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="floating_repeat_password" className={labelBase}>
                  Confirm password
                </label>
                <input
                  type="password"
                  id="floating_repeat_password"
                  className={inputBase}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="bg-accent text-text-onAccent hover:bg-accent-hover focus:ring-ring cursor-pointer rounded-md px-5 py-2.5 text-sm font-semibold transition focus:ring-2 focus:outline-none"
              >
                Submit
              </button>

              <TransitionLink href={"/auth/login"}>
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
      )}
    </>
  );
}
