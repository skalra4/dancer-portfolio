"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { Camera, Music2, Play } from "lucide-react";
import type { PortfolioItem } from "@/data/content";

const SPRING: Transition = { type: "spring", bounce: 0.05, duration: 0.55 };
const SPRING_INSTANT: Transition = { type: "spring", bounce: 0, duration: 0 };

export type MediaCardProps = {
  item: PortfolioItem;
  /** CSS aspect-ratio string, e.g. "1/1", "16/9", "3/4" */
  aspectRatio: string;
  /**
   * Passed only for image cards — matches the `layoutId` used in the
   * image lightbox so Framer Motion can FLIP-animate between positions.
   */
  layoutId?: string;
  onImageClick?: () => void;
  onVideoClick?: () => void;
};

/**
 * Unified portfolio card that renders one of three variants based on
 * `item.media.type`: image, video (YouTube / Vimeo), or social (Instagram / TikTok).
 */
export function MediaCard({
  item,
  aspectRatio,
  layoutId,
  onImageClick,
  onVideoClick,
}: MediaCardProps) {
  if (item.media.type === "image")
    return (
      <ImageCard
        item={item}
        aspectRatio={aspectRatio}
        layoutId={layoutId}
        onClick={onImageClick}
      />
    );

  if (item.media.type === "video")
    return <VideoCard item={item} aspectRatio={aspectRatio} onClick={onVideoClick} />;

  return <SocialCard item={item} aspectRatio={aspectRatio} />;
}

/* ─────────────────────────────────────────────────────────────
   Shared caption
───────────────────────────────────────────────────────────── */
function CardCaption({ item }: { item: PortfolioItem }) {
  return (
    <div className="mt-2 px-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {item.category}
      </span>
      <p className="mt-0.5 text-sm font-medium text-zinc-800 transition-colors group-hover:text-zinc-500 dark:text-zinc-200 dark:group-hover:text-zinc-400">
        {item.title}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Image card
   — uses `layoutId` so the thumbnail can FLIP-expand into the
     full-screen lightbox via Framer Motion shared layouts.
───────────────────────────────────────────────────────────── */
function ImageCard({
  item,
  aspectRatio,
  layoutId,
  onClick,
}: {
  item: PortfolioItem;
  aspectRatio: string;
  layoutId?: string;
  onClick?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  if (item.media.type !== "image") return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
      aria-label={`View ${item.title}`}
    >
      <motion.div
        layoutId={layoutId}
        className="relative w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700"
        style={{ aspectRatio }}
        transition={reduceMotion ? SPRING_INSTANT : SPRING}
      >
        <Image
          src={item.media.imageUrl}
          alt={`${item.title} — ${item.category}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/12" />
      </motion.div>
      <CardCaption item={item} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Video card
   — shows a thumbnail (auto-fetched for YouTube; custom or
     gradient fallback for Vimeo) with a centred play button.
     Clicking calls `onVideoClick` which opens a modal iframe.
───────────────────────────────────────────────────────────── */
function VideoCard({
  item,
  aspectRatio,
  onClick,
}: {
  item: PortfolioItem;
  aspectRatio: string;
  onClick?: () => void;
}) {
  if (item.media.type !== "video") return null;
  const { provider, videoId, thumbnailUrl } = item.media;

  const thumb =
    thumbnailUrl ??
    (provider === "youtube"
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : null);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
      aria-label={`Play: ${item.title}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-zinc-900"
        style={{ aspectRatio }}
      >
        {/* Thumbnail */}
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/20" />

        {/* Provider badge — top-left */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {provider}
          </span>
        </div>

        {/* Play button — centred */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-1 size-6" fill="currentColor" />
          </div>
        </div>
      </div>
      <CardCaption item={item} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Social card
   — embeds the post inline with an iframe.  Shows an animated
     skeleton while the iframe is loading.  Platform badge is
     always visible in the top-right corner.
───────────────────────────────────────────────────────────── */
function SocialCard({
  item,
  aspectRatio,
}: {
  item: PortfolioItem;
  aspectRatio: string;
}) {
  const [loaded, setLoaded] = useState(false);
  if (item.media.type !== "social") return null;

  const { provider, postId } = item.media;

  const embedUrl =
    provider === "instagram"
      ? `https://www.instagram.com/p/${postId}/embed/`
      : `https://www.tiktok.com/embed/v2/${postId}`;

  const PlatformIcon = provider === "instagram" ? Camera : Music2;

  return (
    <div className="group w-full">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
        style={{ aspectRatio }}
      >
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-700" />
        )}

        {/* Platform badge — top-right */}
        <div className="absolute right-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            <PlatformIcon className="size-3" aria-hidden />
            {provider}
          </span>
        </div>

        <iframe
          src={embedUrl}
          title={item.title}
          className={`h-full w-full border-0 transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        />
      </div>
      <CardCaption item={item} />
    </div>
  );
}
