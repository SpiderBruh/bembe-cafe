import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle,
  Baby,
  Leaf,
  Coffee,
  MapPin,
  Clock,
} from 'lucide-react';

/* ── Animated Counter — triggers on scroll into view ── */
const CountUp = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasTriggered]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export const AboutStrip = () => {
  const badges = [
    { icon: <CheckCircle className="size-5" />, label: 'Halal Certified' },
    { icon: <Baby className="size-5" />, label: 'Child Friendly' },
    { icon: <Leaf className="size-5" />, label: 'Homemade' },
    { icon: <Coffee className="size-5" />, label: 'Artisan Coffee' },
  ];

  const counters = [
    { value: 2400, suffix: '+', label: 'Coffees Served with Love' },
    { value: 43, suffix: '+', label: 'Voices of Joy' },
    { value: 48, suffix: '/5', label: 'Our Community\'s Rating' },
  ];

  /* Stagger variants (taste §4) */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <section id="about" className="py-28 md:py-36 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* ── Social Proof Counters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mb-20 pb-16 border-b border-border-warm"
        >
          {counters.map((c, idx) => (
            <div key={idx} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-text-deep tracking-tight italic">
                <CountUp end={c.value} suffix={c.suffix} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-deep/35 mt-2 block font-sans">
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Asymmetric grid: 1.5fr 1fr (taste §3 Rule 3, DESIGN_VARIANCE 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-20 items-start">

          {/* ── Left Column: Content ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
          >
            <motion.span
              variants={itemVariants}
              className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block font-sans"
            >
              Our Story
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="font-display text-3xl md:text-5xl font-bold mb-8 text-text-deep tracking-tight leading-tight"
            >
              A Community Heart in{' '}
              <span className="italic text-primary">Alexandra Park</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-text-deep/70 leading-relaxed mb-10 prose-width"
            >
              Bembe Cafe is more than just a place for coffee. Nestled in the
              historic Alexandra Park, we are a sanctuary for families, workers,
              and park-goers. Our menu is carefully crafted with 100% halal
              ingredients, featuring homemade recipes that taste like home.
              Whether you're here for a sensory artisan espresso or our famous
              Shakshuka, you're part of our warm Manchester community.
            </motion.p>

            {/* Badges — rounded, tinted shadows */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {badges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex flex-col items-center p-4 bg-card rounded-2xl tinted-shadow-sm text-center gap-2 cursor-default hover:bg-warm-white transition-colors duration-200"
                >
                  <div className="text-primary">{badge.icon}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-deep/60 font-sans">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: Info — clean typography + border-t dividers (taste Rule 4) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-card rounded-2xl p-8 md:p-10 tinted-shadow">
              <div className="space-y-0">
                {/* Location */}
                <div className="flex items-start gap-4 pb-6">
                  <MapPin className="size-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base mb-1 text-text-deep font-sans">
                      Our Location
                    </h4>
                    <p className="text-text-deep/60 text-sm mb-2">
                      Demesne Rd, Manchester M16 8PJ, United Kingdom
                    </p>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Bembe+Cafe+Alexandra+Park"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm font-bold hover:text-primary-dark inline-flex items-center gap-1 cursor-pointer transition-colors duration-200"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                {/* Divider — border-t instead of card boxing (taste Rule 4) */}
                <div className="border-t border-border-warm" />

                {/* Hours */}
                <div className="flex items-start gap-4 pt-6 pb-6">
                  <Clock className="size-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base mb-2 text-text-deep font-sans">
                      Opening Hours
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-text-deep/60">
                      <span>Mon - Fri</span>
                      <span>10:00 AM - 4:30 PM</span>
                      <span>Sat - Sun</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border-warm" />

                {/* Map */}
                <div className="pt-6 h-[180px] w-full rounded-xl overflow-hidden border border-border-warm grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2375.405383569429!2d-2.2618999!3d53.460144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bb3c3e8e2b83b%3A0xe5a3c6e4e5e5e5!2sBembe%20Cafe!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Bembe Cafe location on Google Maps"
                  ></iframe>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
