import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ProductShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax offsets for depth layering
  const yC1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yC2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yC3 = useTransform(scrollYProgress, [0, 1], [0, 0]); // Center stays stable but floats

  return (
    <section ref={containerRef} className="relative py-48 md:py-64 overflow-visible bg-[#FDFCFB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative h-[500px] md:h-[700px] flex items-center justify-center">
        
        {/* Editorial Text Overlay (Taste §1 Variance) */}
        <div className="absolute top-0 left-0 z-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/30 mb-4 block">
              The Collection
            </span>
            <h2 className="text-6xl md:text-[12rem] font-display font-bold italic text-text-deep/5 leading-[0.8] tracking-tighter pointer-events-none select-none">
              Artisan<br />
              Selection
            </h2>
          </motion.div>
        </div>

        {/* Layered Image Composition */}
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          
          {/* Left Layer: C1 */}
          <motion.div 
            style={{ y: yC1 }}
            className="absolute -left-4 md:-left-20 top-1/4 w-1/3 md:w-2/5 z-10"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square"
            >
              <img 
                src="/c1.png" 
                alt="Artisan Showcase Left" 
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              />
            </motion.div>
          </motion.div>

          {/* Right Layer: C2 */}
          <motion.div 
            style={{ y: yC2 }}
            className="absolute -right-4 md:-right-20 top-1/3 w-1/3 md:w-2/5 z-10"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="relative aspect-square"
            >
              <img 
                src="/c2.png" 
                alt="Artisan Showcase Right" 
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              />
            </motion.div>
          </motion.div>

          {/* Middle Layer: C3 (The Anchor) */}
          <motion.div 
            style={{ y: yC3 }}
            className="relative w-1/2 md:w-3/5 z-20"
          >
            <motion.div
              animate={{ y: [0, -25, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square"
            >
              <img 
                src="/c3.png" 
                alt="Artisan Showcase Center" 
                className="w-full h-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.2)]"
              />
              
              {/* Subtle Refraction Accent (Creative Arsenal §4) */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-50" />
            </motion.div>
          </motion.div>

        </div>

        {/* Ambient grain/noise */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-overlay" />
      </div>
    </section>
  );
};
