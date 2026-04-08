export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-wall px-6 py-16 text-slate-900">
      <div className="max-w-xl rounded-[2rem] border border-white/70 bg-white/85 px-8 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
          Not Found
        </p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-[0.08em] text-slate-800">
          Page Missing
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The page you requested could not be found. Return to the calendar to continue planning
          your month.
        </p>
      </div>
    </main>
  );
}
