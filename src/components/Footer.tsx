"use client";
import { useState } from "react";
import { SOCIALS } from "@/lib/data";

export default function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="bg-ink text-paper px-4 md:px-8 pt-20 pb-6 overflow-hidden">
      <div className="grid md:grid-cols-12 gap-10 items-end">
        <h2 className="md:col-span-7 display-wide text-4xl md:text-6xl">Ringkasan pasar, tiap pagi. Gratis.</h2>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="md:col-span-5">
          {sent ? (
            <p className="text-sky text-xl font-extrabold">Terima kasih. Cek kotak masuk Anda.</p>
          ) : (
            <div className="flex">
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" type="email" required placeholder="email@anda.com" className="flex-1 min-w-0 bg-transparent border-2 border-paper/40 px-4 py-3 outline-none focus:border-sky placeholder:text-paper/40" />
              <button className="bg-blue text-white font-extrabold px-6 hover:bg-white hover:text-ink transition-colors">Daftar</button>
            </div>
          )}
        </form>
      </div>
      <div className="mt-16 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold">
        <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-sky">Instagram</a>
        <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="hover:text-sky">Facebook</a>
        <a href={SOCIALS.threads} target="_blank" rel="noreferrer" className="hover:text-sky">Threads</a>
      </div>
      <p className="display text-[19.5vw] leading-[0.8] mt-10 text-paper/10 select-none whitespace-nowrap" aria-hidden>Cryptonite</p>
      <p className="mt-6 text-xs text-paper/50 max-w-2xl">Konten Cryptonite bersifat edukasi dan informasi, bukan nasihat keuangan atau ajakan membeli aset apa pun. Aset kripto berisiko tinggi dan nilainya bisa turun drastis. Lakukan riset sendiri.</p>
    </footer>
  );
}
