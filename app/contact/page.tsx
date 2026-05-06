import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { ScrollReveal } from "../components/ScrollReveal";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Contact",
  description: siteConfig.homeSections.contactDescription,
};

export default function ContactPage() {
  const { homeSections } = siteConfig;

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-1 flex-col bg-white pb-24 pt-24 dark:bg-zinc-900">
        <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
          <ScrollReveal>
            <h1 className="text-center font-[family-name:var(--font-display)] text-4xl text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {homeSections.contactTitle}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.08} className="mt-10">
            <p className="text-center text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {homeSections.contactDescription}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.16} className="mt-12 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ← Back to home
            </Link>
          </ScrollReveal>
        </div>
      </main>
    </>
  );
}
