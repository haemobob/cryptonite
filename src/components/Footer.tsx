"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Arrow from "./Arrow";
import { M, SOCIALS } from "@/lib/data";

export default function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="theme-blue" data-cursor-dark>
      <div className="grid lg:grid-cols-2 lg:h-[100svh] lg:min-h-[620px]">
        <div className="relative min-h-[48vh] lg:min-h-0">
          <div className="ht ht-ink absolute inset-0" data-reveal>
            <img src={M("city-night")} alt="Jalan kota di malam hari" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
        </div>

        <div className="flex flex-col justify-between px-4 md:px-10 pt-16 lg:pt-[calc(64px+4vh)] pb-8 lg:pb-[3vh]">
          <div>
            <div className="flex justify-between gap-6 lbl muted border-t border-current/20 pt-3">
              <span>Newsletter</span><span>Setiap pagi</span>
            </div>
            <h2 className="t-title mt-6 lg:mt-[3vh] lg:text-[min(6.6vw,11vh)]">
              <span className="cmp-out">Jangan</span><br />ketinggalan.
            </h2>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-12 lg:mt-[3vh]">
            <p className="t-lead muted">Ringkasan pasar tiap pagi, langsung ke email Anda.</p>
            {sent ? (
              <p className="mt-6 t-item">Terima kasih. Cek kotak masuk Anda.</p>
            ) : (
              <div className="mt-4 flex items-center gap-4 border-b border-white/50 focus-within:border-white">
                <label htmlFor="email" className="sr-only">Email</label>
                <input id="email" type="email" required placeholder="email@anda.com"
                  className="flex-1 min-w-0 bg-transparent t-item py-3 outline-none placeholder:text-white/40" />
                <button aria-label="Daftar" className="btn !gap-3 mb-2">Daftar <Arrow /></button>
              </div>
            )}
            <label className="mt-4 flex items-center gap-2 t-body muted !text-sm"><input type="checkbox" required className="accent-white" /> Saya setuju menerima email dari Cryptonite</label>
          </form>

          <div className="mt-14 lg:mt-[3vh]">
            <div className="flex flex-wrap gap-x-6 gap-y-2 lbl">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-black"><span className="roll"><span>Instagram</span></span></a>
              <a href={SOCIALS.threads} target="_blank" rel="noreferrer" className="hover:text-black"><span className="roll"><span>Threads</span></span></a>
              <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="hover:text-black"><span className="roll"><span>Facebook</span></span></a>
            </div>
            <p className="mt-6 lg:mt-[2.2vh] text-xs leading-relaxed muted max-w-xl">
              Konten Cryptonite bersifat edukasi dan informasi, bukan nasihat keuangan atau ajakan membeli aset apa pun. Aset kripto berisiko tinggi dan nilainya bisa turun drastis. Lakukan riset sendiri.
            </p>
            <div className="mt-6 lg:mt-[2vh] pt-3 border-t border-white/30 flex justify-between lbl muted">
              <span>© {new Date().getFullYear()} Cryptonite</span>
              <span>Foto: Unsplash</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
