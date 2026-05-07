import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { fetchSiteSettings } from "@/sanity/lib/fetch";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { siteName, siteTagline, seoDescription } = await fetchSiteSettings();
  const siteUrl = getSiteUrl();
  const title = `${siteName} · ${siteTagline}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s · ${siteName}`,
    },
    description: seoDescription,
    openGraph: {
      type: "website",
      siteName,
      title,
      description: seoDescription,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seoDescription,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
