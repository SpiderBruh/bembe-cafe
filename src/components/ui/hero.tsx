"use client"
import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Star, ArrowRight } from "lucide-react"

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

  // Parallax and scroll effects
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const videoScale = useTransform(scrollY, [0, 500], [1.05, 1.2])

  // Mouse tracking for ambient light (Liquid Motion - taste §7)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set(clientX - innerWidth / 2)
      mouseY.set(clientY - innerHeight / 2)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  /* Stagger animation variants */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const charVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.03,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  }

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        custom={i}
        variants={charVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0A0A0A] flex items-center px-6 md:px-12 lg:px-24"
    >
      {/* ── Video Background with Parallax Scale ── */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-40 grayscale-[0.2]"
        >
          <source
            src="/vecteezy_freshly-baked-apple-pie-steaming-on-a-rustic-wooden-table-in_71718681.mp4"
            type="video/mp4"
          />
        </video>
        {/* Deep artisanal overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] z-10" />
      </motion.div>

      {/* ── Interactive Ambient Light ── */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[180px] rounded-full pointer-events-none z-10 mix-blend-screen" 
      />

      {/* ── Main Content ── */}
      <motion.main
        className="relative z-20 w-full max-w-6xl mt-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-[1fr,auto] items-end gap-12 lg:gap-24">
          <div className="flex flex-col gap-12">
            {/* Trust Indicator */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-full border border-warm-white/10 bg-warm-white/5 backdrop-blur-md flex items-center gap-3">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="size-2.5 text-primary fill-primary" />
                  ))}
                </div>
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-warm-white/60">
                  Top Rated Boutique Cafe
                </span>
              </div>
            </motion.div>

            {/* Kinetic Typography Heading */}
            <div className="relative">
              <motion.h1
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-display font-bold text-warm-white leading-[0.85] tracking-tighter"
                variants={itemVariants}
              >
                <motion.span
                  className="block italic font-light text-primary/90 text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4"
                >
                  {splitText("Authentic")}
                </motion.span>
                <span className="block relative overflow-hidden">
                  {splitText("Artisan")}
                  <motion.span 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 1, ease: "circOut" }}
                    className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary/30 origin-left"
                  />
                </span>
                <span className="block text-warm-white/40">
                  {splitText("Cafe.")}
                </span>
              </motion.h1>

              {/* Vertical Est Tag */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8 text-warm-white/20"
              >
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-warm-white/20 to-transparent" />
                <span className="[writing-mode:vertical-lr] text-[9px] tracking-[0.6em] uppercase font-sans font-black">
                  Since 2024
                </span>
              </motion.div>
            </div>

            {/* Description + CTA */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 mt-4">
              <motion.p
                variants={itemVariants}
                className="max-w-md text-base md:text-lg text-warm-white/40 font-sans font-light leading-relaxed tracking-tight"
              >
                A boutique sanctuary in Alexandra Park. Handcrafted pastries, artisanal coffee, and a curated atmosphere for the discerning soul.
              </motion.p>

              <motion.div variants={itemVariants} className="flex items-center gap-6">
                <MagneticButton
                  onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
                  className="group relative px-10 py-5 rounded-full bg-primary text-text-deep transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 font-sans font-black tracking-widest uppercase text-[10px] flex items-center gap-3">
                    View Menu
                    <ArrowRight className="size-4" />
                  </span>
                </MagneticButton>

                <button
                  onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                  className="group flex flex-col gap-1 items-start text-warm-white/60 hover:text-warm-white transition-colors cursor-pointer"
                >
                  <span className="font-sans font-bold tracking-[0.2em] uppercase text-[10px]">Reservations</span>
                  <div className="w-4 h-[1px] bg-primary group-hover:w-12 transition-all duration-500" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Side Decoration (Taste §3) */}
          <motion.div 
            className="hidden lg:flex flex-col items-center gap-8 text-primary/10"
            style={{ y: y1 }}
          >
            <div className="w-px h-48 bg-gradient-to-t from-primary/20 to-transparent" />
            <LeafDecoration className="w-16 h-24" />
          </motion.div>
        </div>
      </motion.main>

      {/* ── Bottom Scroll Anchor ── */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 text-warm-white/20"
        style={{ opacity }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-warm-white/20 to-transparent" />
        <span className="text-[8px] tracking-[0.8em] uppercase font-sans font-bold">Scroll</span>
      </motion.div>
    </div>
  )
}
