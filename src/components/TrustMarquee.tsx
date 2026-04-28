"use client"
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
  /* Triple the items for a smooth seamless loop even on ultra-wide screens */
  const items = [...trustItems, ...trustItems, ...trustItems];

  return (
    <section className="py-8 bg-card border-y border-border-warm/30 overflow-hidden relative group">
      {/* Cinematic Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card to-transparent z-10" />

      <motion.div
        className="flex items-center gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{
          x: { 
            duration: 25, 
            repeat: Infinity, 
            ease: 'linear' 
          },
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 text-text-deep/40 hover:text-primary transition-colors duration-500 shrink-0"
          >
            <span className="text-primary/60">{item.icon}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] font-sans">
              {item.text}
            </span>
            {/* Playful separator dot */}
            <div className="ml-8 size-1 rounded-full bg-primary/20" />
          </div>
        ))}
      </motion.div>
    </section>
  );
};
