import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { NavbarWrapper } from "../components/NavbarWrapper";
import { ResumeWebView } from "../components/ResumeWebView";
import { ResumeViewToggle } from "../components/ResumeViewToggle";
import { ScrollReveal } from "../components/ScrollReveal";
import { siteConfig } from "@/config/siteConfig";
import { fetchResumeHeader, fetchSiteSettings } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Resume",
  description: "Education, performance experience, and awards.",
};

function ContactLine({
  contact,
}: {
  contact: { email?: string; phone?: string | null; location?: string | null; website?: string | null };
}) {
  const parts: string[] = [];
  if (contact.location) parts.push(contact.location);
  if (contact.email) parts.push(contact.email);
  if (contact.phone) parts.push(contact.phone);
  if (contact.website) parts.push(contact.website);
  if (parts.length === 0) return null;
  return (
    <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 print:text-zinc-700">
      {parts.join(" · ")}
    </p>
  );
}

export default async function ResumePage() {
  const { resumePdfPath } = siteConfig;
  const [{ headline, contact }, { siteName }] = await Promise.all([
    fetchResumeHeader(),
    fetchSiteSettings(),
  ]);

  return (
    <>
      <div className="print:hidden">
        <NavbarWrapper />
      </div>

      <main className="min-h-screen bg-zinc-50 pb-24 pt-24 dark:bg-zinc-950 print:bg-white print:pb-0 print:pt-0">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">

          {/* ── Page header ── */}
          <ScrollReveal className="print:block">
            <header className="mb-12 print:mb-8">
              {/* Back link */}
              <p className="mb-8 print:hidden">
                <Link
                  href="/"
                  className="text-sm text-zinc-500 underline-offset-4 transition hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  ← Back to site
                </Link>
              </p>

              {/* Name + headline row */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 print:text-3xl print:text-black">
                    {siteName}
                  </h1>
                  {headline ? (
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
                      {headline}
                    </p>
                  ) : null}
                  <ContactLine contact={contact} />
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 items-center print:hidden">
                  <a
                    href={resumePdfPath}
                    download
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  >
                    <Download className="size-4 shrink-0" aria-hidden />
                    Download Full Resume
                  </a>
                </div>
              </div>

              <div className="mt-8 border-b border-zinc-200 dark:border-zinc-800 print:border-zinc-300" />
            </header>
          </ScrollReveal>

          {/* ── Tab toggle (print: always show web view) ── */}
          <ScrollReveal delay={0.07} className="print:block">
            <div className="print:hidden">
              <ResumeViewToggle pdfPath={resumePdfPath}>
                <ResumeWebView />
              </ResumeViewToggle>
            </div>

            {/* Print-only: always render web view (iframe won't print) */}
            <div className="hidden print:block">
              <ResumeWebView />
            </div>
          </ScrollReveal>

        </div>
      </main>
    </>
  );
}
