"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Arrow from "./Arrow";
import { M, SOCIALS } from "@/lib/data";

export default function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="bg-black text-paper">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 lg:h-[100svh] lg:min-h-[620px]">
        <div className="relative min-h-[48vh] lg:min-h-0">
          <div className="ht absolute inset-0" data-reveal>
            <img src={M("city-night")} alt="Jalan kota di malam hari" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
        </div>

        <div className="grain bg-paper text-ink flex flex-col justify-between px-5 md:px-10 pt-16 lg:pt-[calc(64px+4vh)] pb-8 lg:pb-[3vh]">
          <h2 className="cmp text-[11.2vw] sm:text-[10vw] lg:text-[min(6vw,10.5vh)]">
            Jangan ketinggalan.<br />
            <span className="text-blue">Ikuti</span> kami.
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-14 lg:mt-[3vh]">
            <p className="cmp text-2xl md:text-3xl lg:text-[min(1.875rem,3.4vh)]">Ringkasan pasar tiap pagi, langsung ke email</p>
            {sent ? (
              <p className="mt-6 cmp text-5xl text-blue">Terima kasih. Cek kotak masuk Anda.</p>
            ) : (
              <div className="mt-5 flex items-center gap-4 border-b-2 border-ink">
                <label htmlFor="email" className="sr-only">Email</label>
                <input id="email" type="email" required placeholder="email@anda.com"
                  className="flex-1 min-w-0 bg-transparent cmp text-[11vw] sm:text-6xl lg:text-[min(4.5rem,8vh)] py-1 outline-none placeholder:text-ink/25 lowercase" />
                <button aria-label="Daftar" className="grid place-items-center size-14 md:size-16 border border-ink hover:bg-blue hover:border-blue hover:text-white transition-colors text-2xl"><Arrow /></button>
              </div>
            )}
            <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" required className="accent-[var(--blue)]" /> Saya setuju menerima email dari Cryptonite</label>
          </form>

          <div className="mt-16 lg:mt-[3vh]">
            <div className="flex flex-wrap gap-x-5 gap-y-2 lbl">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-blue">Instagram</a>
              <a href={SOCIALS.threads} target="_blank" rel="noreferrer" className="hover:text-blue">Threads</a>
              <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="hover:text-blue">Facebook</a>
            </div>
            <p className="mt-8 lg:mt-[2.2vh] text-xs leading-relaxed text-ink/60 max-w-xl">
              Konten Cryptonite bersifat edukasi dan informasi, bukan nasihat keuangan atau ajakan membeli aset apa pun. Aset kripto berisiko tinggi dan nilainya bisa turun drastis. Lakukan riset sendiri.
            </p>
            <div className="mt-6 lg:mt-[2vh] pt-4 border-t border-ink/25 flex justify-between lbl text-ink/70">
              <span>© {new Date().getFullYear()} Cryptonite</span>
              <span>Foto: Unsplash</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
