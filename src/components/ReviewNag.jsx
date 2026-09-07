import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Star, Sparkles } from 'lucide-react'

const REVIEW_OPTIONS = [
  { label: 'Good', reaction: 'Thanks! 😊' },
  { label: 'Very Good', reaction: 'Aww, thank you! 🥰' },
  { label: 'Amazing 🤩', reaction: '10/10 best review! ⭐⭐⭐⭐⭐' },
]

const NAG_INTERVAL_MS = 5000 // 30 seconds

export default function ReviewNag() {
  const [isVisible, setIsVisible] = useState(false)
  const [thankingMsg, setThankingMsg] = useState(null)

  const nagTimerRef = useRef(null)

  // Start the 30s countdown to show the nag modal
  const scheduleNag = () => {
    clearTimeout(nagTimerRef.current)
    nagTimerRef.current = setTimeout(() => {
      setThankingMsg(null)
      setIsVisible(true)
    }, NAG_INTERVAL_MS)
  }

  // Initial schedule on mount
  useEffect(() => {
    scheduleNag()
    return () => {
      clearTimeout(nagTimerRef.current)
    }
  }, [])

  const dismissModal = () => {
    setIsVisible(false)
    setThankingMsg(null)
    // Restart 30-second countdown after each response
    scheduleNag()
  }

  const handleReview = (option, e) => {
    setThankingMsg(option.reaction)

    // Warm confetti burst
    try {
      const rect = e?.currentTarget?.getBoundingClientRect()
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5

      confetti({
        particleCount: 40,
        spread: 70,
        origin: { x, y },
        colors: ['#FFB6B9', '#FFD97D', '#F4A261', '#FFD9B3', '#FFF6EA'],
        ticks: 140,
        gravity: 1.0,
        scalar: 0.9,
      })
    } catch (err) {
      // ignore
    }

    // Auto-dismiss ~1.1s after answering
    setTimeout(() => {
      dismissModal()
    }, 1100)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Full-Screen Dimmed Backdrop Overlay (Blocking interaction underneath) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-cocoa/45 backdrop-blur-sm"
            // Intentionally not dismissible on click — must tap a review button!
          />

          {/* Centered Large Review Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.72, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 270,
              damping: 18,
            }}
            className="relative z-10 w-[88%] sm:w-[75%] max-w-sm sm:max-w-md bg-white/95 backdrop-blur-xl border-2 border-peach rounded-3xl p-6 sm:p-8 shadow-cozy-lg text-center select-none"
          >
            {/* Thank you reaction view */}
            {thankingMsg ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  🎉
                </motion.div>
                <div className="font-fredoka font-bold text-lg sm:text-xl text-amber leading-snug">
                  {thankingMsg}
                </div>
                <p className="text-xs text-cocoa/60 font-medium mt-2">
                  Review recorded successfully!
                </p>
              </motion.div>
            ) : (
              /* Main Nag Content */
              <div className="flex flex-col items-center">
                {/* Big Playful Emoji Badge */}
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    rotate: [0, -4, 4, 0],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-peach via-blush to-gold flex items-center justify-center mb-4 shadow-md shadow-peach/40 text-4xl sm:text-5xl"
                >
                  🥺
                </motion.div>

                {/* Badge Label */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach/40 border border-peach/70 text-amber font-bold text-xs mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber text-amber" />
                  <span>APP STORE CHECK-IN</span>
                  <Star className="w-3.5 h-3.5 fill-amber text-amber" />
                </div>

                {/* Big Prominent Text */}
                <h3 className="font-fredoka text-lg sm:text-2xl font-bold text-cocoa leading-snug mb-2 max-w-xs sm:max-w-sm">
                  Sorry to bother you, but it's my job — give me a review! 🥺
                </h3>

                <p className="text-xs sm:text-sm text-cocoa/70 font-medium mb-6">
                  Please rate your birthday experience so far:
                </p>

                {/* 3 Prominent Options */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full">
                  {REVIEW_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={(e) => handleReview(opt, e)}
                      className="group flex-1 py-3 px-3.5 rounded-2xl bg-gradient-to-r from-peach/60 to-cream hover:from-amber hover:via-gold hover:to-peach border-2 border-peach/80 hover:border-transparent text-cocoa hover:text-cocoa font-fredoka font-bold text-xs sm:text-sm shadow-xs hover:shadow-glow-gold hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
