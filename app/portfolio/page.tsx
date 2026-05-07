import type { Metadata } from "next";
import { NavbarWrapper } from "../components/NavbarWrapper";
import { Portfolio } from "../components/Portfolio";
import { fetchPortfolioContent } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const { section } = await fetchPortfolioContent();
  return { title: "Portfolio", description: section.description };
}

export default async function PortfolioPage() {
  const { items, categories, section } = await fetchPortfolioContent();

  return (
    <>
      <NavbarWrapper />
      <main className="flex min-h-screen flex-1 flex-col pt-16">
        <Portfolio standalone items={items} categories={categories} section={section} />
      </main>
    </>
  );
}
