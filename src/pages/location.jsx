export default function LocationPage() {
  return (
    <main className="bg-white">
      <section className="py-16 px-6 bg-gray-100" data-aos="fade-up">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Venue</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <iframe
            className="w-full h-96 rounded shadow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.4863051075876!2d-1.5528498840198492!3d52.21732727975707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48772b1111111111%3A0xabcdef1234567890!2sWeston-Under-Weatherly%20Village%20Hall!5e0!3m2!1sen!2suk!4v1699999999999"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
