import { fetchResumeSections } from "@/sanity/lib/fetch";
import type { ResumeSection, ResumeSectionItem } from "@/data/content";

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="mb-8 border-b border-zinc-200 pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
    >
      {children}
    </h2>
  );
}

function MetaBadge({ meta }: { meta?: string }) {
  if (!meta) return null;
  return (
    <p className="mt-1 shrink-0 text-sm tabular-nums text-zinc-500 dark:text-zinc-400 sm:mt-0 sm:text-right">
      {meta}
    </p>
  );
}

function ResumeItem({ item }: { item: ResumeSectionItem }) {
  return (
    <li>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {item.title}
          </h3>
          {item.subtitle ? (
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{item.subtitle}</p>
          ) : null}
        </div>
        <MetaBadge meta={item.meta} />
      </div>
      {item.notes ? (
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {item.notes}
        </p>
      ) : null}
    </li>
  );
}

function ResumeSectionView({ section }: { section: ResumeSection }) {
  const headingId = `${section.id}-heading`;
  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId}>{section.heading}</SectionHeading>
      {section.items.length > 0 ? (
        <ul className="space-y-10">
          {section.items.map((item) => (
            <ResumeItem key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">No entries yet.</p>
      )}
    </section>
  );
}

/**
 * Async Server Component — fetches resume sections from Sanity (or falls back
 * to data/content.json) via sanity/lib/fetch.ts.
 */
export async function ResumeWebView() {
  const sections = await fetchResumeSections();

  if (sections.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
        Resume content not available.
      </p>
    );
  }

  return (
    <div className="space-y-16">
      {sections.map((section) => (
        <ResumeSectionView key={section.id} section={section} />
      ))}
    </div>
  );
}
