import { WallCalendar } from "@/components/calendar/wall-calendar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-wall px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full items-center justify-center lg:w-[65vw] lg:max-w-[1200px]">
        <WallCalendar />
      </div>
    </main>
  );
}
