import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { ScrollReveal } from "../components/ScrollReveal";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.seoDescription,
};

function BioParagraphs({ text }: { text: string }) {
  const blocks = text
    .trim()
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 text-left text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
      {blocks.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}

function SocialLinks() {
  const entries = Object.entries(siteConfig.social).filter(
    ([, url]) => url && url.length > 0,
  ) as [string, string][];

  if (entries.length === 0) return null;

  const labels: Record<string, string> = {
    instagram: "Instagram",
    youtube: "YouTube",
    tiktok: "TikTok",
    twitter: "X / Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
  };

  return (
    <ul className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
      {entries.map(([key, href]) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-900 underline-offset-4 transition hover:underline dark:text-zinc-100"
          >
            {labels[key] ?? key}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col bg-zinc-50 pb-24 pt-24 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
          <ScrollReveal>
            <div>
              <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                About
              </p>
              <h1 className="mt-4 text-center font-[family-name:var(--font-display)] text-4xl text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {siteConfig.siteName}
              </h1>
              <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {siteConfig.siteTagline}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-14">
            <BioParagraphs text={siteConfig.bio} />
          </ScrollReveal>

          {Object.values(siteConfig.social).some(Boolean) ? (
            <ScrollReveal delay={0.18}>
              <SocialLinks />
            </ScrollReveal>
          ) : null}

          <ScrollReveal delay={0.22} className="mt-16 text-center">
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
