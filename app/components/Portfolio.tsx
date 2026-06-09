"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import {
  type MediaImage,
  type MediaVideo,
  type PortfolioItem,
} from "@/data/content";
import { displayCategory } from "@/lib/displayCategory";
import { MediaCard } from "./MediaCard";
import { ScrollReveal } from "./ScrollReveal";

// ── Type helpers ────────────────────────────────────────────────────────────
type ImageItem = PortfolioItem & { media: MediaImage };
type VideoItem = PortfolioItem & { media: MediaVideo };

/**
 * Column-span classes.  Grid container = `grid-cols-2 md:grid-cols-6`.
 *   colSpan 1 → col-span-1 md:col-span-2  (1/3 desktop, 1/2 mobile)
 *   colSpan 2 → col-span-2 md:col-span-3  (½ desktop, full mobile)
 *   colSpan 3 → col-span-2 md:col-span-6  (full desktop + mobile)
 */
const COL_SPAN: Record<1 | 2 | 3, string> = {
  1: "col-span-1 md:col-span-2",
  2: "col-span-2 md:col-span-3",
  3: "col-span-2 md:col-span-6",
};

const FALLBACK_ASPECT = "4 / 3";

/** Use real image dimensions when available; fallback for JSON / missing metadata. */
function getImageAspect(item: PortfolioItem): string {
  if (item.media.type !== "image") return FALLBACK_ASPECT;
  const { width, height } = item.media;
  if (width && height && width > 0 && height > 0) return `${width} / ${height}`;
  return FALLBACK_ASPECT;
}

/** Determine the CSS aspect-ratio for a card in the masonry collage view. */
function getMasonryAspect(item: PortfolioItem): string {
  if (item.media.type === "video") return "16 / 9";
  if (item.media.type === "social")
    return item.media.provider === "tiktok" ? "9 / 16" : "1 / 1";
  return getImageAspect(item);
}

/** Determine the CSS aspect-ratio for a card in the filtered tile grid view. */
function getTileAspect(item: PortfolioItem): string {
  if (item.media.type === "video") return "16 / 9";
  if (item.media.type === "social")
    return item.media.provider === "tiktok" ? "9 / 16" : "1 / 1";
  return getImageAspect(item);
}

function getImageDimensions(item: ImageItem): { w: number; h: number } {
  const { width, height } = item.media;
  if (width && height && width > 0 && height > 0) return { w: width, h: height };
  return { w: 4, h: 3 };
}

// ── Portfolio component ──────────────────────────────────────────────────────

/**
 * Props are supplied by the parent Server Component (app/portfolio/page.tsx)
 * which fetches the data from Sanity or the JSON fallback via
 * `fetchPortfolioContent()` in sanity/lib/fetch.ts.
 */
type PortfolioProps = {
  standalone?: boolean;
  items: PortfolioItem[];
  categories: string[];
  section: { title: string; description: string };
};

export function Portfolio({
  standalone = false,
  items,
  categories,
  section,
}: PortfolioProps) {
  const reduceMotion = useReducedMotion();

  const allFilters = useMemo(() => ["all", ...categories], [categories]);

  const [active, setActive] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<ImageItem | null>(null);
  const [videoModal, setVideoModal] = useState<VideoItem | null>(null);

  // All items matching the active filter
  const visible = useMemo(
    () => (active === "all" ? items : items.filter((p) => p.category === active)),
    [active, items],
  );

  // Image-only subset for lightbox navigation
  const imageItems = useMemo(
    () => visible.filter((p): p is ImageItem => p.media.type === "image"),
    [visible],
  );

  const lightboxIndex = useMemo(
    () => (lightboxItem ? imageItems.findIndex((p) => p.id === lightboxItem.id) : -1),
    [lightboxItem, imageItems],
  );

  const goNext = useCallback(() => {
    if (lightboxIndex >= 0 && lightboxIndex < imageItems.length - 1)
      setLightboxItem(imageItems[lightboxIndex + 1]!);
  }, [lightboxIndex, imageItems]);

  const goPrev = useCallback(() => {
    if (lightboxIndex > 0) setLightboxItem(imageItems[lightboxIndex - 1]!);
  }, [lightboxIndex, imageItems]);

  // Keyboard handlers
  useEffect(() => {
    if (!lightboxItem && !videoModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxItem(null);
        setVideoModal(null);
      } else if (lightboxItem) {
        if (e.key === "ArrowRight") goNext();
        else if (e.key === "ArrowLeft") goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxItem, videoModal, goNext, goPrev]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = lightboxItem || videoModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxItem, videoModal]);

  const isMasonry = active === "all";

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
              {section.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
              {section.description}
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
            {allFilters.map((key) => {
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
                  {key === "all" ? "All" : displayCategory(key)}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={isMasonry ? "m" : "g"}
              className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMasonry
                ? "Collage view · select a category for a grid view"
                : "Click an image to expand · click a video to play"}
            </motion.p>
          </AnimatePresence>
        </ScrollReveal>

        {/* ── Layouts ── */}
        <AnimatePresence mode="wait">
          {isMasonry ? (
            /* ── MASONRY: CSS columns, media-aware aspect ratios ── */
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
                  <MediaCard
                    item={project}
                    aspectRatio={getMasonryAspect(project)}
                    layoutId={project.media.type === "image" ? `img-${project.id}` : undefined}
                    onImageClick={
                      project.media.type === "image"
                        ? () => setLightboxItem(project as ImageItem)
                        : undefined
                    }
                    onVideoClick={
                      project.media.type === "video"
                        ? () => setVideoModal(project as VideoItem)
                        : undefined
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* ── ARTISTIC TILE GRID: 6-col base, varying colSpan ── */
            <motion.ul
              key={`grid-${active}`}
              className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6"
              role="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {visible.map((project, i) => {
                const cs = (project.colSpan ?? 1) as 1 | 2 | 3;
                return (
                  <motion.li
                    key={project.id}
                    className={COL_SPAN[cs]}
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={stagger(i)}
                  >
                    <MediaCard
                      item={project}
                      aspectRatio={getTileAspect(project)}
                      layoutId={project.media.type === "image" ? `img-${project.id}` : undefined}
                      onImageClick={
                        project.media.type === "image"
                          ? () => setLightboxItem(project as ImageItem)
                          : undefined
                      }
                      onVideoClick={
                        project.media.type === "video"
                          ? () => setVideoModal(project as VideoItem)
                          : undefined
                      }
                    />
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>

        {visible.length === 0 && (
          <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
            No projects in this category yet.
          </p>
        )}
      </div>

      {/* ── Image lightbox ── */}
      <ImageLightbox
        item={lightboxItem}
        index={lightboxIndex}
        total={imageItems.length}
        onClose={() => setLightboxItem(null)}
        onPrev={goPrev}
        onNext={goNext}
      />

      {/* ── Video modal ── */}
      <VideoModal item={videoModal} onClose={() => setVideoModal(null)} />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Image lightbox
   Shared-layout animation: the `layoutId` links the thumbnail
   in the grid to the full-screen image here via Framer Motion.
───────────────────────────────────────────────────────────── */
function ImageLightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: ImageItem | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const spring: Transition = { type: "spring", bounce: 0.05, duration: reduceMotion ? 0 : 0.55 };

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

          {/* Shared-layout image — container matches photo aspect ratio */}
          <AnimatePresence mode="popLayout">
            {(() => {
              const { w, h } = getImageDimensions(item);
              return (
                <motion.div
                  key={item.id}
                  layoutId={`img-${item.id}`}
                  className="relative z-10 overflow-hidden rounded-xl shadow-2xl"
                  style={{
                    aspectRatio: `${w} / ${h}`,
                    width: `min(960px, 88vw, calc(78vh * ${w} / ${h}))`,
                  }}
                  transition={spring}
                >
                  <Image
                    src={
                      item.media.imageUrl.includes("images.unsplash.com")
                        ? item.media.imageUrl.replace(/w=\d+/, "w=2400")
                        : item.media.imageUrl
                    }
                    alt={item.title}
                    fill
                    className="object-contain object-center"
                    sizes="88vw"
                    priority
                  />
                </motion.div>
              );
            })()}
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
              {displayCategory(item.category)}
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

          {/* Controls */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
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

/* ─────────────────────────────────────────────────────────────
   Video modal
   Simple fade + scale — no shared layout animation needed
   since there is no thumbnail in the lightbox.
───────────────────────────────────────────────────────────── */
function VideoModal({
  item,
  onClose,
}: {
  item: VideoItem | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/92 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Embed container */}
          <motion.div
            className="relative z-10 w-full max-w-[960px]"
            initial={{ scale: reduceMotion ? 1 : 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: reduceMotion ? 1 : 0.94, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.05, duration: reduceMotion ? 0 : 0.45 }}
          >
            <div className="aspect-video overflow-hidden rounded-xl shadow-2xl">
              <iframe
                src={
                  item.media.provider === "youtube"
                    ? `https://www.youtube-nocookie.com/embed/${item.media.videoId}?autoplay=1&rel=0`
                    : `https://player.vimeo.com/video/${item.media.videoId}?autoplay=1`
                }
                title={item.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                {displayCategory(item.category)} · {item.media.provider}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-medium text-white">
                {item.title}
              </p>
            </div>
          </motion.div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Close video"
          >
            <X className="size-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
