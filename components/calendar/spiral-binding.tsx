export function SpiralBinding() {
  return (
    <div className="pointer-events-none absolute inset-x-6 top-1 z-30 hidden h-12 items-start justify-between sm:flex">
      {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className="relative flex w-4 justify-center">
          <span className="absolute top-1 h-4 w-[2px] rounded-full bg-slate-700/80" />
          <span className="absolute top-[2px] h-5 w-3 rounded-b-full border-2 border-slate-700/80 border-t-0" />
        </div>
      ))}
    </div>
  );
}
