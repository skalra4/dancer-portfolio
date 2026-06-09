"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Resume", href: "/resume" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
] as const;

function isExternalOrPublicAsset(src: string) {
  return src.startsWith("http") || src.startsWith("/");
}

type NavbarProps = {
  siteName?: string;
  menuTriggerImageUrl?: string | null;
};

export function Navbar({ siteName = "Zamora", menuTriggerImageUrl }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | PointerEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close]);

  const triggerSrc = menuTriggerImageUrl?.trim();
  const useSilhouette =
    triggerSrc && triggerSrc.length > 0 && isExternalOrPublicAsset(triggerSrc);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-[0.2em] text-white uppercase"
          onClick={close}
        >
          {siteName}
        </Link>

        <div className="relative" ref={containerRef}>
          <button
            type="button"
            className="flex h-11 min-w-11 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls="site-nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-6 shrink-0" strokeWidth={1.75} aria-hidden />
            ) : useSilhouette ? (
              <span className="relative block h-10 w-10 shrink-0">
                <Image
                  src={triggerSrc!}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain object-center brightness-0 invert"
                  unoptimized={triggerSrc!.startsWith("http")}
                />
              </span>
            ) : (
              <Menu className="size-6 shrink-0" strokeWidth={1.75} aria-hidden />
            )}
          </button>

          <AnimatePresence>
            {open ? (
              <motion.nav
                id="site-nav-menu"
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] overflow-hidden rounded-lg border border-white/15 bg-black/85 py-2 shadow-xl backdrop-blur-md"
              >
                <ul className="flex flex-col">
                  {navItems.map((item) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href ||
                          pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href} role="none">
                        <Link
                          role="menuitem"
                          href={item.href}
                          className={`block px-4 py-3 text-sm font-medium tracking-wide transition hover:bg-white/10 ${
                            active ? "text-white" : "text-white/90"
                          }`}
                          onClick={close}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
