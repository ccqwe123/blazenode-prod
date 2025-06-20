import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import FOG from 'vanta/dist/vanta.fog.min'

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = FOG({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        highlightColor: 0x282828,
        midtoneColor: 0x0,
        lowlightColor: 0x0,
        baseColor: 0x938f8f,
        size: 1.5,
        speed: 1.5
      })

      setVantaEffect(effect)

      // Wait for canvas to be created and add Tailwind class
      setTimeout(() => {
        const canvas = vantaRef.current?.querySelector('canvas.vanta-canvas')
        if (canvas) {
          canvas.classList.add('rounded-t-xl')
        }
      }, 100)
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div
      ref={vantaRef}
      className="w-full h-[200px] absolute top-0 left-0 z-0"
    />
  )
}
