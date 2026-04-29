import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const PANELS = [
  {
    id: 1,
    title: "Artisan",
    tagline: "The Collection",
    images: { left: "/c1.png", center: "/c3.png", right: "/c2.png" },
    accent: "Selection"
  },
  {
    id: 2,
    title: "Boutique",
    tagline: "Crafted Daily",
    images: { left: "/c2.png", center: "/c1.png", right: "/c3.png" }, // Re-ordered for variety
    accent: "Experience"
  }
];

export const ProductShowcase = () => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const next = () => setIndex((prev) => (prev + 1) % PANELS.length);
  const prev = () => setIndex((prev) => (prev - 1 + PANELS.length) % PANELS.length);

  const current = PANELS[index];

  return (
    <section ref={containerRef} className="relative py-48 md:py-64 overflow-visible bg-[#FDFCFB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative h-[500px] md:h-[700px] flex items-center justify-center">
        
        {/* Editorial Text Overlay */}
        <div className="absolute top-0 left-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/30 mb-4 block">
                {current.tagline}
              </span>
              <h2 className="text-6xl md:text-[12rem] font-display font-bold italic text-text-deep/5 leading-[0.8] tracking-tighter pointer-events-none select-none">
                {current.title}<br />
                {current.accent}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gallery Controls (Taste §1 Variance) */}
        <div className="absolute bottom-0 right-0 z-50 flex items-center gap-8 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-border-warm/30 shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-primary italic">0{index + 1}</span>
            <div className="h-8 w-[1px] bg-border-warm/50 my-2" />
            <span className="text-[10px] font-bold text-text-deep/20">0{PANELS.length}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={prev}
              className="size-12 rounded-full border border-border-warm/50 flex items-center justify-center hover:bg-primary hover:text-warm-white transition-all duration-500 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button 
              onClick={next}
              className="size-12 rounded-full bg-primary text-warm-white flex items-center justify-center hover:bg-accent transition-all duration-500 cursor-pointer shadow-lg shadow-primary/20"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Layered Image Composition */}
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={index}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Left Layer */}
              <motion.div 
                initial={{ opacity: 0, x: -200, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, x: -80, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -300, scale: 1.2, rotate: -20 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 md:-left-20 top-1/4 w-1/3 md:w-2/5 z-10"
              >
                <img src={current.images.left} className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" />
              </motion.div>

              {/* Right Layer */}
              <motion.div 
                initial={{ opacity: 0, x: 200, scale: 0.8, rotate: 10 }}
                animate={{ opacity: 1, x: 80, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: 300, scale: 1.2, rotate: 20 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="absolute right-0 md:-right-20 top-1/3 w-1/3 md:w-2/5 z-10"
              >
                <img src={current.images.right} className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" />
              </motion.div>

              {/* Middle Layer */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.2, y: -100 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative w-1/2 md:w-3/5 z-20"
              >
                <img src={current.images.center} className="w-full h-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.2)]" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ambient grain/noise */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-overlay" />
      </div>
    </section>
  );
};
