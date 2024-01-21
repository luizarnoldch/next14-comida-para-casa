import WeekCalendar from "@/components/calendar/WeekCalendar";
import Planning from "@/components/planning/Planning";

export default function Home() {
  return (
    <main className="h-screen pt-[50px] bg-red-400">
      <div className="container mx-auto flex flex-col gap-8 py-16">
        {/* Roll And Creation */}
        <Planning />
        {/* Week Calendar */}
        <WeekCalendar />
      </div>
    </main>
  );
}
