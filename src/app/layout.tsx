import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Cryptonite — Media Kripto Indonesia",
  description:
    "Edukasi, analisis, berita, dan kabar sosial kripto dalam bahasa yang mudah dicerna. Ikuti Cryptonite di Instagram, Facebook, dan Threads.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="antialiased">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
