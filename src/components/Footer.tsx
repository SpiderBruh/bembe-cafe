import { Coffee, Instagram, Facebook, MapPin, Phone, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-text-deep text-warm-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Asymmetric grid: 2fr 1fr 1fr 1fr (taste §3 Rule 3) */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-8 mb-14 pb-14 border-b border-warm-white/8">
          {/* Brand Column — wider */}
          <div>
            <h3 className="font-display text-3xl font-bold italic mb-5 tracking-tight">
              Bembe <span className="text-primary">Cafe</span>
            </h3>
            <p className="text-warm-white/50 leading-relaxed mb-6 text-sm max-w-xs">
              Halal, homemade, and artisan coffee in the heart of Alexandra
              Park. A sanctuary for community and connection.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/bembecafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-warm-white/8 rounded-full hover:bg-primary transition-colors duration-200 cursor-pointer"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61572199929332"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-warm-white/8 rounded-full hover:bg-primary transition-colors duration-200 cursor-pointer"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-primary font-sans">
              Location
            </h4>
            <ul className="space-y-3 text-warm-white/55 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="size-4 shrink-0 text-accent mt-0.5" />
                <span>Demesne Rd, Manchester M16 8PJ</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="size-4 shrink-0 text-accent mt-0.5" />
                <span>+44 161 260 5799</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-primary font-sans">
              Hours
            </h4>
            <ul className="space-y-2 text-warm-white/55 text-sm">
              <li className="flex justify-between gap-4">
                <span>Mon - Fri</span>
                <span>10 AM - 4:30 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sat - Sun</span>
                <span>9 AM - 5 PM</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-primary font-sans">
              Links
            </h4>
            <ul className="space-y-2.5 text-warm-white/55 text-sm">
              <li>
                <a href="#menu" className="hover:text-primary transition-colors duration-200 cursor-pointer">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-primary transition-colors duration-200 cursor-pointer">
                  Book a Table
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors duration-200 cursor-pointer">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-primary transition-colors duration-200 cursor-pointer">
                  What People Say
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SVG leaf divider */}
        <div className="flex justify-center mb-8">
          <svg width="60" height="16" viewBox="0 0 60 16" fill="none" className="text-primary/20">
            <path d="M30 2 C25 4 15 8 5 8 C15 8 25 12 30 14 C35 12 45 8 55 8 C45 8 35 4 30 2Z" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="30" cy="8" r="1.5" fill="currentColor" />
          </svg>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-warm-white/30">
          <p>© 2025 Bembe Cafe. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="italic">
              Powered by <span className="font-bold text-warm-white/45">Siteplasm</span>
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 bg-warm-white/5 rounded-full hover:bg-primary transition-colors duration-200 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
