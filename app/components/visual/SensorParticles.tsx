"use client"

import { useCallback } from "react"
import Particles from "react-tsparticles"
import type { Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"

export default function SensorParticles() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="sensor-particles"
      init={init}
      // Si no se ve, cambia a "z-0" y pon el contenido del hero con "relative z-10"
      className="absolute inset-0 -z-10"
      options={{
        fullScreen: { enable: false },
        fpsLimit: 60,
        background: { color: "transparent" },
        detectRetina: true,

        particles: {
          number: {
            value: 90,
            density: { enable: true }, // sin "area" para evitar choques de tipos
          },
          color: { value: ["#24E1B1", "#4FE5FF"] }, // jade ↔ turquesa
          shape: { type: "circle" },

          // Pulso sutil (bio-inteligencia)
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },

          // Opacidad orgánica con random CORRECTAMENTE tipeado
          opacity: {
            value: 0.55,
            random: { enable: true, minimumValue: 0.3 }, // 👈 aquí estaba el error
            animation: {
              enable: true,
              speed: 0.5,
              sync: false,
              // (no usamos minimumValue aquí para evitar choques entre versiones)
            },
          },

          // Malla clara para lectura visual
          links: {
            enable: true,
            color: "#4FE5FF",
            opacity: 0.28,
            width: 1,
            distance: 150,
          },

          // Movimiento orgánico/cohesivo
          move: {
            enable: true,
            speed: 0.45,
            direction: "none",
            outModes: { default: "out" },
            random: false,
            straight: false,
            decay: 0.015,
            attract: {
              enable: true,
              rotate: { x: 600, y: 1200 },
            },
          },
        },

        interactivity: {
          detectsOn: "window",
          events: {
            onHover: { enable: true, mode: ["grab", "bubble", "attract"] },
            onClick: { enable: true, mode: "repulse" },
            resize: true, // si tu versión se queja, cambia a: { enable: true }
          },
          modes: {
            grab: { distance: 200, links: { opacity: 0.5 } },
            bubble: {
              distance: 180,
              size: 4,
              duration: 0.25,
              opacity: 0.9,
            },
            attract: { distance: 160, duration: 0.2 },
            repulse: { distance: 180, duration: 0.4 },
          },
        },
      }}
    />
  )
}
