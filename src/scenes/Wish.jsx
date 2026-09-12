import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, ArrowRight, ArrowLeft } from 'lucide-react'
import FairyLightsCanvas from '../components/FairyLightsCanvas'

const DEFAULT_PARAGRAPHS = [
  "Happy birthday Rimidi HBD to U HBD to U  ✨",
  "Thank you for being the person who listens without judgment, Thank you for let me annoy you everytime 🌝🌝 ",
  "May this upcoming year bring you an IPHONE from your didi, ",
  "Sar pe mt chdd jana ab but really you are a very special person in my life 😌",
]

export default function Wish({
  friendName = "Rimi",
  paragraphs = DEFAULT_PARAGRAPHS,
  signoff,
  onNext,
  onPrev,
}) {
  const [showContinue, setShowContinue] = useState(false)

  const finalSignoff = signoff || `Happy Birthday, ${friendName}! Here's to your brightest year yet. 💛`

  // Framer-motion container variant with staggerChildren for line-by-line reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.75, // Each paragraph animates 0.75s after the previous
        delayChildren: 0.35,   // Initial slight pause before first line appears
      },
    },
  }

  // Child variant for each line's gentle fade and rise
  const lineVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier
      },
    },
  }

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 select-none">
      {/* Reused 3D Fairy Lights Particle Canvas from Intro */}
      <FairyLightsCanvas />

      {/* Main Glassmorphic Wish Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg sm:max-w-xl bg-white/75 backdrop-blur-md sm:backdrop-blur-xl border border-peach/80 shadow-cozy-lg rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center"
      >
        {/* Soft Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-peach/40 border border-peach/70 text-cocoa/80 text-xs font-semibold mb-6 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-blush fill-blush" />
          <span>A Heartfelt Wish</span>
        </div>

        {/* Floating Heart Icon Accent */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-peach via-blush to-gold flex items-center justify-center mb-6 shadow-cozy">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber" />
        </div>

        {/* Line-by-line animated letter body */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full space-y-4 sm:space-y-5 text-cocoa/85 text-sm sm:text-base leading-relaxed font-medium"
        >
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              variants={lineVariants}
              className="tracking-wide"
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Sign-off line: larger, bolder, in amber accent color */}
          <motion.div
            variants={lineVariants}
            onAnimationComplete={() => setShowContinue(true)}
            className="pt-3 sm:pt-4"
          >
            <p className="font-fredoka text-xl sm:text-2xl font-bold text-amber tracking-wide leading-snug">
              {finalSignoff}
            </p>
          </motion.div>
        </motion.div>

        {/* Continue Button (appears after text finishes animating in) */}
        <div className="mt-8 sm:mt-10 min-h-[56px] flex items-center justify-center gap-3">
          <AnimatePresence>
            {showContinue && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                className="flex items-center gap-3"
              >
                {onPrev && (
                  <button
                    onClick={onPrev}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-peach/40 hover:bg-peach/60 text-cocoa font-semibold text-xs sm:text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  onClick={onNext}
                  className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber via-gold to-peach text-cocoa font-bold text-sm sm:text-base shadow-cozy-lg hover:shadow-glow-gold hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
