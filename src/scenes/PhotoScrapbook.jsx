import React, { useState, useRef, useEffect } from 'react'
import photo1 from '../assets/photo1.jpg'
import photo2 from '../assets/photo2.jpg'
import photo3 from '../assets/photo3.jpg'
import photo4 from '../assets/photo4.jpg'
import photo5 from '../assets/photo5.jpg'
import photo6 from '../assets/photo6.jpg'
import photo7 from '../assets/photo7.jpg'

import { motion } from 'framer-motion'
import { Camera, Sparkles, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

// Easily add, remove, or reorder any number of photos here!
export const MEMORY_SNAPS = [
  {
    image: photo1, // Add path like "/photos/summer.jpg" or an imported URL
    emoji: '✨',
    bg: 'from-[#FFF6EA] to-[#FFD9B3]',
    rotation: '-rotate-2',
  },
  {
    image: photo2,
    emoji: '💫',
    bg: 'from-[#FFD9B3] to-[#FFB6B9]',
    rotation: 'rotate-1',
  },
  {
    image: photo3,
    emoji: '💛',
    bg: 'from-[#FFB6B9] to-[#FFD97D]',
    rotation: '-rotate-1',
  },
  {
    image: photo4,
    emoji: '📸',
    bg: 'from-[#FFD97D] to-[#F4A261]',
    rotation: 'rotate-2',
  },
  {
    image: photo5,
    emoji: '🎂',
    bg: 'from-[#FFB6B9] to-[#FFF6EA]',
    rotation: '-rotate-2',
  },
  {
  image: photo6,
    emoji: '🎂',
    bg: 'from-[#FFB6B9] to-[#FFF6EA]',
    rotation: '-rotate-2',
  },
  {
  image: photo7,
    emoji: '🎂',
    bg: 'from-[#FFB6B9] to-[#FFF6EA]',
    rotation: '-rotate-2',
  },
]

export default function PhotoScrapbook({ snaps = MEMORY_SNAPS, onNext, onPrev }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef(null)
  const cardRefs = useRef([])

  // Live active index tracker based on carousel scroll position
  const handleScroll = () => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const center = container.scrollLeft + container.clientWidth / 2

    let closestIdx = 0
    let minDistance = Infinity

    cardRefs.current.forEach((cardEl, idx) => {
      if (!cardEl) return
      const cardCenter = cardEl.offsetLeft + cardEl.offsetWidth / 2
      const distance = Math.abs(center - cardCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestIdx = idx
      }
    })

    setActiveIndex(closestIdx)
  }

  // Smooth scroll to a specific card
  const scrollToCard = (index) => {
    if (index < 0 || index >= snaps.length) return
    const cardEl = cardRefs.current[index]
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
      setActiveIndex(index)
    }
  }

  const scrollNext = () => scrollToCard(activeIndex + 1)
  const scrollPrev = () => scrollToCard(activeIndex - 1)

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-3 sm:px-4 py-4 text-center max-w-xl mx-auto select-none">
      {/* Badge */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-peach/50 border border-peach text-cocoa text-xs font-semibold mb-4"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber" />
        <span>Scene 2 of 6 &bull; Photo Scrapbook</span>
      </motion.div>

      {/* Main Scrapbook Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="w-full bg-white/85 backdrop-blur-md sm:backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-peach/80 shadow-cozy flex flex-col items-center overflow-hidden"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blush to-peach flex items-center justify-center mb-3 shadow-md shadow-blush/30">
          <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-cocoa" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-fredoka text-cocoa mb-1.5 tracking-wide">
          Our Favorite Memories 📸
        </h2>

        <p className="text-xs sm:text-sm text-cocoa/80 mb-4 max-w-sm font-medium leading-relaxed">
          Snapshots of all the laughs, inside jokes, and special moments shared together.
        </p>

        {/* SWIPEABLE HORIZONTAL CAROUSEL */}
        <div className="relative w-full mb-3 flex items-center justify-center">
          {/* Left Arrow Button (Desktop visible, mobile subtle) */}
          <button
            onClick={scrollPrev}
            disabled={activeIndex === 0}
            aria-label="Previous photo"
            className="absolute left-1 sm:left-2 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-peach/80 text-cocoa shadow-cozy hover:bg-peach/30 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200 hidden sm:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel Scroll Track with CSS Scroll-Snap & Touch Pan */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="w-full flex items-center gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory py-3 px-[12%] sm:px-14 no-scrollbar touch-pan-x"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {snaps.map((snap, item) => (
              <motion.div
                key={item}
                ref={(el) => (cardRefs.current[item] = el)}
                whileHover={{ scale: 1.02 }}
                className={`snap-center shrink-0 w-[78%] sm:w-[250px] bg-white rounded-2xl p-3 pb-4 shadow-cozy border border-peach/60 flex flex-col items-center transition-all duration-300 ${
                  snap.rotation || ''
                } ${
                  activeIndex === item
                    ? 'scale-100 ring-2 ring-peach/50 shadow-cozy-lg'
                    : 'scale-95 opacity-80'
                }`}
                style={{
                  scrollSnapAlign: 'center',
                }}
              >
                {/* Polaroid Photo Frame */}
                <div className="w-full aspect-square rounded-xl relative overflow-hidden mb-2.5 border border-peach/30 shadow-inner bg-cream/50">
                  {snap.image ? (
                    /* Real Photo Display */
                    <img
                      src={snap.image}
                      alt={snap.caption || `Photo ${item + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  ) : (
                    /* Gradient + Emoji Fallback */
                    <div
                      className={`w-full h-full rounded-xl bg-gradient-to-tr ${
                        snap.bg || 'from-[#FFF6EA] to-[#FFD9B3]'
                      } flex flex-col items-center justify-center relative overflow-hidden`}
                    >
                      <span className="text-4xl sm:text-5xl mb-1 select-none">
                        {snap.emoji || '✨'}
                      </span>
                      <span className="text-[11px] font-bold text-cocoa/70 uppercase tracking-wider select-none">
                        Photo #{item + 1}
                      </span>
                      {/* Gloss diagonal reflection */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Polaroid Caption & Date */}
                <span className="font-fredoka text-xs sm:text-sm font-bold text-cocoa line-clamp-1">
                  {snap.caption}
                </span>
                <span className="text-[10px] text-cocoa/60 font-medium mt-0.5 line-clamp-1">
                  {snap.date}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow Button (Desktop visible, mobile subtle) */}
          <button
            onClick={scrollNext}
            disabled={activeIndex === snaps.length - 1}
            aria-label="Next photo"
            className="absolute right-1 sm:right-2 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-peach/80 text-cocoa shadow-cozy hover:bg-peach/30 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200 hidden sm:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {snaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              aria-label={`Jump to photo ${idx + 1}`}
              className="p-1 focus:outline-none"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? 'w-5 h-2 bg-gradient-to-r from-amber to-gold shadow-xs'
                    : 'w-2 h-2 bg-peach/70 hover:bg-amber/50'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Action Buttons (Untouched, exactly as before) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-peach/40 hover:bg-peach/70 text-cocoa font-semibold text-xs sm:text-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={onNext}
            className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-amber via-gold to-peach text-cocoa font-bold text-xs sm:text-sm shadow-cozy hover:shadow-glow-gold hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            <span>Hot Wheels? 🚗</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
