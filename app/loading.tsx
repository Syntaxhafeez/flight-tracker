import { Loader2, Plane } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-panel flex w-full max-w-md flex-col items-center rounded-[30px] p-7 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-accent/30 bg-accent/10 text-accent">
          <Plane size={24} />
          <Loader2 className="absolute -right-1 -top-1 animate-spin text-accent" size={18} />
        </div>
        <p className="mt-5 section-label">Loading AeroTrack</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Preparing live flight tools, airport boards, and seat map information.
        </p>
      </div>
    </main>
  );
}
