import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, ArrowRight, RotateCcw, PartyPopper } from 'lucide-react'
import { useSound } from '../context/SoundContext'

const DEFAULT_WORDS = ['Happy', 'Birth', 'Day', 'To', 'You', '🎉']

const BALLOON_STYLES = [
  {
    gradient: 'from-[#FFB6B9] to-[#FF8E94]',
    border: 'border-[#FF8E94]/40',
    color: '#FFB6B9',
    bobbing: { y: [0, -14, 2, -10, 0], x: [0, 5, -5, 3, 0], rotate: [-3, 3, -2, 2, -3] },
    duration: 3.4,
    delay: 0,
  },
  {
    gradient: 'from-[#FFD97D] to-[#F4A261]',
    border: 'border-[#F4A261]/40',
    color: '#FFD97D',
    bobbing: { y: [0, -18, 3, -12, 0], x: [0, -6, 6, -3, 0], rotate: [2, -4, 3, -2, 2] },
    duration: 4.1,
    delay: 0.3,
  },
  {
    gradient: 'from-[#FFD9B3] to-[#FFB6B9]',
    border: 'border-[#FFB6B9]/40',
    color: '#FFD9B3',
    bobbing: { y: [0, -12, 4, -8, 0], x: [0, 4, -4, 2, 0], rotate: [-2, 4, -3, 3, -2] },
    duration: 3.7,
    delay: 0.6,
  },
  {
    gradient: 'from-[#F4A261] to-[#E76F51]',
    border: 'border-[#E76F51]/40',
    color: '#F4A261',
    bobbing: { y: [0, -16, 2, -10, 0], x: [0, -5, 5, -2, 0], rotate: [3, -3, 2, -3, 3] },
    duration: 3.9,
    delay: 0.2,
  },
  {
    gradient: 'from-[#FFF0DD] to-[#FFD9B3]',
    border: 'border-[#FFD9B3]/50',
    color: '#FFF0DD',
    bobbing: { y: [0, -13, 3, -9, 0], x: [0, 6, -4, 3, 0], rotate: [-4, 2, -3, 4, -4] },
    duration: 4.3,
    delay: 0.5,
  },
  {
    gradient: 'from-[#FF8E94] to-[#E76F51]',
    border: 'border-[#E76F51]/40',
    color: '#FF8E94',
    bobbing: { y: [0, -15, 4, -11, 0], x: [0, -4, 6, -3, 0], rotate: [2, -3, 4, -2, 2] },
    duration: 3.6,
    delay: 0.4,
  },
]

export default function BalloonPop({ words = DEFAULT_WORDS, onNext }) {
  const [poppedIndices, setPoppedIndices] = useState([])
  const [poppingIndex, setPoppingIndex] = useState(null)
  const { playPop, playVictoryChime } = useSound()

  const allPopped = poppedIndices.length === words.length

  const handlePop = (index, e) => {
    if (poppedIndices.includes(index) || poppingIndex === index) return

    setPoppingIndex(index)
    playPop()

    // Calculate screen position of the balloon for scoped confetti burst
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    const balloonColor = BALLOON_STYLES[index % BALLOON_STYLES.length].color
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { x, y },
      colors: [balloonColor, '#FFD97D', '#FFB6B9', '#FFF6EA', '#F4A261'],
      ticks: 140,
      gravity: 1.1,
      scalar: 0.85,
    })

    setTimeout(() => {
      setPoppedIndices((prev) => {
        const next = [...prev, index]
        if (next.length === words.length) {
          // Play celebration chime & confetti burst when all popped
          playVictoryChime()
          setTimeout(() => {
            confetti({
              particleCount: 80,
              spread: 90,
              origin: { y: 0.35 },
              colors: ['#FFB6B9', '#FFD97D', '#F4A261', '#FFD9B3', '#5C3D2E'],
            })
          }, 300)
        }
        return next
      })
      setPoppingIndex(null)
    }, 160)
  }

  const handleReset = () => {
    setPoppedIndices([])
    setPoppingIndex(null)
  }

  return (
    <div className="relative w-full min-h-[82vh] flex flex-col items-center justify-between px-3 sm:px-4 py-4 max-w-xl mx-auto select-none">
      
      {/* Top Section: Badge & Header */}
      <div className="flex flex-col items-center text-center w-full z-20">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-peach/40 border border-peach text-cocoa/80 text-xs font-semibold mb-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber" />
          <span>Scene 4 of 6 &bull; Mini Birthday Game</span>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold font-fredoka text-cocoa tracking-wide mb-1">
          Pop The Balloons! 🎈
        </h2>
        
        <p className="text-xs sm:text-sm text-cocoa/70 font-medium mb-3">
          {allPopped
            ? '🎉 You unlocked the secret message!'
            : 'Tap each balloon to reveal what’s hidden inside...'}
        </p>

        {/* Sentence Rack / Word Holder */}
        <motion.div
          animate={
            allPopped
              ? {
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    '0 10px 30px -10px rgba(92, 61, 46, 0.15)',
                    '0 0 25px rgba(255, 217, 125, 0.6)',
                    '0 10px 30px -10px rgba(92, 61, 46, 0.15)',
                  ],
                }
              : {}
          }
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-peach/80 shadow-cozy flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 min-h-[58px]"
        >
          {words.map((word, idx) => {
            const isRevealed = poppedIndices.includes(idx)
            return (
              <div key={idx} className="flex items-center">
                <AnimatePresence mode="wait">
                  {isRevealed ? (
                    <motion.span
                      key="word"
                      initial={{ scale: 0, y: 12, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-fredoka font-bold text-xs sm:text-sm tracking-wider shadow-sm ${
                        allPopped
                          ? 'bg-gradient-to-r from-amber via-gold to-peach text-cocoa'
                          : 'bg-cream border border-peach/70 text-cocoa'
                      }`}
                    >
                      {word}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="empty"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 }}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-dashed border-peach/80 text-cocoa/30 font-fredoka font-bold text-xs sm:text-sm min-w-[32px] text-center"
                    >
                      ?
                    </motion.span>
                  )}
                </AnimatePresence>
                {idx < words.length - 1 && (
                  <span className="text-cocoa/30 font-bold mx-0.5 sm:mx-1 text-xs select-none">
                    +
                  </span>
                )}
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Middle Floating Balloons Arena */}
      <div className="relative w-full max-w-md my-auto py-4 flex items-center justify-center min-h-[300px] sm:min-h-[340px]">
        <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-8 w-full justify-items-center">
          {words.map((word, idx) => {
            const isPopped = poppedIndices.includes(idx)
            const isCurrentlyPopping = poppingIndex === idx
            const style = BALLOON_STYLES[idx % BALLOON_STYLES.length]

            if (isPopped) {
              // Leave an empty placeholder slot so layout remains stable
              return (
                <div
                  key={idx}
                  className="w-20 h-28 sm:w-24 sm:h-32 flex items-center justify-center opacity-20 pointer-events-none"
                >
                  <span className="text-2xl">✨</span>
                </div>
              )
            }

            return (
              <motion.div
                key={idx}
                animate={style.bobbing}
                transition={{
                  duration: style.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: style.delay,
                }}
                className="relative cursor-pointer touch-manipulation group"
                onClick={(e) => handlePop(idx, e)}
              >
                {/* Balloon Element with pop scale animation */}
                <motion.div
                  animate={
                    isCurrentlyPopping
                      ? { scale: [1, 1.25, 0], opacity: [1, 1, 0] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className={`w-20 h-26 sm:w-24 sm:h-30 rounded-[50%] bg-gradient-to-t ${style.gradient} border-2 ${style.border} shadow-cozy flex flex-col items-center justify-center relative select-none`}
                >
                  {/* Gloss reflection shine */}
                  <div className="absolute top-2 left-2.5 w-2.5 h-4 sm:w-3 sm:h-5 rounded-[50%] bg-white/60 -rotate-25 blur-[0.4px] pointer-events-none" />

                  {/* Question mark / Mystery icon inside balloon */}
                  <span className="font-fredoka font-bold text-base sm:text-lg text-cocoa/70 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </span>

                  {/* Knot */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-cocoa/30 rounded-full" />

                  {/* Wavy string underneath */}
                  <svg
                    className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-12 stroke-cocoa/35 fill-none pointer-events-none"
                    viewBox="0 0 16 50"
                  >
                    <path d="M8,0 Q14,12 8,25 T8,50" strokeWidth="1.2" />
                  </svg>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom Action Area: Continue or Play Again */}
      <div className="w-full flex flex-col items-center justify-center min-h-[64px] z-20">
        <AnimatePresence mode="wait">
          {allPopped ? (
            <motion.div
              key="win"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={handleReset}
                aria-label="Replay balloon pop game"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-cream/90 border border-peach text-cocoa/80 text-xs font-semibold hover:bg-peach/30 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pop Again</span>
              </button>

              <button
                onClick={onNext}
                className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-amber via-gold to-peach text-cocoa font-bold text-sm sm:text-base shadow-cozy-lg hover:shadow-glow-gold hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>continue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="counter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold text-cocoa/60"
            >
              {poppedIndices.length} of {words.length} balloons popped
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
