export default function Footer() {
  return (
    <footer className="border-border bg-surface text-text w-full border-t">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h2 className="text-lg font-semibold">SkillSet</h2>
          <p className="text-text-muted mt-3 text-sm">
            Here to make finding talent easier
          </p>
        </div>

        <div>
          <h3 className="text-accent text-sm font-semibold tracking-wide uppercase">
            Company
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["About Us", "#"],
              ["Careers", "#"],
              ["Press", "#"],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-text-muted hover:text-accent rounded-sm focus:ring-2 focus:ring-[--color-ring] focus:outline-none"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-accent text-sm font-semibold tracking-wide uppercase">
            Resources
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["Docs", "#"],
              ["Blog", "#"],
              ["Support", "#"],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-text-muted hover:text-accent rounded-sm focus:ring-2 focus:ring-[--color-ring] focus:outline-none"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-accent text-sm font-semibold tracking-wide uppercase">
            Follow
          </h3>
          <div className="mt-3 flex space-x-4 text-sm">
            {["Twitter", "Instagram", "LinkedIn"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-text-muted hover:text-accent rounded-sm focus:ring-2 focus:ring-[--color-ring] focus:outline-none"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="text-text-muted mx-auto flex max-w-6xl flex-col justify-between px-6 py-6 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} SkillSet. All rights reserved.</p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <a
              href="#"
              className="hover:text-accent rounded-sm focus:ring-2 focus:ring-[--color-ring] focus:outline-none"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-accent rounded-sm focus:ring-2 focus:ring-[--color-ring] focus:outline-none"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
