const scheduleRows = [
  { date: '16-Oct-26', day: 'Friday', pujaDay: 'Sasthi', time: '11:00 AM', details: 'Puja Mandap Decoration', color: 'bg-amber-100' },
  { date: '16-Oct-26', day: 'Friday', pujaDay: 'Sasthi', time: '12:00 PM', details: 'Kitchen Tent Set-up', color: 'bg-amber-100' },
  { date: '16-Oct-26', day: 'Friday', pujaDay: 'Sasthi', time: '5:00 PM', details: 'Puja Prayer Begins', color: 'bg-green-200' },
  { date: '16-Oct-26', day: 'Friday', pujaDay: 'Sasthi', time: '6:00 PM', details: 'Dhak & Cultural Performance', color: 'bg-green-200' },
  { date: '16-Oct-26', day: 'Friday', pujaDay: 'Sasthi', time: '8:00 PM', details: 'Anjali & Bhog Distribution', color: 'bg-green-200' },
  { date: '17-Oct-26', day: 'Saturday', pujaDay: 'Saptami', time: '9:00 AM', details: 'Puja & Aarti', color: 'bg-green-200' },
  { date: '17-Oct-26', day: 'Saturday', pujaDay: 'Saptami', time: '11:00 AM', details: 'Sandhya Arati', color: 'bg-green-300' },
  { date: '17-Oct-26', day: 'Saturday', pujaDay: 'Saptami', time: '1:00 PM', details: 'Cultural Program', color: 'bg-green-300' },
  { date: '17-Oct-26', day: 'Saturday', pujaDay: 'Saptami', time: '3:30 PM', details: 'Pitha & Bhog', color: 'bg-green-200' },
  { date: '17-Oct-26', day: 'Saturday', pujaDay: 'Saptami', time: '6:00 PM', details: 'Evening Arati', color: 'bg-yellow-200' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '8:00 AM', details: 'Pushpanjali & Aarti', color: 'bg-green-200' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '10:30 AM', details: 'Dhaak Starts', color: 'bg-green-300' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '12:00 PM', details: 'Prasad Distribution', color: 'bg-yellow-200' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '3:00 PM', details: 'Sandhya Arati', color: 'bg-green-300' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '6:30 PM', details: 'Cultural Show', color: 'bg-yellow-200' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '9:00 PM', details: 'Community Dinner', color: 'bg-green-200' },
  { date: '19-Oct-26', day: 'Monday', pujaDay: 'Nabami & Dashami', time: '9:00 AM', details: 'Morning Puja', color: 'bg-green-200' },
  { date: '19-Oct-26', day: 'Monday', pujaDay: 'Nabami & Dashami', time: '1:00 PM', details: 'Mahaprasad', color: 'bg-yellow-200' },
  { date: '19-Oct-26', day: 'Monday', pujaDay: 'Nabami & Dashami', time: '2:30 PM', details: 'Bisarjan & Arati', color: 'bg-green-300' },
  { date: '19-Oct-26', day: 'Monday', pujaDay: 'Nabami & Dashami', time: '5:00 PM', details: 'Dhol & Dance Program', color: 'bg-green-200' },
  { date: '19-Oct-26', day: 'Monday', pujaDay: 'Nabami & Dashami', time: '7:00 PM', details: 'Farewell Ceremony', color: 'bg-yellow-200' },
  { date: '20-Oct-26', day: 'Tuesday', pujaDay: 'Visarjan', time: '12:00 PM', details: 'Immersion & Closing', color: 'bg-amber-100' },
];

const secondTableRows = [
  { date: '16-Oct-26', day: 'Friday', pujaDay: 'Sasthi', time: '12:00 PM', details: 'Kitchen Tent Set-up', color: 'bg-amber-100' },
  { date: '16-Oct-26', day: 'Friday', pujaDay: 'Sasthi', time: '5:00 PM', details: 'Puja Prayer Begins', color: 'bg-green-200' },
  { date: '17-Oct-26', day: 'Saturday', pujaDay: 'Saptami', time: '11:00 AM', details: 'Sandhya Arati', color: 'bg-green-300' },
  { date: '17-Oct-26', day: 'Saturday', pujaDay: 'Saptami', time: '3:30 PM', details: 'Pitha & Bhog', color: 'bg-green-200' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '10:30 AM', details: 'Dhaak Starts', color: 'bg-green-300' },
  { date: '18-Oct-26', day: 'Sunday', pujaDay: 'Ashtami', time: '6:30 PM', details: 'Cultural Show', color: 'bg-yellow-200' },
  { date: '19-Oct-26', day: 'Monday', pujaDay: 'Nabami & Dashami', time: '1:00 PM', details: 'Mahaprasad', color: 'bg-yellow-200' },
  { date: '19-Oct-26', day: 'Monday', pujaDay: 'Nabami & Dashami', time: '7:00 PM', details: 'Farewell Ceremony', color: 'bg-yellow-200' },
];

export default function ProgrammeSchedulePage() {
  return (
    <main className="bg-[#ededed] text-[#1a1a1a]">
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-100/80">Schedule</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Durga Puja Programme Schedule</h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-rose-50/90 sm:text-lg">
            Days, timings, and the full set of puja rituals across the festival.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-x-auto">
            <table className="min-w-[820px] border-collapse border-[2px] border-black bg-white text-center text-[13px] font-medium text-black shadow-[0_2px_0_rgba(0,0,0,0.6)]">
              <thead>
                <tr>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">#</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Date</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Day</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Puja Day</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Time</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Detailed Activities / Programs</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((item, index) => (
                  <tr key={`${item.date}-${item.time}-${index}`}>
                    <td className="border border-black px-2 py-2 text-[12px] font-bold">{index + 1}</td>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.date}</td>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.day}</td>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.pujaDay}</td>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.time}</td>
                    <td className={`border border-black px-2 py-2 text-[12px] ${item.color}`}>{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[560px] border-collapse border-[2px] border-black bg-white text-center text-[13px] font-medium text-black shadow-[0_2px_0_rgba(0,0,0,0.6)]">
              <thead>
                <tr>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Date</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Day</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Puja Day</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Time</th>
                  <th className="border border-black bg-[#efefef] px-2 py-3 text-[12px] font-bold">Detailed Activities / Programs</th>
                </tr>
              </thead>
              <tbody>
                {secondTableRows.map((item, index) => (
                  <tr key={`${item.date}-${item.time}-${index}-secondary`}>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.date}</td>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.day}</td>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.pujaDay}</td>
                    <td className="border border-black px-2 py-2 text-[12px]">{item.time}</td>
                    <td className={`border border-black px-2 py-2 text-[12px] ${item.color}`}>{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
