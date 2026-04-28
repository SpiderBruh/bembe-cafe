import { motion } from 'framer-motion';
import { CheckCircle, Star, Baby, Leaf, Coffee, Clock } from 'lucide-react';

const trustItems = [
  { icon: <CheckCircle className="size-4" />, text: 'Halal Certified' },
  { icon: <Star className="size-4 fill-yellow-500 text-yellow-500" />, text: '4.8 Google Rating' },
  { icon: <Coffee className="size-4" />, text: 'Artisan Coffee' },
  { icon: <Baby className="size-4" />, text: 'Child Friendly' },
  { icon: <Leaf className="size-4" />, text: 'Homemade Daily' },
  { icon: <Clock className="size-4" />, text: 'Est. 2024' },
];

export const TrustMarquee = () => {
  /* Double the items for seamless infinite loop */
  const doubled = [...trustItems, ...trustItems];

  return (
    <section className="py-5 bg-card border-y border-border-warm/50 overflow-hidden">
      {/* Desktop — static row */}
      <div className="hidden md:flex items-center justify-center gap-10 max-w-7xl mx-auto px-8">
        {trustItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 text-text-deep/50"
          >
            <span className="text-primary">{item.icon}</span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] font-sans whitespace-nowrap">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile — kinetic marquee (taste Creative Arsenal) */}
      <div className="md:hidden relative">
        <motion.div
          className="flex items-center gap-10 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
        >
          {doubled.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-text-deep/50 shrink-0"
            >
              <span className="text-primary">{item.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] font-sans">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
