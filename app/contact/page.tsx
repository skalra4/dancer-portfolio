import type { Metadata } from "next";
import Image from "next/image";
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
    contact,
  } = await fetchSiteSettings();

  const hasContactInfo = Boolean(contactEmail || contactPhone);
  const img = contact.image;
  const hasImage = img.url.length > 0 && img.width > 0 && img.height > 0;

  /* ── Shared form content ── */
  const formBody = (
    <>
      <ScrollReveal>
        <h1 className="text-center font-[family-name:var(--font-display)] text-4xl text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-left">
          {contactTitle}
        </h1>
      </ScrollReveal>

      {contactDescription ? (
        <ScrollReveal delay={0.08} className="mt-6">
          <p className="text-center text-base leading-relaxed text-zinc-500 dark:text-zinc-400 lg:text-left">
            {contactDescription}
          </p>
        </ScrollReveal>
      ) : null}

      {hasContactInfo ? (
        <ScrollReveal delay={0.12} className="mt-8">
          <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
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

      <ScrollReveal delay={0.16} className="my-10">
        <div className="border-t border-zinc-200 dark:border-zinc-800" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <ContactForm ownerEmail={contactEmail} />
      </ScrollReveal>

      <ScrollReveal delay={0.26} className="mt-12 text-center lg:text-left">
        <Link
          href="/"
          className="text-sm text-zinc-400 underline-offset-4 transition hover:text-zinc-700 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ← Back to home
        </Link>
      </ScrollReveal>
    </>
  );

  /* ── Split layout (image + form side by side on desktop) ── */
  if (hasImage) {
    return (
      <>
        <NavbarWrapper />
        <main className="grid min-h-screen grid-cols-1 pt-16 lg:grid-cols-2">
          {/* Left — image */}
          <div className="relative h-[50vh] lg:sticky lg:top-0 lg:h-screen">
            <Image
              src={img.url}
              alt={img.alt || contactTitle}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right — form */}
          <div className="flex flex-col justify-center bg-white px-6 py-16 sm:px-8 lg:px-12 lg:py-20 dark:bg-zinc-950">
            {formBody}
          </div>
        </main>
      </>
    );
  }

  /* ── Single-column layout (no image) ── */
  return (
    <>
      <NavbarWrapper />
      <main className="flex min-h-screen flex-1 flex-col bg-white pb-24 pt-24 dark:bg-zinc-900">
        <div className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
          {formBody}
        </div>
      </main>
    </>
  );
}
