
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LightGallery = dynamic(() => import("lightgallery/react"), { ssr: false });
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const Countdown = () => {
  const target = new Date('2025-09-26T00:00:00');
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 flex justify-center gap-4 text-white font-bold text-lg">
      <div className="bg-black bg-opacity-20 px-5 py-3 rounded">{timeLeft.days}d</div>
      <div className="bg-black bg-opacity-20 px-5 py-3 rounded">{timeLeft.hours}h</div>
      <div className="bg-black bg-opacity-20 px-5 py-3 rounded">{timeLeft.minutes}m</div>
      <div className="bg-black bg-opacity-20 px-5 py-3 rounded">{timeLeft.seconds}s</div>
    </div>
  );
};

export default function Home() {
  const galleryImages = ['/gallery/image-1.png', '/gallery/image-2.png', '/gallery/image-3.png','/gallery/image-4.png','/gallery/image-5.png', '/gallery/image-6.png'];
  const eventCards = [
    { title: 'Mahalaya', date: '26 Sep 2025', img: '/events/event1.jpg' },
    { title: 'Ashtami & Sandhi', date: '27 Sep 2025', img: '/events/event2.jpg' },
    { title: 'Dashami', date: '28 Sep 2025', img: '/events/event3.jpg' },
  ];

  return (
    <div className="text-gray-800">
      <header className="sticky top-0 bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex items-center p-4">
          <img src="/images/logo.png" alt="Logo" className="h-14" />
          <h1 className="text-xl sm:text-2xl font-bold pl-4 text-red-800">Warwickshire Sarbojonin</h1>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row w-full min-h-[75vh]">
        {/* Left Half - Static Image */}
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-auto">
          <img
            src="/images/hero.png"
            alt="Durga Puja"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Half - Solid Background with Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-maroon p-8">
          <div className="text-center max-w-xs" data-aos="fade-left">
            <h2 className="text-4xl font-bold mb-2 text-white">Sharadotsav 2025</h2>
            <p className="text-lg text-white mb-4">
              26–28 Sep | Weston-Under-Weatherly Village Hall
            </p>
            <Countdown />
          </div>
        </div>
      </section>


     <section className="py-16 px-6 lg:p-0 bg-gray-50 text-gray-800" data-aos="fade-up">
        <div className="lg:mx-0 flex flex-col lg:flex-row lg:justify-between items-center gap-12">
          <div className="w-full lg:w-1/2 lg:pl-32 pb-4" data-aos="fade-left">
            <h2 className="text-3xl font-bold mb-4 text-left">About Us</h2>
            <p className="text-lg leading-relaxed text-left">
              <strong>Warwickshire Sarbojonin</strong> is a vibrant cultural association dedicated to promote and preserve the rich heritage of India and its culture. Through a diverse range of activities including performing arts, music, dance, visual arts and festive community celebrations, it seeks to foster cultural awareness and appreciation. The association actively supports artists, curates cultural events and offers educational initiatives to engage and enrich wider community present in the United Kingdom.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-end" data-aos="fade-right">
            <img src="/images/about-us.png" alt="Community" />
          </div>
        </div>
      </section>


      <section className="py-16 px-6 bg-white" data-aos="fade-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <p className="max-w-6xl mx-auto text-lg leading-relaxed pt-8">
            Warwickshire Sarbojonin is all set to organise its first ever Durga Puja in Warwick, UK. Something truly special is happening for Durga Puja in Warwickshire this year! Our very own incredibly skilled sculptor, Debabrata Mukhopadhyay, is bringing the Durga idol to life here in Warwick, U.K. Come and be a part of our festivities and share in the joy. We welcome everyone with open arms!!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {eventCards.map(ev => (
            <div key={ev.title} className="bg-white shadow rounded-lg overflow-hidden">
              <img src={ev.img} alt={ev.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{ev.title}</h3>
                <p className="text-gray-600">{ev.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-yellow-100 py-16 px-6" data-aos="fade-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Gallery</h2>
        </div>
        <div className="max-w-6xl mx-auto">
          <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryImages.map((src, i) => (
                <a href={src} key={i}>
                  <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-64 object-cover rounded shadow" />
                </a>
              ))}
            </div>
          </LightGallery>
        </div>
      </section>

      <section className="bg-red-800 py-16 px-6" data-aos="fade-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Contact Us</h2>
        </div>
        <form className="max-w-2xl mx-auto space-y-4" name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <input className="w-full border px-4 py-2 rounded" type="text" name="name" placeholder="Your Name" required />
          <input className="w-full border px-4 py-2 rounded" type="email" name="email" placeholder="Your Email" required />
          <textarea className="w-full border px-4 py-2 rounded" name="message" rows="5" placeholder="Message" required></textarea>
          <button type="submit" className="bg-yellow-200 text-black px-6 py-2 rounded hover:bg-yellow-400">Submit</button>
        </form>
      </section>

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

      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 Warwickshire Sarbojonin. All rights reserved.</p>
      </footer>
    </div>
  );
}
