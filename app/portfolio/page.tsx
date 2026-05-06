import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Portfolio } from "../components/Portfolio";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Portfolio",
  description: siteConfig.portfolioSection.description,
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-1 flex-col pt-16">
        <Portfolio standalone />
      </main>
    </>
  );
}
