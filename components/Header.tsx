"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";

/* tiny cookie helpers */
const setCookie = (name: string, value: string, days = 365) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
};
const getCookie = (name: string) => {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
};

/* header links */
const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // hamburger panel open?

  useEffect(() => setOpen(false), [pathname]);                       // close panel on route change
  useEffect(() => {                                                  // close on ESC
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const remember = (href: string) => setCookie("last_menu", href, 30);

  return (
    <>
      <header className="border-b">
        <div className="container flex items-center gap-3">
          {/* student number */}
          <div className="font-mono text-sm" aria-label="Student number">21969946</div>

          {/* NAV LINKS — now visible on ALL screens */}
          <nav aria-label="Primary" className="ml-auto flex items-center gap-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => remember(n.href)}
                aria-current={pathname === n.href ? "page" : undefined}
                className="px-3 py-2 rounded hover:bg-black/5 focus:outline-none focus:ring-2"
              >
                {n.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>

          {/* HAMBURGER — also visible on ALL screens */}
          <button
            className={`ml-2 px-3 py-2 rounded focus:ring-2 transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="hamburger-panel"
            onClick={() => setOpen((s) => !s)}
          >
            ☰
          </button>
        </div>

        {/* HAMBURGER PANEL — works on ALL screens */}
        <div
          id="hamburger-panel"
          className={`overflow-hidden origin-top transition-transform duration-200 ${
            open ? "scale-y-100" : "scale-y-0"
          }`}
          aria-hidden={!open}
        >
          <nav aria-label="Secondary" className="container flex flex-col border-t">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => remember(n.href)}
                aria-current={pathname === n.href ? "page" : undefined}
                className="px-3 py-2 rounded hover:bg-black/5 focus:outline-none focus:ring-2"
              >
                {n.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      <Breadcrumbs />
    </>
  );
}

/* theme toggle */
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
    const cookie = (getCookie("theme") as "light" | "dark" | null) ?? null;
    if (cookie) {
      setTheme(cookie);
      document.documentElement.setAttribute("data-theme", cookie);
    } else if (attr) {
      setTheme(attr);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
      setCookie("theme", initial);
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    setCookie("theme", next, 365);
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      aria-pressed={theme === "dark"}
      className="px-3 py-2 rounded focus:ring-2"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
