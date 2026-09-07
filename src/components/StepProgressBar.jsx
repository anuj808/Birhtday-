import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Mail, Camera, Car, Sparkles, Heart, Flame, Lock } from 'lucide-react'

const STEP_ICONS = [
  { icon: Mail, label: 'Envelope' },
  { icon: Camera, label: 'Scrapbook' },
  { icon: Car, label: 'Hot Wheels' },
  { icon: Sparkles, label: 'Balloon Pop' },
  { icon: Heart, label: 'The Wish' },
  { icon: Flame, label: 'Candle' },
]

export default function StepProgressBar({
  currentStep,
  unlockedStep = 0,
  totalSteps,
  onStepChange,
  onNext,
  onPrev,
}) {
  const [shakingIdx, setShakingIdx] = useState(null)

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentStep < unlockedStep) {
          onNext()
        } else {
          setShakingIdx(currentStep + 1)
          setTimeout(() => setShakingIdx(null), 450)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        onPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrev, currentStep, unlockedStep])

  const handleStepClick = (idx) => {
    if (idx > unlockedStep) {
      // Trigger shake animation on locked step
      setShakingIdx(idx)
      setTimeout(() => setShakingIdx(null), 450)
      return
    }
    onStepChange(idx)
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center items-center px-3 pointer-events-none">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        aria-label="Scene navigation"
        className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cream/95 backdrop-blur-md border border-peach/90 shadow-cozy-lg touch-manipulation"
      >
        {/* Previous Button (Always works for visited scenes) */}
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          aria-label="Previous scene"
          className="p-1.5 sm:p-2 rounded-full text-cocoa hover:bg-peach/40 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Step dots / icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-0.5 sm:px-1">
          {STEP_ICONS.map((step, idx) => {
            const Icon = step.icon
            const isActive = currentStep === idx
            const isUnlocked = idx <= unlockedStep
            const isCompleted = idx < currentStep && isUnlocked
            const isLocked = idx > unlockedStep && idx > 0 // Intro (0) is never locked
            const isShaking = shakingIdx === idx

            return (
              <motion.button
                key={idx}
                onClick={() => handleStepClick(idx)}
                aria-label={
                  isLocked
                    ? `Scene ${idx + 1}: ${step.label} (Locked)`
                    : `Go to scene ${idx + 1}: ${step.label}`
                }
                animate={
                  isShaking
                    ? { x: [0, -6, 6, -5, 5, -2, 2, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.4 }}
                disabled={isLocked && false /* handled by click handler for shake */}
                className={`group relative flex items-center justify-center transition-all duration-300 rounded-full select-none ${
                  isActive
                    ? 'w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-amber to-gold text-white shadow-glow-gold'
                    : isCompleted
                    ? 'w-7 h-7 sm:w-8 sm:h-8 bg-peach text-cocoa hover:bg-blush/80'
                    : isUnlocked
                    ? 'w-7 h-7 sm:w-8 sm:h-8 bg-cream border border-peach/80 text-cocoa/60 hover:text-cocoa hover:border-amber'
                    : 'w-7 h-7 sm:w-8 sm:h-8 bg-cocoa/5 border border-cocoa/15 text-cocoa/30 cursor-not-allowed'
                }`}
              >
                <Icon
                  className={
                    isActive
                      ? 'w-4 h-4 sm:w-5 sm:h-5'
                      : 'w-3 h-3 sm:w-4 sm:h-4 opacity-80'
                  }
                />

                {/* Small Lock Badge for locked steps */}
                {isLocked && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cocoa/80 text-cream flex items-center justify-center shadow-xs">
                    <Lock className="w-2 h-2" />
                  </span>
                )}

                {/* Hover / Tap Tooltip */}
                <span className="absolute -top-8 scale-0 group-hover:scale-100 transition-transform duration-150 pointer-events-none px-2 py-0.5 rounded-md bg-cocoa text-cream text-[10px] sm:text-[11px] font-medium whitespace-nowrap shadow-md z-30">
                  {idx + 1}. {step.label} {isLocked ? '🔒' : ''}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Next Button (Allowed only if currentStep < unlockedStep) */}
        <button
          onClick={() => {
            if (currentStep < unlockedStep) {
              onNext()
            } else {
              setShakingIdx(currentStep + 1)
              setTimeout(() => setShakingIdx(null), 450)
            }
          }}
          disabled={currentStep >= totalSteps - 1 || currentStep >= unlockedStep}
          aria-label="Next scene"
          className="p-1.5 sm:p-2 rounded-full text-cocoa hover:bg-peach/40 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.nav>
    </div>
  )
}
