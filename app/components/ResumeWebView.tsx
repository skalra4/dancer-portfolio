import { resumeData } from "@/data/resume";

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

function YearBadge({ year }: { year: string }) {
  return (
    <p className="mt-1 shrink-0 text-sm tabular-nums text-zinc-500 dark:text-zinc-400 sm:mt-0 sm:text-right">
      {year}
    </p>
  );
}

export function ResumeWebView() {
  return (
    <div className="space-y-16">
      {/* Education */}
      <section aria-labelledby="edu-heading">
        <SectionHeading id="edu-heading">Education</SectionHeading>
        <ul className="space-y-10">
          {resumeData.education.map((entry) => (
            <li key={entry.id}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {entry.institution}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {entry.credential}
                    {entry.location ? ` · ${entry.location}` : null}
                  </p>
                </div>
                <YearBadge year={entry.year} />
              </div>
              {entry.details ? (
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {entry.details}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {/* Performance Experience */}
      <section aria-labelledby="perf-heading">
        <SectionHeading id="perf-heading">Performance Experience</SectionHeading>
        <ul className="space-y-10">
          {resumeData.performanceExperience.map((entry) => (
            <li key={entry.id}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {entry.work}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium">{entry.role}</span>
                    {entry.organization ? ` · ${entry.organization}` : null}
                    {entry.location ? ` · ${entry.location}` : null}
                  </p>
                </div>
                <YearBadge year={entry.year} />
              </div>
              {entry.notes ? (
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {entry.notes}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {/* Awards */}
      <section aria-labelledby="awards-heading">
        <SectionHeading id="awards-heading">Awards</SectionHeading>
        <ul className="space-y-8">
          {resumeData.awards.map((entry) => (
            <li key={entry.id}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {entry.title}
                </h3>
                <YearBadge year={entry.year} />
              </div>
              {entry.issuer ? (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {entry.issuer}
                </p>
              ) : null}
              {entry.description ? (
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {entry.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
