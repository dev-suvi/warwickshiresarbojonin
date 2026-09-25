export default function ProgrammeSchedulePage() {
  return (
    <main className="bg-[#ededed] text-[#1a1a1a]">
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-100/80">
            Schedule
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Durga Puja Programme Schedule
          </h1>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl justify-center px-4 py-8 sm:px-6 sm:py-12">
        <img
          src="/full-schedule/full-schedule.jpeg"
          alt="Durga Puja full programme schedule"
          className="h-auto w-full max-w-5xl rounded-lg bg-white object-contain shadow-xl"
        />
      </section>
    </main>
  );
}
