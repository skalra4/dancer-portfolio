"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Play } from "lucide-react";

const ASPECT_BOX = "relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900";

function extractYoutubeId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id.length === 11 ? id : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && v.length === 11) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]?.length === 11)
        return parts[embedIdx + 1]!;
      const shortIdx = parts.indexOf("shorts");
      if (shortIdx >= 0 && parts[shortIdx + 1]?.length === 11)
        return parts[shortIdx + 1]!;
    }
  } catch {
    return null;
  }
  return null;
}

function extractVimeoId(input: string): string | null {
  const s = input.trim();
  if (/^\d+$/.test(s)) return s;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    const parts = u.pathname.split("/").filter(Boolean);
    const videoIdx = parts.indexOf("video");
    if (videoIdx >= 0 && /^\d+$/.test(parts[videoIdx + 1] ?? ""))
      return parts[videoIdx + 1]!;
    const last = parts[parts.length - 1];
    if (last && /^\d+$/.test(last)) return last;
  } catch {
    return null;
  }
  return null;
}

function EmbedFacade({
  title,
  label,
  thumbnail,
  onActivate,
}: {
  title?: string;
  label: string;
  thumbnail?: ReactNode;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onActivate}
      className={`${ASPECT_BOX} group cursor-pointer border-0 p-0 text-left shadow-md ring-1 ring-zinc-200 transition hover:ring-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:ring-zinc-700 dark:hover:ring-zinc-500 dark:focus-visible:outline-zinc-100`}
      aria-label={label}
    >
      <span className="absolute inset-0 z-0">{thumbnail}</span>
      <span
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35"
        aria-hidden
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg transition group-hover:scale-105">
          <Play className="size-8 ml-1" fill="currentColor" />
        </span>
      </span>
      {title ? (
        <span className="sr-only">{title}</span>
      ) : null}
    </button>
  );
}

function YoutubePlayer({
  idOrUrl,
  title,
  className,
}: {
  idOrUrl: string;
  title?: string;
  className?: string;
}) {
  const id = extractYoutubeId(idOrUrl);
  const [active, setActive] = useState(false);

  if (!id) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400" role="alert">
        Invalid YouTube URL or video ID.
      </p>
    );
  }

  const thumbSrc = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;

  if (active) {
    return (
      <div className={`${ASPECT_BOX} ${className ?? ""}`}>
        <iframe
          title={title ?? "YouTube video"}
          src={embedSrc}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <EmbedFacade
        title={title}
        label={title ? `Play video: ${title}` : "Play YouTube video"}
        thumbnail={
          <Image
            src={thumbSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 80vw"
            priority={false}
          />
        }
        onActivate={() => setActive(true)}
      />
    </div>
  );
}

function VimeoPlayer({
  idOrUrl,
  title,
  posterUrl,
  className,
}: {
  idOrUrl: string;
  title?: string;
  posterUrl?: string;
  className?: string;
}) {
  const id = extractVimeoId(idOrUrl);
  const [active, setActive] = useState(false);

  if (!id) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400" role="alert">
        Invalid Vimeo URL or video ID.
      </p>
    );
  }

  const embedSrc = `https://player.vimeo.com/video/${id}?autoplay=1`;

  if (active) {
    return (
      <div className={`${ASPECT_BOX} ${className ?? ""}`}>
        <iframe
          title={title ?? "Vimeo video"}
          src={embedSrc}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <EmbedFacade
        title={title}
        label={title ? `Play video: ${title}` : "Play Vimeo video"}
        thumbnail={
          posterUrl ? (
            <Image
              src={posterUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          ) : (
            <span className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
          )
        }
        onActivate={() => setActive(true)}
      />
    </div>
  );
}

function Html5Video({
  src,
  poster,
  mimeType,
  title,
  className,
}: {
  src: string;
  poster?: string;
  mimeType?: string;
  title?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const labelId = useId();

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: "180px", threshold: 0.01 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad && videoRef.current) videoRef.current.load();
  }, [shouldLoad, src]);

  return (
    <div ref={containerRef} className={className}>
      <div className={ASPECT_BOX}>
        <video
          ref={videoRef}
          id={labelId}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          playsInline
          preload={shouldLoad ? "metadata" : "none"}
          poster={poster}
          aria-label={title ?? "Video"}
        >
          {shouldLoad ? (
            <source src={src} type={mimeType ?? "video/mp4"} />
          ) : null}
        </video>
      </div>
    </div>
  );
}

export type VideoPlayerProps =
  | {
      kind: "youtube";
      /** Full watch URL, youtu.be link, or 11-character video ID */
      idOrUrl: string;
      title?: string;
      className?: string;
    }
  | {
      kind: "vimeo";
      /** Vimeo page URL or numeric video ID */
      idOrUrl: string;
      /** Optional thumbnail (remote URL must be allowed in `next.config`) */
      posterUrl?: string;
      title?: string;
      className?: string;
    }
  | {
      kind: "html5";
      /** Direct URL to video file (e.g. in `/public/video/reel.mp4`) */
      src: string;
      poster?: string;
      mimeType?: string;
      title?: string;
      className?: string;
    };

/**
 * Performance-friendly video:
 * - **YouTube / Vimeo**: click-to-play facade (no iframe until the user taps); uses `youtube-nocookie` for YouTube.
 * - **HTML5**: `preload="none"` until the block is near the viewport, then loads metadata only.
 */
export function VideoPlayer(props: VideoPlayerProps) {
  if (props.kind === "youtube") {
    return (
      <YoutubePlayer
        idOrUrl={props.idOrUrl}
        title={props.title}
        className={props.className}
      />
    );
  }
  if (props.kind === "vimeo") {
    return (
      <VimeoPlayer
        idOrUrl={props.idOrUrl}
        title={props.title}
        posterUrl={props.posterUrl}
        className={props.className}
      />
    );
  }
  return (
    <Html5Video
      src={props.src}
      poster={props.poster}
      mimeType={props.mimeType}
      title={props.title}
      className={props.className}
    />
  );
}
