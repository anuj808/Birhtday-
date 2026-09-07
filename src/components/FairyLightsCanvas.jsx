import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Shared 3D Fairy Lights Particle System with prefers-reduced-motion support
export function FairyLights({ count = 110 }) {
  const pointsRef = useRef()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Generate glowing circle sprite texture in memory
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 235, 185, 0.9)')
    gradient.addColorStop(0.5, 'rgba(255, 182, 185, 0.45)')
    gradient.addColorStop(1, 'rgba(255, 246, 234, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  // Particle positions, colors, speeds, and sway phases
  const { positions, colors, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const phs = new Float32Array(count)

    const palette = [
      new THREE.Color('#FFF6EA'), // cream
      new THREE.Color('#FFD97D'), // gold
      new THREE.Color('#FFB6B9'), // blush
      new THREE.Color('#FFD9B3'), // peach
      new THREE.Color('#F4A261'), // amber
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12 // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10 // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 // z

      const color = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b

      spd[i] = 0.3 + Math.random() * 0.45
      phs[i] = Math.random() * Math.PI * 2
    }

    return { positions: pos, colors: col, speeds: spd, phases: phs }
  }, [count])

  // Animation loop with upward drift, gentle sway, and mouse parallax
  useFrame((state, delta) => {
    if (!pointsRef.current || reducedMotion) return
    const posArray = pointsRef.current.geometry.attributes.position.array
    const time = state.clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      // Upward drift
      posArray[idx + 1] += speeds[i] * delta
      // Gentle side sway
      posArray[idx] += Math.sin(time * 0.8 + phases[i]) * 0.004

      // Wrap around top/bottom
      if (posArray[idx + 1] > 5.5) {
        posArray[idx + 1] = -5.5
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Camera parallax based on pointer position (lerp)
    const targetX = state.pointer.x * 0.75
    const targetY = state.pointer.y * 0.45
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        map={glowTexture}
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.85}
      />
    </points>
  )
}

export default function FairyLightsCanvas({ count = 110 }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <FairyLights count={count} />
      </Canvas>
    </div>
  )
}
