import type { ReactNode } from "react";

/**
 * The one way every section opens: a label row on a hairline, then a title
 * whose first part is outlined and the rest solid. Optional action on the right.
 */
export default function SectionHead({
  label, meta, outline, solid, action, className = "",
}: { label: string; meta?: string; outline: string; solid: string; action?: ReactNode; className?: string }) {
  return (
    <header className={`sec-head ${className}`}>
      <div className="flex justify-between gap-6 lbl muted border-t border-current/20 pt-3">
        <span>{label}</span>
        {meta && <span className="text-right">{meta}</span>}
      </div>
      <div className="mt-6 md:mt-8 flex flex-wrap items-end justify-between gap-6">
        <h2 className="t-title">
          <span className="mask"><span className="ln"><span className="cmp-out">{outline}</span> {solid}</span></span>
        </h2>
        {action}
      </div>
    </header>
  );
}
