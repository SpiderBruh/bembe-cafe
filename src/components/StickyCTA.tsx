import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Calendar, Clock } from 'lucide-react';

export const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* Check if cafe is currently open */
  const getOpenStatus = () => {
    const now = new Date();
    // Use Intl.DateTimeFormat to get the time in Manchester/UK (Europe/London)
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value;
    
    const hour = parseInt(getPart('hour') || '0');
    const minute = parseInt(getPart('minute') || '0');
    const day = getPart('weekday') || '';
    
    const currentTimeMinutes = hour * 60 + minute;
    
    const isWeekend = day === 'Saturday' || day === 'Sunday';
    const openTimeMinutes = isWeekend ? 9 * 60 : 10 * 60; // 9:00 or 10:00
    const closeTimeMinutes = isWeekend ? 17 * 60 : 16 * 60 + 30; // 5:00 PM or 4:30 PM
    
    if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes) {
      return { open: true, text: 'Open Now' };
    }
    
    // Determine the next opening time
    if (currentTimeMinutes < openTimeMinutes) {
      return { open: false, text: `Opens ${isWeekend ? '9' : '10'} AM` };
    }
    
    // If it's after closing, check if tomorrow is a weekend
    // (This is a simplification, but effective for the user experience)
    const tomorrowIsWeekend = day === 'Friday' || day === 'Saturday';
    return { open: false, text: `Opens ${tomorrowIsWeekend ? '9' : '10'} AM` };
  };

  const status = getOpenStatus();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const menuEl = document.getElementById('menu');
      const bookingEl = document.getElementById('booking');

      const scrollY = window.scrollY;
      const viewportBottom = scrollY + window.innerHeight;

      /* Show after hero, hide when at menu/booking (they're already converting) */
      const atConversionSection =
        (menuEl && scrollY >= menuEl.offsetTop - 100 && scrollY <= menuEl.offsetTop + menuEl.offsetHeight) ||
        (bookingEl && scrollY >= bookingEl.offsetTop - 100 && scrollY <= bookingEl.offsetTop + bookingEl.offsetHeight);

      setIsVisible(scrollY > heroHeight * 0.7 && !atConversionSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Mobile — bottom bar */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-warm-white/95 backdrop-blur-xl border-t border-border-warm tinted-shadow-lg"
          >
            <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
              <div className="flex items-center gap-2.5">
                <div className={`size-2 rounded-full ${status.open ? 'bg-green-500' : 'bg-accent'} animate-pulse`} />
                <span className="text-xs font-bold uppercase tracking-widest text-text-deep/60 font-sans">
                  {status.text}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 bg-primary text-warm-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <ShoppingCart className="size-3.5" /> Order
                </button>
                <button
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 bg-accent text-warm-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <Calendar className="size-3.5" /> Book
                </button>
              </div>
            </div>
          </motion.div>

          {/* Desktop — subtle floating pill bottom-right */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="hidden md:flex fixed bottom-8 right-8 z-50 items-center gap-3 bg-text-deep text-warm-white rounded-full px-5 py-3 tinted-shadow-lg cursor-pointer group"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className={`size-2 rounded-full ${status.open ? 'bg-green-500' : 'bg-accent'} animate-pulse`} />
            <span className="text-[11px] font-bold uppercase tracking-widest font-sans">
              {status.text}
            </span>
            <div className="w-[1px] h-4 bg-warm-white/20" />
            <span className="text-[11px] font-bold uppercase tracking-widest font-sans text-primary group-hover:text-accent transition-colors duration-200">
              Order Now
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
