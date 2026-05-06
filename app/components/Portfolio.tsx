"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  PORTFOLIO_CATEGORIES,
  siteConfig,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/config/siteConfig";
import { ScrollReveal } from "./ScrollReveal";

export type { PortfolioCategory };

const ALL_FILTERS: Array<PortfolioCategory | "all"> = ["all", ...PORTFOLIO_CATEGORIES];

/**
 * Aspect ratios cycle for masonry "All" view.
 * These must be literal strings for Tailwind to include them in the build.
 */
const MASONRY_RATIOS = [
  "3/4", "4/3", "1/1", "2/3", "4/3",
  "1/1", "3/4", "16/9", "4/3", "2/3",
];

type PortfolioProps = { standalone?: boolean };

export function Portfolio({ standalone = false }: PortfolioProps) {
  const { portfolio: projects, portfolioSection } = siteConfig;
  const [active, setActive] = useState<PortfolioCategory | "all">("all");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const reduceMotion = useReducedMotion();

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

  const lightboxIndex = useMemo(
    () => (lightboxItem ? visible.findIndex((p) => p.id === lightboxItem.id) : -1),
    [lightboxItem, visible],
  );

  const goNext = useCallback(() => {
    if (lightboxIndex >= 0 && lightboxIndex < visible.length - 1)
      setLightboxItem(visible[lightboxIndex + 1]!);
  }, [lightboxIndex, visible]);

  const goPrev = useCallback(() => {
    if (lightboxIndex > 0) setLightboxItem(visible[lightboxIndex - 1]!);
  }, [lightboxIndex, visible]);

  useEffect(() => {
    if (!lightboxItem) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxItem, goNext, goPrev]);

  useEffect(() => {
    document.body.style.overflow = lightboxItem ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxItem]);

  const isMasonry = active === "all";

  const cardTransition: Transition = {
    type: "spring",
    bounce: 0.05,
    duration: reduceMotion ? 0 : 0.55,
  };

  const stagger = (i: number): Transition => ({
    duration: reduceMotion ? 0 : 0.4,
    delay: reduceMotion ? 0 : i * 0.055,
    ease: [0.22, 1, 0.36, 1],
  });

  return (
    <section
      id="portfolio"
      className={`scroll-mt-20 bg-white px-4 py-20 sm:px-6 lg:px-8 dark:bg-zinc-900 ${
        standalone ? "" : "border-t border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Header ── */}
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-zinc-900 sm:text-4xl dark:text-zinc-100">
              {portfolioSection.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
              {portfolioSection.description}
            </p>
          </div>
        </ScrollReveal>

        {/* ── Filter pills ── */}
        <ScrollReveal delay={0.08}>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {ALL_FILTERS.map((key) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-transparent text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                  }`}
                >
                  {key === "all" ? "All" : key}
                </button>
              );
            })}
          </div>

          {/* Layout hint */}
          <AnimatePresence mode="wait">
            <motion.p
              key={isMasonry ? "masonry-hint" : "grid-hint"}
              className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMasonry
                ? "Collage view · select a category for a uniform grid"
                : "Click any image to expand"}
            </motion.p>
          </AnimatePresence>
        </ScrollReveal>

        {/* ── Grid / Masonry ── */}
        <AnimatePresence mode="wait">
          {isMasonry ? (
            /* ─── MASONRY: CSS columns, varying aspect ratios ─── */
            <motion.div
              key="masonry"
              className="mt-10 columns-2 gap-3 md:columns-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {visible.map((project, i) => (
                <motion.div
                  key={project.id}
                  className="mb-3 break-inside-avoid"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={stagger(i)}
                >
                  <PortfolioCard
                    project={project}
                    aspectRatio={MASONRY_RATIOS[i % MASONRY_RATIOS.length]!}
                    cardTransition={cardTransition}
                    onClick={() => setLightboxItem(project)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* ─── TILE GRID: uniform squares ─── */
            <motion.ul
              key={`grid-${active}`}
              className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3"
              role="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {visible.map((project, i) => (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={stagger(i)}
                >
                  <PortfolioCard
                    project={project}
                    aspectRatio="1/1"
                    cardTransition={cardTransition}
                    onClick={() => setLightboxItem(project)}
                  />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {visible.length === 0 && (
          <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
            No projects in this category yet.
          </p>
        )}
      </div>

      {/* ── Lightbox ── */}
      <Lightbox
        item={lightboxItem}
        index={lightboxIndex}
        total={visible.length}
        onClose={() => setLightboxItem(null)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  );
}

/* ─────────────────────────────────────
   PortfolioCard
───────────────────────────────────── */
function PortfolioCard({
  project,
  aspectRatio,
  cardTransition,
  onClick,
}: {
  project: PortfolioItem;
  aspectRatio: string;
  cardTransition: Transition;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
      aria-label={`View ${project.title}`}
    >
      {/* Image — shared layout element for lightbox transition */}
      <motion.div
        layoutId={`img-${project.id}`}
        className="relative w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700"
        style={{ aspectRatio }}
        transition={cardTransition}
      >
        <Image
          src={project.imageUrl}
          alt={`${project.title} — ${project.category}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {/* Subtle dark vignette on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
      </motion.div>

      {/* Caption */}
      <div className="mt-2 px-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {project.category}
        </span>
        <p className="mt-0.5 text-sm font-medium text-zinc-800 transition-colors group-hover:text-zinc-500 dark:text-zinc-200 dark:group-hover:text-zinc-400">
          {project.title}
        </p>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────
   Lightbox
───────────────────────────────────── */
function Lightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: PortfolioItem | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const reduceMotion = useReducedMotion();

  const spring: Transition = {
    type: "spring",
    bounce: 0.05,
    duration: reduceMotion ? 0 : 0.55,
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/92 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* ── Shared-layout image: flies from the card ── */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={item.id}
              layoutId={`img-${item.id}`}
              className="relative z-10 overflow-hidden rounded-xl shadow-2xl"
              style={{
                width: "min(88vw, 960px)",
                height: "min(78vh, 680px)",
              }}
              transition={spring}
            >
              <Image
                src={
                  item.imageUrl.includes("images.unsplash.com")
                    ? item.imageUrl.replace(/w=\d+/, "w=2400")
                    : item.imageUrl
                }
                alt={item.title}
                fill
                className="object-cover"
                sizes="88vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          <motion.div
            className="absolute bottom-8 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.28, duration: 0.3 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
              {item.category}
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-medium text-white">
              {item.title}
            </p>
            {total > 1 && (
              <p className="mt-1 text-xs tabular-nums text-white/30">
                {index + 1} / {total}
              </p>
            )}
          </motion.div>

          {/* ── Controls ── */}
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Close lightbox"
          >
            <X className="size-5" />
          </button>

          {/* Prev */}
          {index > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Next */}
          {index < total - 1 && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
