type MonthControlsProps = {
  onPrevious: () => void;
  onNext: () => void;
};

function ControlButton({
  direction,
  onClick
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous month" : "Next month"}
      className="rounded-full border border-white/60 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
    >
      {direction === "prev" ? "Prev" : "Next"}
    </button>
  );
}

export function MonthControls({ onPrevious, onNext }: MonthControlsProps) {
  return (
    <div className="absolute right-4 top-4 z-40 flex items-center gap-2 sm:right-8 sm:top-5">
      <ControlButton direction="prev" onClick={onPrevious} />
      <ControlButton direction="next" onClick={onNext} />
    </div>
  );
}
