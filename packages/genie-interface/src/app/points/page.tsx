import Hero from "@components/Points/hero";
import Sections from "@components/Points/sections";

export default function Leaderboard() {
  return (
    <main className="pl-3 md:pl-[88px] pr-3 md:pr-[84px] pt-5 md:pt-16 pb-4 md:pb-10 overflow-hidden">
      <Hero />
      <Sections />
    </main>
  );
}
