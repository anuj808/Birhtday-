import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import AudioToggle from './components/AudioToggle'
import StepProgressBar from './components/StepProgressBar'
import ProgressDots from './components/ProgressDots'
import ReviewNag from './components/ReviewNag'
import { SoundProvider } from './context/SoundContext'

// 6 Scenes in order
import Intro from './scenes/Intro'
import PhotoScrapbook from './scenes/PhotoScrapbook'
import DodgeButtonGame from './scenes/DodgeButtonGame'
import BalloonPop from './scenes/BalloonPop'
import Wish from './scenes/Wish'
import Closing from './scenes/Closing'

const TOTAL_STEPS = 6

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = next, -1 = prev
  const shouldReduceMotion = useReducedMotion()

  // Track unlocked scenes; persist in sessionStorage
  const [unlockedStep, setUnlockedStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem('birthday_unlocked_step')
      return saved !== null ? Math.max(0, Math.min(TOTAL_STEPS - 1, parseInt(saved, 10))) : 0
    } catch (e) {
      return 0
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem('birthday_unlocked_step', unlockedStep.toString())
    } catch (e) {
      // ignore
    }
  }, [unlockedStep])

  const goToStep = (stepIndex) => {
    if (stepIndex === currentStep) return false
    // Lock system: can only navigate to already unlocked scenes
    if (stepIndex > unlockedStep) {
      return false
    }
    setDirection(stepIndex > currentStep ? 1 : -1)
    setCurrentStep(stepIndex)
    return true
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const nextIndex = currentStep + 1
      // Unlock the next step upon clicking continue
      setUnlockedStep((prev) => Math.max(prev, nextIndex))
      setDirection(1)
      setCurrentStep(nextIndex)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const restart = () => {
    setDirection(-1)
    setCurrentStep(0)
  }

  // Directional slide & fade variants (reduced motion aware)
  const pageVariants = {
    initial: (dir) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : (dir > 0 ? 60 : -60),
      scale: shouldReduceMotion ? 1 : 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0.2 }
        : {
            x: { type: 'spring', stiffness: 280, damping: 28 },
            opacity: { duration: 0.35 },
            scale: { duration: 0.35 },
          },
    },
    exit: (dir) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : (dir > 0 ? -60 : 60),
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: {
        opacity: { duration: 0.2 },
      },
    }),
  }

  const renderScene = () => {
    switch (currentStep) {
      case 0:
        return <Intro onNext={nextStep} friendName="Rimi" />
      case 1:
        return <PhotoScrapbook onNext={nextStep} onPrev={prevStep} />
      case 2:
        return <DodgeButtonGame onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <BalloonPop onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <Wish onNext={nextStep} onPrev={prevStep} friendName="Rimi" />
      case 5:
        return <Closing onPrev={prevStep} onRestart={restart} authorName="Anuj" />
      default:
        return null
    }
  }

  return (
    <SoundProvider>
      <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
        {/* Recurring Joke Review Nag Toast (every 30s) */}
        <ReviewNag />

        {/* Background warm ambient orbs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 bg-peach/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-80 sm:w-96 h-80 sm:h-96 bg-blush/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-gold/20 rounded-full blur-3xl" />
        </div>

        {/* Floating Top Bar with Brand, Subtle Animated Progress Dots, and Sound */}
        <header className="relative z-40 w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-2">
          {/* Logo / Title */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl select-none">✨</span>
            <span className="font-fredoka font-bold text-base sm:text-xl text-cocoa tracking-wide truncate max-w-[140px] sm:max-w-none">
              Birthday Surprise
            </span>
          </div>

          {/* Subtle Top Animated Progress Dots */}
          <div className="hidden xs:flex sm:flex items-center">
            <ProgressDots
              currentStep={currentStep}
              unlockedStep={unlockedStep}
              totalSteps={TOTAL_STEPS}
              onStepChange={goToStep}
            />
          </div>

          {/* Audio Toggle */}
          <AudioToggle />
        </header>

        {/* Main Continuous Interactive Scene Area with Framer Motion AnimatePresence */}
        <main className="flex-1 flex items-center justify-center relative w-full px-2 sm:px-4 py-4 sm:py-6 mb-20 sm:mb-24">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex items-center justify-center"
            >
              {renderScene()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Step Progress Bar & Controls with Lock State & Shake Animation */}
        <StepProgressBar
          currentStep={currentStep}
          unlockedStep={unlockedStep}
          totalSteps={TOTAL_STEPS}
          onStepChange={goToStep}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </div>
    </SoundProvider>
  )
}
