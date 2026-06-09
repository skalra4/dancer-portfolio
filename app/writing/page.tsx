import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { NavbarWrapper } from "../components/NavbarWrapper";
import { ScrollReveal } from "../components/ScrollReveal";
import { fetchSiteSettings } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const { seoDescription } = await fetchSiteSettings();
  return {
    title: "Writing",
    description: seoDescription,
  };
}

export default async function WritingPage() {
  const { siteName, writingSamplePdfUrl } = await fetchSiteSettings();
  const hasPdf = Boolean(writingSamplePdfUrl);

  return (
    <>
      <NavbarWrapper />
      <main className="flex min-h-screen flex-1 flex-col bg-zinc-50 pb-24 pt-24 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-3xl px-6 sm:px-8">

          {/* ── Header ── */}
          <ScrollReveal>
            <header className="mb-10">
              <p className="mb-8">
                <Link
                  href="/"
                  className="text-sm text-zinc-500 underline-offset-4 transition hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  ← Back to site
                </Link>
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
                    {siteName}
                  </h1>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Writing Sample
                  </p>
                </div>

                {hasPdf ? (
                  <a
                    href={writingSamplePdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  >
                    <Download className="size-4 shrink-0" aria-hidden />
                    Download
                  </a>
                ) : null}
              </div>
              <div className="mt-8 border-b border-zinc-200 dark:border-zinc-800" />
            </header>
          </ScrollReveal>

          {/* ── PDF viewer or placeholder ── */}
          <ScrollReveal delay={0.07}>
            {hasPdf ? (
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <iframe
                  src={`${writingSamplePdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  title="Writing Sample PDF"
                  className="h-[80vh] min-h-[640px] w-full"
                  loading="lazy"
                />
                <p className="border-t border-zinc-200 px-5 py-3 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  Can&apos;t view the PDF?{" "}
                  <a
                    href={writingSamplePdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                  >
                    Download it directly.
                  </a>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-300 bg-white px-8 py-20 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <FileText className="size-10 text-zinc-300 dark:text-zinc-600" aria-hidden />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No writing sample uploaded yet.
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Upload a PDF in{" "}
                  <Link
                    href="/studio"
                    className="font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                  >
                    Sanity Studio
                  </Link>{" "}
                  → Site Settings → Writing Sample PDF.
                </p>
              </div>
            )}
          </ScrollReveal>

        </div>
      </main>
    </>
  );
}
