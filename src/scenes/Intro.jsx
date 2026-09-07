import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, ArrowRight, Sparkles } from 'lucide-react'
import FairyLightsCanvas from '../components/FairyLightsCanvas'

// 2. CSS/DOM FLOATING BALLOONS COMPONENT
const BALLOONS = [
  { id: 1, left: '6%', duration: 16, delay: 0, color: 'from-[#FFB6B9] to-[#FF8E94]', size: 'w-12 h-16 sm:w-16 sm:h-20' },
  { id: 2, left: '22%', duration: 20, delay: 3, color: 'from-[#FFD97D] to-[#F4A261]', size: 'w-10 h-14 sm:w-14 sm:h-18' },
  { id: 3, left: '74%', duration: 17, delay: 1.5, color: 'from-[#FFD9B3] to-[#FFB6B9]', size: 'w-14 h-18 sm:w-18 sm:h-24' },
  { id: 4, left: '88%', duration: 19, delay: 5, color: 'from-[#F4A261] to-[#FF8E94]', size: 'w-11 h-15 sm:w-15 sm:h-19' },
  { id: 5, left: '46%', duration: 22, delay: 7, color: 'from-[#FFF6EA] to-[#FFD97D]', size: 'w-9 h-12 sm:w-12 sm:h-16' },
]

function FloatingBalloons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {BALLOONS.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ left: b.left, bottom: '-160px' }}
          animate={{
            y: ['0vh', '-135vh'],
            x: [0, 18, -18, 10, 0],
            rotate: [-6, 6, -4, 4, -6],
          }}
          transition={{
            y: { duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay },
            x: { duration: b.duration * 0.6, repeat: Infinity, ease: 'easeInOut', delay: b.delay },
            rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {/* Balloon Body */}
          <div
            className={`${b.size} rounded-[50%] bg-gradient-to-t ${b.color} shadow-cozy relative opacity-85`}
          >
            {/* Subtle gloss reflection */}
            <div className="absolute top-2 left-2.5 w-2 h-3.5 sm:w-2.5 sm:h-4 rounded-[50%] bg-white/50 -rotate-25 blur-[0.5px]" />
            {/* Knot */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-cocoa/30 rounded-full" />
            {/* Wavy String */}
            <svg
              className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-24 stroke-cocoa/35 fill-none"
              viewBox="0 0 16 100"
            >
              <path d="M8,0 Q14,25 8,50 T8,100" strokeWidth="1.2" />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// 3. MAIN INTRO COMPONENT
export default function Intro({ friendName = "Rimi", onNext }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showContinue, setShowContinue] = useState(false)

  const handleEnvelopeClick = () => {
    if (isOpen) return
    setIsOpen(true)

    // Warm celebratory confetti burst
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#FFB6B9', '#FFD97D', '#F4A261', '#FFD9B3', '#FFF6EA'],
      ticks: 240,
      gravity: 0.85,
      scalar: 1,
    })

    // Reveal continue button after ~1s delay
    setTimeout(() => {
      setShowContinue(true)
    }, 1000)
  }

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* 3D R3F Fairy Lights Background */}
      <FairyLightsCanvas />

      {/* Floating CSS Balloons behind envelope */}
      <FloatingBalloons />

      {/* Main Interactive Center Area */}
      <div className="relative z-20 flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full pt-14 pb-8">
        
        {/* Envelope Container with 3D perspective */}
        <div 
          className="relative cursor-pointer group"
          onClick={handleEnvelopeClick}
          style={{ perspective: '1200px' }}
        >
          {/* THE ENVELOPE */}
          <div className="relative w-64 sm:w-72 h-44 sm:h-48 rounded-2xl bg-[#EED8C2] border-2 border-peach/80 shadow-cozy-lg flex items-center justify-center">
            
            {/* Inner Back Shadow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#DFBEA3] to-[#EED8C2]" />

            {/* THE SLIDING LETTER (Card Inside) */}
            <motion.div
              initial={{ y: 0, scale: 0.88, opacity: 0 }}
              animate={
                isOpen
                  ? { y: -135, scale: 1, opacity: 1 }
                  : { y: 0, scale: 0.88, opacity: 0 }
              }
              transition={{
                type: 'spring',
                stiffness: 160,
                damping: 18,
                delay: isOpen ? 0.35 : 0,
              }}
              className="absolute z-20 w-[92%] bg-white/95 backdrop-blur-md rounded-2xl p-5 border-2 border-peach/70 shadow-cozy-lg flex flex-col items-center text-center pointer-events-auto"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach/40 text-cocoa/80 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber" />
                <span>Special Surprise</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-fredoka text-cocoa mb-1.5 leading-tight">
                Happy Birthday, {friendName}! 🎂
              </h1>

              <p className="text-xs sm:text-sm text-cocoa/80 font-medium leading-relaxed mb-3">
                A warm little journey crafted with love to celebrate your brightest day!
              </p>

              <div className="flex items-center gap-1.5 text-amber text-xs font-bold">
                <span>✨</span>
                <span>You deserve the world</span>
                <span>✨</span>
              </div>
            </motion.div>

            {/* Envelope Bottom & Side Triangular Folds */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
              {/* Left fold */}
              <div 
                className="absolute inset-0 bg-[#F4E1D0]"
                style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }}
              />
              {/* Right fold */}
              <div 
                className="absolute inset-0 bg-[#EED6C3]"
                style={{ clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)' }}
              />
              {/* Bottom fold */}
              <div 
                className="absolute inset-0 bg-[#FBEFE3] border-t border-peach/50 shadow-sm"
                style={{ clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)' }}
              />
            </div>

            {/* Envelope Top Flap (Animated Flip / RotateX) */}
            <motion.div
              initial={false}
              animate={{
                rotateX: isOpen ? 180 : 0,
                zIndex: isOpen ? 5 : 25,
              }}
              transition={{
                duration: 0.65,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
              }}
              className="absolute top-0 inset-x-0 h-24 sm:h-28 z-25 pointer-events-none"
            >
              {/* Flap shape */}
              <div
                className="w-full h-full bg-[#E5CCA8] border-b border-peach/70 shadow-sm"
                style={{ clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)' }}
              />

              {/* Heart Wax Seal (Placed at the tip of the flap) */}
              <motion.div
                animate={
                  isOpen
                    ? { scale: [1, 1.4, 0], opacity: 0 }
                    : { scale: [1, 1.06, 1], opacity: 1 }
                }
                transition={
                  isOpen
                    ? { duration: 0.25 }
                    : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                }
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber via-blush to-gold border-2 border-cream shadow-cozy flex items-center justify-center pointer-events-auto"
              >
                <Heart className="w-5 h-5 text-cream fill-cream drop-shadow-sm" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Pulsing Hint Text Below Envelope */}
        {!isOpen ? (
          <motion.div
            animate={{
              opacity: [0.65, 1, 0.65],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mt-8 text-center"
          >
            <p className="text-sm sm:text-base font-semibold text-cocoa/85 tracking-wide bg-cream/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-peach/50 shadow-sm">
              tap the envelope to open your surprise ✨
            </p>
          </motion.div>
        ) : (
          /* Continue Button after ~1s delay */
          <div className="mt-8 h-12 flex items-center justify-center">
            <AnimatePresence>
              {showContinue && (
                <motion.button
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                  onClick={onNext}
                  className="group flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-amber via-gold to-peach text-cocoa font-bold text-sm sm:text-base shadow-cozy-lg hover:shadow-glow-gold hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}
