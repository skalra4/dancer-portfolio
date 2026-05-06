"use client";

import { useState, type ReactNode } from "react";
import { FileText, Globe } from "lucide-react";

type Tab = "web" | "document";

export function ResumeViewToggle({
  pdfPath,
  children,
}: {
  pdfPath: string;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("web");

  return (
    <div>
      {/* Tab bar */}
      <div
        className="mb-10 flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 p-1 w-fit dark:border-zinc-700 dark:bg-zinc-800"
        role="tablist"
        aria-label="Resume view"
      >
        <TabButton
          active={tab === "web"}
          id="tab-web"
          controls="panel-web"
          icon={<Globe className="size-3.5" />}
          onClick={() => setTab("web")}
        >
          Web View
        </TabButton>
        <TabButton
          active={tab === "document"}
          id="tab-document"
          controls="panel-document"
          icon={<FileText className="size-3.5" />}
          onClick={() => setTab("document")}
        >
          Document View
        </TabButton>
      </div>

      {/* Web View panel */}
      <div
        id="panel-web"
        role="tabpanel"
        aria-labelledby="tab-web"
        hidden={tab !== "web"}
      >
        {children}
      </div>

      {/* Document View panel */}
      <div
        id="panel-document"
        role="tabpanel"
        aria-labelledby="tab-document"
        hidden={tab !== "document"}
      >
        <PdfViewer pdfPath={pdfPath} />
      </div>
    </div>
  );
}

function TabButton({
  active,
  id,
  controls,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  id: string;
  controls: string;
  icon: ReactNode;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-controls={controls}
      aria-selected={active}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
          : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function PdfViewer({ pdfPath }: { pdfPath: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {/* Tall enough to show roughly two A4 pages without needing to scroll immediately */}
      <iframe
        src={`${pdfPath}#toolbar=1&navpanes=0&scrollbar=1`}
        title="Resume PDF"
        className="h-[80vh] min-h-[640px] w-full"
        loading="lazy"
      />
      {/* Fallback for browsers that block PDF iframes */}
      <p className="border-t border-zinc-200 px-5 py-3 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Can&apos;t view the PDF?{" "}
        <a
          href={pdfPath}
          download
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
        >
          Download it directly.
        </a>
      </p>
    </div>
  );
}
