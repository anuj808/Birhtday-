import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Car, Sparkles, Heart, ArrowRight, ArrowLeft } from 'lucide-react'
import { useSound } from '../context/SoundContext'

const TAUNT_MESSAGES = [
  'pick one honestly:',
  'nice try 👀',
  'nope, not happening 😂',
  'why are you trying so hard? 🚗',
  'you know you want to say yes!',
  'the button is faster than you ⚡',
  'resistance is futile! 🏎️💨',
  'just click Definitely Yes already! 🥹',
]

export default function DodgeButtonGame({ onNext, onPrev }) {
  const [dodgeCount, setDodgeCount] = useState(0)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [isAnswered, setIsAnswered] = useState(false)
  const [hasStartedDodging, setHasStartedDodging] = useState(false)

  const arenaRef = useRef(null)
  const yesBtnRef = useRef(null)
  const noBtnRef = useRef(null)
  const lastDodgeTimeRef = useRef(0)

  const { playVictoryChime, playPop } = useSound()

  // Pick a random location within arena bounds that doesn't overlap Yes button
  const dodge = useCallback(() => {
    const now = Date.now()
    if (now - lastDodgeTimeRef.current < 80) return // throttle rapid triggers
    lastDodgeTimeRef.current = now

    setDodgeCount((prev) => prev + 1)
    setHasStartedDodging(true)
    playPop()

    const arena = arenaRef.current
    if (!arena) {
      // Fallback random offset
      setNoPosition({
        x: (Math.random() - 0.5) * 220,
        y: (Math.random() - 0.5) * 160,
      })
      return
    }

    const arenaRect = arena.getBoundingClientRect()
    const padding = 20
    const btnWidth = 100
    const btnHeight = 44

    // Available arena space
    const maxX = arenaRect.width / 2 - btnWidth / 2 - padding
    const maxY = arenaRect.height / 2 - btnHeight / 2 - padding

    let newX = 0
    let newY = 0
    let attempts = 0

    // Try finding a spot sufficiently far from Yes button and previous position
    do {
      newX = (Math.random() * 2 - 1) * maxX
      newY = (Math.random() * 2 - 1) * maxY
      attempts++
    } while (
      attempts < 15 &&
      // Keep away from Yes button (located roughly around x: -80, y: 0 relative to center)
      Math.hypot(newX - (-75), newY - 0) < 95 &&
      // Keep away from last position so it doesn't just vibrate in place
      Math.hypot(newX - noPosition.x, newY - noPosition.y) < 70
    )

    setNoPosition({ x: newX, y: newY })
  }, [noPosition, playPop])

  // Desktop mouse proximity tracking: dodge BEFORE the cursor touches it
  const handleMouseMove = (e) => {
    if (isAnswered || !noBtnRef.current) return
    const rect = noBtnRef.current.getBoundingClientRect()
    const btnCenterX = rect.left + rect.width / 2
    const btnCenterY = rect.top + rect.height / 2
    const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY)

    // Proximity trigger distance (gets slightly wider as dodges increase)
    const proximityThreshold = Math.min(85 + dodgeCount * 3, 130)

    if (distance < proximityThreshold) {
      dodge()
    }
  }

  const handleYesClick = () => {
    if (isAnswered) return
    setIsAnswered(true)
    playVictoryChime()

    // Confetti celebration!
    const count = 150
    const defaults = {
      origin: { y: 0.55 },
      colors: ['#FFB6B9', '#FFD97D', '#F4A261', '#FFD9B3', '#5C3D2E'],
    }

    confetti({
      ...defaults,
      particleCount: 50,
      spread: 50,
      startVelocity: 45,
    })
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 70,
        spread: 100,
        startVelocity: 35,
      })
    }, 150)
  }

  const currentTaunt = TAUNT_MESSAGES[Math.min(dodgeCount, TAUNT_MESSAGES.length - 1)]

  // Button animation spring gets faster as attempts increase
  const springStiffness = Math.min(300 + dodgeCount * 25, 600)
  const springDamping = Math.max(22 - dodgeCount, 12)

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[82vh] flex flex-col items-center justify-center px-3 sm:px-4 py-4 text-center max-w-xl mx-auto select-none"
    >
      {/* Badge */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-peach/50 border border-peach text-cocoa text-xs font-semibold mb-4 shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber" />
        <span>Scene 3 of 6 &bull; A Quick Question</span>
      </motion.div>

      {/* Main Playful Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="relative w-full bg-white/85 backdrop-blur-md sm:backdrop-blur-xl rounded-3xl p-6 sm:p-9 border border-peach/80 shadow-cozy-lg flex flex-col items-center overflow-hidden"
      >
        {/* Car Icon with gentle bounce */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber via-gold to-peach flex items-center justify-center mb-4 shadow-md shadow-amber/20"
        >
          <Car className="w-8 h-8 sm:w-10 sm:h-10 text-cocoa" />
        </motion.div>

        {/* Big Question */}
        <h2 className="text-2xl sm:text-3xl sm:leading-tight font-bold font-fredoka text-cocoa mb-2 tracking-wide max-w-md">
          Will you buy Hot Wheels for me? 🚗
        </h2>

        {/* Taunt text that changes after dodges */}
        <motion.div
          key={dodgeCount}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-h-[26px] mb-6"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-peach/30 border border-peach/60 text-cocoa/80 text-xs font-bold tracking-wide">
            {currentTaunt}
          </span>
        </motion.div>

        {/* Button Arena (Bounded area for the dodging "No" button) */}
        <div
          ref={arenaRef}
          className="relative w-full h-44 sm:h-48 rounded-2xl bg-cream/40 border border-dashed border-peach/70 flex items-center justify-center overflow-hidden mb-6"
        >
          {/* Static YES Button (Always clickable, fixed center-left) */}
          <div className="absolute left-1/2 -translate-x-[115%] sm:-translate-x-[125%] z-20">
            <button
              ref={yesBtnRef}
              onClick={handleYesClick}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-amber via-gold to-peach text-cocoa font-bold text-sm sm:text-base shadow-cozy hover:shadow-glow-gold hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Heart className="w-4 h-4 text-cocoa fill-blush group-hover:scale-110 transition-transform" />
              <span>Definitely yes 😍</span>
            </button>
          </div>

          {/* Dodging NO Button (Impossible to click) */}
          <motion.div
            ref={noBtnRef}
            animate={{
              x: noPosition.x,
              y: noPosition.y,
            }}
            transition={{
              type: 'spring',
              stiffness: springStiffness,
              damping: springDamping,
            }}
            className="absolute z-20 touch-manipulation"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: hasStartedDodging ? 0 : 25,
              marginTop: hasStartedDodging ? 0 : -22,
            }}
          >
            {/* Extended invisible touch hit area for mobile */}
            <div
              className="relative p-4 sm:p-6 -m-4 sm:-m-6 cursor-not-allowed"
              onMouseEnter={dodge}
              onPointerEnter={dodge}
              onPointerDown={(e) => {
                e.preventDefault()
                dodge()
              }}
              onTouchStart={(e) => {
                e.preventDefault()
                dodge()
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  dodge()
                }}
                className="px-6 sm:px-7 py-3 rounded-full bg-white/90 border border-peach/80 text-cocoa/70 font-fredoka font-bold text-sm shadow-xs hover:bg-white hover:text-cocoa transition-colors pointer-events-none select-none"
              >
                No
              </button>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        {onPrev && !isAnswered && (
          <div className="flex items-center justify-center">
            <button
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-peach/40 hover:bg-peach/60 text-cocoa font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Celebratory Success Modal on YES */}
      <AnimatePresence>
        {isAnswered && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-cocoa/30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border-2 border-peach shadow-cozy-lg flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber to-gold flex items-center justify-center mb-4 shadow-md shadow-gold/30">
                <Car className="w-8 h-8 text-cocoa" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-fredoka text-cocoa mb-2">
                Thank you so much! 🥹🚗
              </h3>

              <p className="text-xs sm:text-sm text-cocoa/80 font-medium mb-6 leading-relaxed">
                Hot Wheels collection expanded! You’re officially the absolute best!
              </p>

              <button
                onClick={onNext}
                className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-amber via-gold to-peach text-cocoa font-bold text-sm sm:text-base shadow-cozy-lg hover:shadow-glow-gold hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>continue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
