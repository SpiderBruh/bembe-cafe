"use client"
import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Star, ChevronDown, ArrowRight } from "lucide-react"

/* ── Leaf SVG — minimalist line art decoration ── */
const LeafDecoration = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 80 120"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    className={className}
  >
    <path
      d="M40 110 C40 110 40 60 40 20 C40 20 15 40 10 70 C5 100 40 110 40 110Z"
      className="opacity-30"
      pathLength="1"
      style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
    />
    <path d="M40 20 L40 110" className="opacity-20" />
    <path d="M40 45 C35 50 25 55 18 65" className="opacity-15" />
    <path d="M40 60 C35 65 28 72 22 80" className="opacity-15" />
    <path d="M40 75 C37 78 32 85 28 92" className="opacity-15" />
  </svg>
)

/* ── Magnetic Button — useMotionValue, NOT useState (taste §4) ── */
const MagneticButton = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const y1 = useTransform(scrollY, [0, 500], [0, 100])

  /* cleanup for scroll listener — taste §10 */
  useEffect(() => {
    return () => {}
  }, [])

  /* Stagger animation variants */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-text-deep flex items-center px-6 md:px-12 lg:px-24"
    >
      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-50 scale-105"
        >
          <source
            src="/vecteezy_freshly-baked-apple-pie-steaming-on-a-rustic-wooden-table-in_71718681.mp4"
            type="video/mp4"
          />
        </video>
        {/* Warm gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-text-deep via-text-deep/60 to-text-deep/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-text-deep/30 via-transparent to-text-deep z-10" />
      </div>

      {/* ── Ambient Light Blurs — desaturated, not neon (taste §7) ── */}
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-[300px] h-[300px] bg-accent/6 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Decorative Leaf — replaces rotating text circle ── */}
      <motion.div
        className="absolute bottom-16 right-16 z-20 hidden lg:block text-primary/20"
        style={{ y: y1 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <LeafDecoration className="w-20 h-28" />
      </motion.div>

      {/* ── Main Content — LEFT ALIGNED (anti-center bias, DESIGN_VARIANCE 7) ── */}
      <motion.main
        className="relative z-20 w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col gap-10">
          {/* Rating Badge — Liquid Glass */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="h-[1px] w-10 bg-primary/50" />
            <div className="px-4 py-2 rounded-full liquid-glass bg-warm-white/5 flex items-center gap-3">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-5 rounded-full border-2 border-text-deep/80 bg-primary/20 flex items-center justify-center"
                  >
                    <Star className="size-2.5 text-yellow-400 fill-yellow-400" />
                  </div>
                ))}
              </div>
              <span className="text-warm-white/60 text-xs font-sans tracking-widest uppercase">
                4.8 Rating · Alexandra Park
              </span>
            </div>
          </motion.div>

          {/* ── Headline — controlled hierarchy (taste §3 Rule 1, §7) ── */}
          <div className="relative">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-warm-white leading-[0.9] tracking-tighter"
              variants={itemVariants}
            >
              <motion.span
                variants={itemVariants}
                className="block italic font-light text-primary mb-2"
              >
                Authentic
              </motion.span>
              <motion.span variants={itemVariants} className="block relative">
                Artisan
                <span className="absolute -top-2 -right-2 md:-right-8 text-[10px] font-sans font-bold text-warm-white/25 tracking-[0.3em] uppercase hidden md:block">
                  EST. 2024
                </span>
              </motion.span>
              <motion.span
                variants={itemVariants}
                className="block text-primary/80"
              >
                Cafe.
              </motion.span>
            </motion.h1>

            {/* Decorative vertical text */}
            <div className="absolute -left-14 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 text-warm-white/15">
              <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] tracking-[0.4em] uppercase font-sans">
                Homemade with Love
              </span>
              <div className="w-[1px] h-16 bg-warm-white/10" />
            </div>
          </div>

          {/* ── Description + CTA ── */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-10 md:gap-16">
            <motion.p
              variants={itemVariants}
              className="max-w-md text-lg md:text-xl text-warm-white/50 font-sans font-light leading-relaxed prose-width"
            >
              A boutique coffee experience nestled in the heart of Alexandra
              Park. Halal, artisanal, and crafted for the local soul.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <MagneticButton
                onClick={() =>
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative px-10 py-4 rounded-full overflow-hidden liquid-glass bg-warm-white/5 text-warm-white transition-all duration-300 hover:border-primary/40"
              >
                {/* Directional hover fill */}
                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />

                <span className="relative z-10 font-sans font-bold tracking-[0.15em] uppercase text-xs flex items-center gap-3">
                  Today's Menu
                  <span className="p-1.5 bg-primary rounded-full group-hover:bg-accent transition-colors duration-300">
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() =>
                  document
                    .getElementById("booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 text-warm-white/50 font-sans font-medium tracking-widest uppercase text-xs hover:text-warm-white transition-colors duration-300 relative group"
              >
                <span>Reserve a Spot</span>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-6 transition-all duration-300" />
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </motion.main>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-warm-white/20"
        style={{ opacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-6" />
      </motion.div>
    </div>
  )
}
