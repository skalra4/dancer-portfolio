import { NavbarWrapper } from "./components/NavbarWrapper";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <>
      <NavbarWrapper />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
    </>
  );
}
