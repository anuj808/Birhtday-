import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export default function ProgressDots({
  currentStep,
  unlockedStep = 0,
  totalSteps = 6,
  onStepChange,
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-peach/70 shadow-xs select-none">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isActive = currentStep === idx
        const isUnlocked = idx <= unlockedStep
        const isCompleted = idx < currentStep && isUnlocked
        const isLocked = idx > unlockedStep && idx > 0

        return (
          <button
            key={idx}
            onClick={() => isUnlocked && onStepChange && onStepChange(idx)}
            aria-label={`Scene ${idx + 1} of ${totalSteps}${isLocked ? ' (Locked)' : ''}`}
            disabled={isLocked}
            className="group relative flex items-center justify-center p-0.5 focus:outline-none"
          >
            <motion.span
              layout
              className={`rounded-full transition-all duration-300 block ${
                isActive
                  ? 'w-5 h-2 bg-gradient-to-r from-amber to-gold shadow-xs'
                  : isCompleted
                  ? 'w-2 h-2 bg-amber/80 hover:bg-amber'
                  : isUnlocked
                  ? 'w-2 h-2 bg-peach hover:bg-amber/60'
                  : 'w-2 h-2 bg-cocoa/20'
              }`}
            />

            {isLocked && (
              <span className="sr-only">Locked</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
