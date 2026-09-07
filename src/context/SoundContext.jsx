import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'

const SoundContext = createContext()

export function SoundProvider({ children }) {
  // Sound defaults to muted as requested
  const [isMuted, setIsMuted] = useState(true)
  const bgmRef = useRef(null)
  const audioCtxRef = useRef(null)

  useEffect(() => {
    // Royalty-free acoustic / lofi ambient background loop
    bgmRef.current = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3'],
      html5: true,
      loop: true,
      volume: 0.35,
    })

    return () => {
      if (bgmRef.current) {
        bgmRef.current.unload()
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close()
        } catch (e) {
          // ignore
        }
      }
    }
  }, [])

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev
      if (bgmRef.current) {
        if (!nextMuted) {
          bgmRef.current.play()
        } else {
          bgmRef.current.pause()
        }
      }
      return nextMuted
    })
  }

  // Synthesized realistic balloon pop sound (zero latency, works 100% offline)
  const playPop = () => {
    if (isMuted) return
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Generate pop waveform: white noise burst + low-frequency pitch drop (thump)
      const now = ctx.currentTime

      // 1. Noise burst (the "snap" of the latex tearing)
      const bufferSize = ctx.sampleRate * 0.05 // 50ms burst
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01))
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.setValueAtTime(1200, now)
      bandpass.Q.setValueAtTime(1.5, now)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.6, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      noise.connect(bandpass)
      bandpass.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(now)

      // 2. Low resonance "thump"
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.07)

      oscGain.gain.setValueAtTime(0.5, now)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.07)
    } catch (e) {
      console.warn('Pop sound error:', e)
    }
  }

  // Celebratory victory chime sound
  const playVictoryChime = () => {
    if (isMuted) return
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.12
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)

        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.6)
      })
    } catch (e) {
      console.warn('Victory chime error:', e)
    }
  }

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playPop,
        playVictoryChime,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}
