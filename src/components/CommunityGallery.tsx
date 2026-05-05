import { useState } from 'react';
import { motion } from 'framer-motion';

const galleryItems = [
  { src: '/gallery-1.png', label: 'Our Space', tag: 'Interior' },
  { src: '/gallery-2.png', label: 'The Shakshuka', tag: 'Our Food' },
  { src: '/gallery-3.png', label: 'Crafted With Care', tag: 'Coffee' },
  { src: '/gallery-4.png', label: 'Alexandra Park', tag: 'The Park' },
  { src: '/gallery-5.png', label: 'Fresh Daily', tag: 'Pastries' },
  { src: '/gallery-6.png', label: 'Better Together', tag: 'Community' },
];

export const CommunityGallery = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-background-soft relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block font-sans"
          >
            Life at Bembe
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, type: 'spring', stiffness: 100, damping: 20 }}
            className="font-display text-3xl md:text-5xl font-bold text-text-deep tracking-tight"
          >
            Moments from Our{' '}
            <span className="italic text-primary">Community</span>
          </motion.h2>
        </div>

        {/* Accordion Image Slider — Desktop */}
        <div className="hidden md:flex h-[500px] gap-2 rounded-2xl overflow-hidden">
          {galleryItems.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.div
                key={idx}
                className="relative overflow-hidden cursor-pointer rounded-xl"
                animate={{
                  flex: isActive ? 4 : activeIndex === null ? 1 : 0.5,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-text-deep/70 via-text-deep/10 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-warm-white/90 backdrop-blur-md text-text-deep text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-sans">
                    {item.tag}
                  </span>
                </div>

                {/* Label — visible when expanded */}
                <motion.div
                  className="absolute bottom-6 left-6 right-6"
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-display text-2xl font-bold text-warm-white italic tracking-tight">
                    {item.label}
                  </h3>
                </motion.div>

                {/* Vertical label — visible when collapsed */}
                <motion.div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2"
                  animate={{ opacity: isActive ? 0 : 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="[writing-mode:vertical-lr] rotate-180 text-warm-white text-[10px] font-bold uppercase tracking-[0.3em] font-sans whitespace-nowrap">
                    {item.tag}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile — Horizontal scroll with snap */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 scrollbar-hide">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="relative shrink-0 w-[280px] h-[360px] snap-center rounded-2xl overflow-hidden"
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-deep/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-warm-white/90 backdrop-blur-md text-text-deep text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-sans">
                  {item.tag}
                </span>
              </div>
              <div className="absolute bottom-5 left-5">
                <h3 className="font-display text-xl font-bold text-warm-white italic">
                  {item.label}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Scroll Indicator (taste §3 Rule 5) */}
        <div className="md:hidden flex justify-center gap-1.5 mt-2">
          {galleryItems.map((_, idx) => (
            <div key={idx} className="h-1 w-4 rounded-full bg-primary/10" />
          ))}
        </div>
      </div>
    </section>
  );
};
