"use client"
import { motion, useScroll, useTransform } from "framer-motion"

export const PieBreak = () => {
  const { scrollY } = useScroll()

  // Interactive rotation on scroll
  const scrollRotate = useTransform(scrollY, [0, 2000], [0, 360])

  return (
    <div className="relative w-full h-[0vh] flex items-center justify-center bg-background z-30 overflow-visible">
      {/* Connector lines (Taste §3 Rule 2) */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-4 pointer-events-none opacity-10">
        <div className="w-[1px] h-full bg-text-deep" />
      </div>

      <motion.div
        className="relative z-30 w-80 h-80 md:w-[32rem] md:h-[32rem] -mt-16 md:-mt-32 translate-x-12 md:translate-x-32 pointer-events-none"
        style={{ rotate: scrollRotate }}
        animate={{ y: [0, -15, 0] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/rotating-pie.png"
            alt="Artisan Pie"
            className="w-[85%] h-[85%] object-contain drop-shadow-[0_40px_80px_rgba(44,24,16,0.25)]"
          />

          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10" />
        </motion.div>
      </motion.div>
    </div>
  )
}
