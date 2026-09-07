import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../context/SoundContext'

export default function AudioToggle() {
  const { isMuted, toggleMute } = useSound()

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      <button
        onClick={toggleMute}
        aria-label={!isMuted ? 'Mute sounds and music' : 'Enable sounds and music'}
        className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-cream/90 backdrop-blur-md border border-peach/70 shadow-cozy hover:shadow-cozy-lg hover:bg-peach/30 transition-all duration-300 text-cocoa"
      >
        <span className="relative flex h-2.5 w-2.5">
          {!isMuted && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${!isMuted ? 'bg-amber' : 'bg-blush'}`}></span>
        </span>
        {!isMuted ? (
          <Volume2 className="w-4 h-4 text-cocoa transition-transform group-hover:scale-110" />
        ) : (
          <VolumeX className="w-4 h-4 text-cocoa/60 transition-transform group-hover:scale-110" />
        )}
        <span className="text-xs font-semibold tracking-wider uppercase text-cocoa/80 select-none">
          {!isMuted ? 'Sound On' : 'Muted'}
        </span>
      </button>
    </div>
  )
}
