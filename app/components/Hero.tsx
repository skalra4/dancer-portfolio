import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center"
    >
      <div className="absolute inset-0">
        <Image
          src={hero.backgroundImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 text-center pt-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/85 sm:text-sm">
          {hero.roleTagline}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl font-normal tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
          {hero.subtitle}
        </p>
        <Link
          href={hero.ctaHref}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {hero.ctaLabel}
          <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
