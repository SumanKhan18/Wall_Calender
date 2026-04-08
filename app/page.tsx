import { WallCalendar } from "@/components/calendar/wall-calendar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-wall px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center">
        <WallCalendar />
      </div>
    </main>
  );
}
