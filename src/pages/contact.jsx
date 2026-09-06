export default function ContactPage() {
  const contacts = [
    {
      name: 'Subhadip Chatterjee',
      phone: '+44 (0) 7721 841210',
      whatsapp: '447721841210',
    },
    {
      name: 'Antara Mukherjee',
      phone: '+44 (0) 7848 740303',
      whatsapp: '447848740303',
    },
  ];

  return (
    <main className="bg-[#f8f1ea] text-gray-900">
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Get Involved</h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-rose-50/90 sm:text-lg">
            We would love to hear from you. If you want to volunteer, participate, or simply connect with the community, please send us a message below.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2" data-aos="fade-up">
        <div className="rounded-2xl bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)] pt-12 sm:p-8">
          <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Get Involved</h2>
          <p className="mt-4 text-lg leading-8 text-gray-700">
              We would love to hear from you. If you want to volunteer, participate, or simply connect with the community, please send us a message below.
          </p>
          <form
            className="mt-6 space-y-4"
            name="contact"
            method="POST"
            data-netlify="true"
            action="mailto:warwickshiresarbojonin@gmail.com?subject=New%20Contact%20Form%20Submission"
          >
            <input type="hidden" name="form-name" value="contact" />
            <input className="w-full border border-rose-200 bg-[#fffaf7] px-4 py-3 rounded-lg focus:border-rose-500 focus:outline-none" type="text" name="name" placeholder="Your Name" required />
            <input className="w-full border border-rose-200 bg-[#fffaf7] px-4 py-3 rounded-lg focus:border-rose-500 focus:outline-none" type="tel" name="mobile" placeholder="Mobile Number" required />
            <input className="w-full border border-rose-200 bg-[#fffaf7] px-4 py-3 rounded-lg focus:border-rose-500 focus:outline-none" type="email" name="email" placeholder="Your Email" required />
            <textarea className="w-full border border-rose-200 bg-[#fffaf7] px-4 py-3 rounded-lg focus:border-rose-500 focus:outline-none" name="message" rows="5" placeholder="Message" required></textarea>
            <button type="submit" className="inline-flex items-center justify-center bg-amber-300 px-6 py-3 font-bold text-rose-950 transition hover:bg-amber-200">Submit</button>
          </form>
        </div>

        <div className="rounded-2xl bg-[#fff7f2] p-5 text-gray-900 shadow-[0_16px_40px_rgba(0,0,0,0.08)] ring-1 ring-rose-100 sm:p-8">
          <h3 className="mt-3 text-3xl font-extrabold text-rose-950">Reach out directly</h3>

          <div className="mt-8 space-y-6">
            {contacts.map((person) => (
              <div key={person.name} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-rose-100 bg-white p-4 shadow-sm sm:flex-nowrap">
                <p className="text-lg font-semibold text-rose-900">{person.name}</p>
                <p className="text-base text-gray-700">{person.phone}</p>
                <a
                  href={`https://wa.me/${person.whatsapp}?text=Hello%20${encodeURIComponent(person.name)},%20I%20want%20to%20get%20in%20touch.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1ebe5b]"
                >
                  WhatsApp
                </a>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-rose-100 bg-white p-4 shadow-sm sm:flex-nowrap">
              <p className="text-lg font-semibold text-rose-900">Email</p>
              <a href="mailto:warwickshiresarbojonin@gmail.com" className="text-base text-gray-700 hover:text-rose-700">
                warwickshiresarbojonin@gmail.com
              </a>
            </div>

            <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-rose-900">Support Warwickshire Sarbojonin</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    To make a donation, please use the bank details below and include the reference shown.
                  </p>
                  <dl className="mt-4 space-y-2 text-sm text-gray-700">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-rose-900">Account name:</dt>
                      <dd>Warwickshire Sarbojonin</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-rose-900">Sort code:</dt>
                      <dd>52-30-02</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-rose-900">Account number:</dt>
                      <dd>30175461</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-rose-900">Reference:</dt>
                      <dd>DurgaPujaDonation</dd>
                    </div>
                  </dl>
                </div>
                <div className="shrink-0 text-center">
                  <img
                    src="/images/QR-code.jpeg"
                    alt="QR code for donating to Warwickshire Sarbojonin"
                    className="mx-auto h-36 w-36 rounded-lg border border-rose-100 object-contain"
                  />
                  <p className="mt-2 text-xs text-gray-500">Scan to donate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
