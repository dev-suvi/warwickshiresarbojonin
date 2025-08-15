export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="py-16 px-6" data-aos="fade-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-black">Contact Us</h2>
        </div>
        <form className="max-w-2xl mx-auto space-y-4" name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <input className="w-full border px-4 py-2 rounded" type="text" name="name" placeholder="Your Name" required />
          <input className="w-full border px-4 py-2 rounded" type="email" name="email" placeholder="Your Email" required />
          <textarea className="w-full border px-4 py-2 rounded" name="message" rows="5" placeholder="Message" required></textarea>
          <button type="submit" className="bg-yellow-200 text-black px-6 py-2 rounded hover:bg-yellow-400">Submit</button>
        </form>
      </section>
    </main>
  );
}
