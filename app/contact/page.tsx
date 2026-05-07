import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { NavbarWrapper } from "../components/NavbarWrapper";
import { ScrollReveal } from "../components/ScrollReveal";
import { ContactForm } from "../components/ContactForm";
import { fetchSiteSettings } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const { contactDescription } = await fetchSiteSettings();
  return { title: "Contact", description: contactDescription };
}

export default async function ContactPage() {
  const {
    contactTitle,
    contactDescription,
    contactEmail,
    contactPhone,
  } = await fetchSiteSettings();

  const hasContactInfo = Boolean(contactEmail || contactPhone);

  return (
    <>
      <NavbarWrapper />
      <main className="flex min-h-screen flex-1 flex-col bg-white pb-24 pt-24 dark:bg-zinc-900">
        <div className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">

          {/* ── Header ── */}
          <ScrollReveal>
            <h1 className="text-center font-[family-name:var(--font-display)] text-4xl text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {contactTitle}
            </h1>
          </ScrollReveal>

          {contactDescription ? (
            <ScrollReveal delay={0.08} className="mt-6">
              <p className="text-center text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
                {contactDescription}
              </p>
            </ScrollReveal>
          ) : null}

          {/* ── Owner contact info ── */}
          {hasContactInfo ? (
            <ScrollReveal delay={0.12} className="mt-8">
              <div className="flex flex-wrap justify-center gap-6">
                {contactEmail ? (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    <Mail className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden />
                    {contactEmail}
                  </a>
                ) : null}
                {contactPhone ? (
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    <Phone className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden />
                    {contactPhone}
                  </a>
                ) : null}
              </div>
            </ScrollReveal>
          ) : null}

          {/* ── Divider ── */}
          <ScrollReveal delay={0.16} className="my-10">
            <div className="border-t border-zinc-200 dark:border-zinc-800" />
          </ScrollReveal>

          {/* ── Contact form ── */}
          <ScrollReveal delay={0.2}>
            <ContactForm ownerEmail={contactEmail} />
          </ScrollReveal>

          {/* ── Back link ── */}
          <ScrollReveal delay={0.26} className="mt-12 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-400 underline-offset-4 transition hover:text-zinc-700 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              ← Back to home
            </Link>
          </ScrollReveal>

        </div>
      </main>
    </>
  );
}
