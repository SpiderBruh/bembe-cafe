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

  if (loading) return null;

  return (
    <section ref={scrollRef} className="relative py-32 overflow-hidden bg-[#FDFCFB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
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
        </div>
      </div>

      {/* Decorative grain/noise (Performance Guardrail: §5) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-overlay" />
    </section>
  );
};

const ShowcaseCard = ({ product }: { product: Product }) => {
  return (
    <motion.div 
      className="min-w-[320px] md:min-w-[450px] aspect-[4/5] relative group overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Product Image */}
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
      />
      
      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-text-deep/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {/* Liquid Glass Content (Creative Arsenal: §4) */}
      <div className="absolute bottom-8 left-8 right-8 p-6 liquid-glass rounded-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-warm-white/40 mb-2 block">
              {product.category}
            </span>
            <h3 className="text-2xl font-display font-bold italic text-warm-white tracking-tight leading-none mb-1">
              {product.name}
            </h3>
            <p className="text-[10px] font-bold text-primary italic">£{product.price.toFixed(2)}</p>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="size-10 rounded-full bg-warm-white text-text-deep flex items-center justify-center hover:bg-primary hover:text-warm-white transition-colors duration-300"
          >
            <Plus className="size-4" />
          </motion.button>
        </div>
      </div>

      {/* Magnetic Label (Creative Arsenal: §4) */}
      <div className="absolute top-8 right-8">
        <div className="size-12 rounded-full bg-accent/90 text-warm-white flex items-center justify-center text-[8px] font-black uppercase tracking-tighter backdrop-blur-sm scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
          Must Try
        </div>
      </div>
    </motion.div>
  );
};
