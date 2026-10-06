const highlightImages = [
  '/yearly-event-calendar/1.jpeg',
  '/yearly-event-calendar/2.jpeg',
  '/yearly-event-calendar/3.jpeg',
  '/yearly-event-calendar/4.jpeg',
];

export default function YearlyEventCalendarPage() {
  return (
    <main className="bg-[#eeeeee] text-gray-900">
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-100/80">Calendar</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Yearly Event Calendar</h1>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {highlightImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`Yearly event calendar image ${index + 1}`}
                className="h-[540px] w-full rounded-sm object-cover shadow-md ring-1 ring-black/5"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
