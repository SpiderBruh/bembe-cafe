import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getProducts, Product } from '@/lib/db-utils';
import { ArrowRight, ShoppingBag, Plus } from 'lucide-react';

export const ProductShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -400]);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data.filter(p => p.available));
      setLoading(false);
    });
  }, []);

  return (
    <section ref={scrollRef} className="relative py-32 overflow-hidden bg-[#FDFCFB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {loading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <motion.div 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30"
            >
              Loading Artisan Collection
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
          
          {/* Left: Sticky Branding (Design Variance: 8) */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-6 block">
                Seasonal Selections
              </span>
              <h2 className="text-5xl md:text-7xl font-display font-bold italic text-text-deep leading-[0.9] tracking-tighter mb-8">
                Artisan<br />
                <span className="text-primary/20">Collection</span>
              </h2>
              <p className="text-text-deep/50 font-sans text-sm leading-relaxed max-w-sm mb-12">
                Every creation is a dialogue between tradition and innovation. Hand-crafted daily in our Manchester boutique.
              </p>
              
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="size-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <ArrowRight className="size-5 text-primary group-hover:text-warm-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-deep/40 group-hover:text-text-deep transition-colors">
                  Explore Full Menu
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Kinetic Carousel (Motion Intensity: 6) */}
          <div className="lg:w-2/3 flex flex-col gap-12">
            <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
              <motion.div 
                className="flex gap-8"
                style={{ x }}
              >
                {products.map((product, idx) => (
                  <ShowcaseCard key={product.id || idx} product={product} />
                ))}
              </motion.div>
            </div>
            
            {/* Progress Indicator */}
            <div className="h-[1px] w-full bg-border-warm/30 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-primary"
                style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Decorative grain/noise (Performance Guardrail: §5) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-overlay" />
    </section>
  );
};

const ShowcaseCard = ({ product }: { product: Product }) => {
  return (
    <motion.div 
      className="min-w-[280px] md:min-w-[400px] aspect-[4/5] relative group flex items-center justify-center"
      whileHover={{ y: -20 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Product Image - Floating (No background) */}
      <div className="relative w-full h-[85%] overflow-hidden rounded-[3rem] transition-transform duration-700 ease-out group-hover:scale-105">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
        />
        
        {/* Subtle Inner Glow for Depth */}
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/20 shadow-[inset_0_0_80px_rgba(0,0,0,0.1)]" />
      </div>
      
      {/* Floating Label (Minimal Glassmorphism) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] p-4 liquid-glass rounded-2xl border border-white/20 backdrop-blur-xl z-20"
      >
        <div className="flex justify-between items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-display font-bold italic text-text-deep tracking-tight truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-widest text-primary italic">£{product.price.toFixed(2)}</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-deep/20">•</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-deep/30">{product.category}</span>
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="size-8 rounded-full bg-primary text-warm-white flex items-center justify-center hover:bg-accent transition-colors"
          >
            <Plus className="size-3" />
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Badge */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-primary/90 text-warm-white px-3 py-1 rounded-full text-[7px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          Artisan Selection
        </div>
      </div>
    </motion.div>
  );
};
