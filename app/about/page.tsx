import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NavbarWrapper } from "../components/NavbarWrapper";
import { ScrollReveal } from "../components/ScrollReveal";
import { fetchSiteSettings } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const { seoDescription } = await fetchSiteSettings();
  return { title: "About", description: seoDescription };
}

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

type SocialEntry = [string, string];

function SocialLinks({ social }: { social: Record<string, string | undefined> }) {
  const entries = Object.entries(social).filter(
    (entry): entry is SocialEntry => typeof entry[1] === "string" && entry[1].length > 0,
  );

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

export default async function AboutPage() {
  const { siteName, siteTagline, bio, social, about } = await fetchSiteSettings();
  const hasSocial = Object.values(social).some(Boolean);
  const img = about.image;
  const hasImage = img.url.length > 0 && img.width > 0 && img.height > 0;

  return (
    <>
      <NavbarWrapper />
      <main className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">

        {/* ── Optional header image ── */}
        {hasImage ? (
          <div className="relative w-full h-[55vh] sm:h-[65vh] pt-16">
            <Image
              src={img.url}
              alt={img.alt || siteName}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ) : null}

        {/* ── Content ── */}
        <div className="mx-auto w-full max-w-2xl px-6 pb-24 sm:px-8" style={{ paddingTop: hasImage ? "3rem" : "6rem" }}>
          {!hasImage ? (
            <ScrollReveal>
              <div>
                <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                  About
                </p>
                <h1 className="mt-4 text-center font-[family-name:var(--font-display)] text-4xl text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                  {siteName}
                </h1>
                <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  {siteTagline}
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                About
              </p>
              <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                {siteName}
              </h1>
            </ScrollReveal>
          )}

          <ScrollReveal delay={0.1} className="mt-14">
            <BioParagraphs text={bio} />
          </ScrollReveal>

          {hasSocial ? (
            <ScrollReveal delay={0.18}>
              <SocialLinks social={social} />
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
