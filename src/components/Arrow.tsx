export default function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-[1em] h-[1em] ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M3 12h17M13 5l7 7-7 7" />
    </svg>
  );
}
