import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, RotateCcw, Heart, ArrowLeft } from 'lucide-react'
import FairyLightsCanvas from '../components/FairyLightsCanvas'
import { useSound } from '../context/SoundContext'

export default function Closing({
  authorName = "Anuj",
  signature,
  onRestart,
  onPrev,
}) {
  const [isBlown, setIsBlown] = useState(false)
  const { playVictoryChime } = useSound()

  const finalSignature = signature || `— ${authorName}`

  const handleBlowCandle = () => {
    if (isBlown) return
    setIsBlown(true)
    playVictoryChime()

    // Warm celebratory confetti burst across the screen
    const count = 200
    const defaults = {
      origin: { y: 0.55 },
      colors: ['#FFB6B9', '#FFD97D', '#F4A261', '#FFD9B3', '#FFF6EA', '#5C3D2E'],
    }

    confetti({
      ...defaults,
      particleCount: 70,
      spread: 50,
      startVelocity: 50,
    })
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 80,
        spread: 100,
        startVelocity: 40,
        decay: 0.92,
      })
    }, 150)
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        spread: 140,
        startVelocity: 30,
        decay: 0.94,
      })
    }, 300)
  }

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 select-none">
      {/* Shared 3D Fairy Lights Particle Canvas in background */}
      <FairyLightsCanvas count={90} />

      {/* Optional Top Corner Subtle Restart Button */}
      {onRestart && (
        <div className="fixed top-5 left-5 z-50">
          <button
            onClick={onRestart}
            aria-label="Restart birthday experience"
            title="Watch again from beginning"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream/90 backdrop-blur-md border border-peach/70 text-cocoa/70 hover:text-cocoa hover:bg-peach/40 shadow-cozy transition-all text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-45" />
            <span className="hidden sm:inline">Start Over</span>
          </button>
        </div>
      )}

      {/* Main Closing Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md sm:max-w-lg bg-white/80 backdrop-blur-md sm:backdrop-blur-xl border border-peach/80 shadow-cozy-lg rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center"
      >
        {/* Soft Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-peach/40 border border-peach text-cocoa/80 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber" />
          <span>Final Moment</span>
        </div>

        {/* Cake Illustration Area */}
        <div className="relative flex flex-col items-center justify-center mb-6 pt-10">
          
          {/* CANDLE FLAME & SMOKE (Interactive on click) */}
          <div
            className="relative cursor-pointer z-30 group touch-manipulation"
            onClick={handleBlowCandle}
          >
            {/* Candle Flame (Flickering Animation) */}
            <AnimatePresence>
              {!isBlown && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.08, 0.95, 1.05, 1],
                    rotate: [-2, 2, -1, 3, 0],
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.25 },
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-6 h-9 sm:w-7 sm:h-10 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(255,217,125,0.9)]"
                >
                  {/* Outer Flame Glow */}
                  <div className="w-full h-full rounded-[50%_50%_35%_35%] bg-gradient-to-t from-[#F4A261] via-[#FFD97D] to-white" />
                  {/* Inner White Hot Core */}
                  <div className="absolute bottom-1 w-2.5 h-4 rounded-[50%_50%_35%_35%] bg-white/90" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Candle Wick */}
            <div className="w-1 h-3 bg-cocoa/80 rounded-full mx-auto -mt-0.5" />

            {/* Smoke Puff when blown out */}
            <AnimatePresence>
              {isBlown && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.75, scale: 0.4, y: 0, x: 0 }}
                      animate={{
                        opacity: 0,
                        scale: 2.2,
                        y: -50 - i * 16,
                        x: (i % 2 === 0 ? 1 : -1) * (10 + i * 8),
                      }}
                      transition={{
                        duration: 1.6,
                        delay: i * 0.15,
                        ease: 'easeOut',
                      }}
                      className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cocoa/20 blur-[1px]"
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Candle Body */}
          <div className="relative w-3.5 sm:w-4 h-12 sm:h-14 rounded-t-sm shadow-sm overflow-hidden bg-gradient-to-b from-[#FFF6EA] to-[#FFD9B3] border border-peach/80 z-20">
            {/* Candle Stripes */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#FFB6B9,#FFB6B9_4px,transparent_4px,transparent_8px)] opacity-60" />
          </div>

          {/* THE CAKE (CSS & SVG Shapes) */}
          <div className="relative flex flex-col items-center -mt-1 z-10">
            {/* Top Tier */}
            <div className="relative w-28 sm:w-32 h-14 rounded-t-2xl bg-gradient-to-b from-[#FFF6EA] to-[#FFD9B3] border-2 border-peach/90 shadow-sm flex flex-col justify-between overflow-hidden">
              {/* Frosting Drips */}
              <div className="w-full flex justify-around">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="w-4 h-3 bg-white/95 rounded-b-full shadow-xs"
                    style={{ height: idx % 2 === 0 ? '14px' : '9px' }}
                  />
                ))}
              </div>
              {/* Cute Sprinkles */}
              <div className="flex justify-around items-center px-3 pb-2 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB6B9]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD97D]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F4A261]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB6B9]" />
              </div>
            </div>

            {/* Bottom Tier */}
            <div className="relative w-40 sm:w-48 h-18 rounded-t-2xl bg-gradient-to-b from-[#FFD9B3] to-[#F4A261]/60 border-2 border-peach/90 shadow-md flex flex-col justify-between overflow-hidden">
              {/* Mid Layer Frosting Trim */}
              <div className="w-full h-2.5 bg-white/95 shadow-xs" />
              {/* Bottom Sprinkles & Details */}
              <div className="flex justify-around items-center px-5 pb-2 opacity-85">
                <span className="w-2 h-2 rounded-full bg-[#FFF6EA]" />
                <span className="w-2 h-2 rounded-full bg-[#FFB6B9]" />
                <span className="w-2 h-2 rounded-full bg-[#FFD97D]" />
                <span className="w-2 h-2 rounded-full bg-[#FFF6EA]" />
                <span className="w-2 h-2 rounded-full bg-[#F4A261]" />
              </div>
            </div>

            {/* Cake Stand / Plate */}
            <div className="w-48 sm:w-56 h-3.5 rounded-full bg-white border-2 border-peach shadow-cozy -mt-1" />
            <div className="w-20 h-2 bg-[#EED8C2] rounded-b-lg shadow-sm" />
          </div>
        </div>

        {/* HINT TEXT OR FINAL MESSAGE */}
        <div className="min-h-[90px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isBlown ? (
              /* Hint Text before blowing */
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.65, 1, 0.65],
                  y: [0, -2, 0],
                }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="cursor-pointer"
                onClick={handleBlowCandle}
              >
                <p className="font-fredoka text-lg sm:text-xl font-bold text-amber tracking-wide">
                  tap the flame and make a wish 🕯️✨
                </p>
                <p className="text-xs text-cocoa/60 font-medium mt-1">
                  (make the biggest wish of your heart)
                </p>
              </motion.div>
            ) : (
              /* Final Closing Message after candle is blown */
              <motion.div
                key="message"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="flex flex-col items-center"
              >
                <h2 className="font-fredoka text-2xl sm:text-3xl font-bold text-cocoa tracking-wide mb-1.5">
                  Made with love, just for you 💛
                </h2>

                <p className="text-sm sm:text-base text-cocoa/60 font-semibold italic tracking-wider">
                  {finalSignature}
                </p>

                <div className="flex items-center gap-1 text-xs text-amber font-bold mt-3">
                  <span>🎂</span>
                  <span>Wish sent to the stars</span>
                  <span>✨</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subtle Footer Actions (Back or Restart) */}
        <div className="mt-8 flex items-center justify-center gap-3 pt-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-peach/40 hover:bg-peach/60 text-cocoa font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {onRestart && (
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-cream border border-peach/80 hover:bg-peach/30 text-cocoa font-semibold text-xs sm:text-sm shadow-xs transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Watch Again</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
