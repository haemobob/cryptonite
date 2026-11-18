import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Stories from "@/components/Stories";
import WordMarquee from "@/components/WordMarquee";
import BlueField from "@/components/BlueField";
import Pillars from "@/components/Pillars";
import Kelas from "@/components/Kelas";
import Social from "@/components/Social";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Manifesto />
      <Stories />
      <WordMarquee />
      <BlueField />
      <Pillars />
      <Kelas />
      <Social />
      <Footer />
    </main>
  );
}
