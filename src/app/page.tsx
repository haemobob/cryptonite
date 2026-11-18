import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Headlines from "@/components/Headlines";
import Pillars from "@/components/Pillars";
import SocialRadar from "@/components/SocialRadar";
import Kelas from "@/components/Kelas";
import Feed from "@/components/Feed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Headlines />
      <Pillars />
      <SocialRadar />
      <Kelas />
      <Feed />
      <Footer />
    </main>
  );
}
