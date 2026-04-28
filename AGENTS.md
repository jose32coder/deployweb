# Instrucciones para el Desarrollador AI (Deploy Project)

Este proyecto es una plataforma web de alto rendimiento construida con Next.js, GSAP y Tailwind CSS, está orientada a ser una landing o full page estilo portafolio o empresa sofisticada

## Stack Tecnológico

- **Framework:** Next.js (App Router)
- **Animaciones:** GSAP (GreenSock Animation Platform)
- **Estilos:** Tailwind CSS (Dark Mode por defecto)

## Reglas de Animación (GSAP)

1. **React Hook:** Usa SIEMPRE el hook `@gsap/react` (`useGSAP`) para manejar el ciclo de vida de las animaciones.
2. **Registro:** Registra los plugins (ScrollTrigger, Flip, etc.) una sola vez a nivel de componente o en un layout global.
3. **Limpieza:** Asegúrate de que las animaciones se limpien correctamente al desmontar componentes para evitar memory leaks.
4. **Estética:** Sigue un estilo cinemático. Usa eases suaves como `power2.inOut` o `expo.out`.

## Estética Visual (Deploy)

- Inspiración: Antimatter AI / Prisma.
- Colores: Negro profundo (#09090b), acentos de brillo (glow) y fuentes sans-serif modernas con tracking ancho.

---

## Memoria Consolidada Del Proyecto

Esta sección concentra la información que estaba distribuida en:
`README.md`, `QUICKSTART.md`, `ARCHITECTURE.md`, `CLAUDE.md`, `IMPLEMENTATION_SUMMARY.md` y `VISUAL_ENHANCEMENTS.md`.

### Estado General

- Arquitectura base lista para producción con Next.js App Router + GSAP + Tailwind.
- Build validado sin errores (`npm run build` OK en las iteraciones recientes).
- Landing enfocada en estética cinemática (hero principal, partículas y glow).

### Estructura Base

- `src/app/layout.js`: layout raíz.
- `src/app/layout-client.jsx`: capa cliente para inicialización global.
- `src/app/page.js`: home.
- `src/components/*`: piezas UI reutilizables.
- `src/lib/gsap.js`: configuración global GSAP.
- `src/styles/effects.css`: efectos visuales reutilizables.

### Guía Técnica (Consolidada)

- Usar `useGSAP` para toda animación en React.
- Registrar plugins GSAP una sola vez.
- Hacer cleanup de listeners/animaciones al desmontar.
- Mantener componentes modulares y layout reusable.
- Priorizar rendimiento visual (evitar jank, animaciones suaves, transforms).

### Sistema Visual (Consolidado)

- Paleta principal: negros profundos + acentos azul/cyan.
- Utilidades de glow/glass disponibles en `effects.css`.
- Diseño de hero inspirado en Antimatter AI (tipografía amplia, luz diagonal, foco visual central).

### Mejoras Visuales Ya Implementadas

- Fondo con grid/glow ambiental.
- Hero con rayo diagonal superior izquierdo.
- Esfera de partículas migrada a Three.js (`@react-three/fiber`).
- Interacción por mouse/touch en todo el canvas.
- Cohete 3D orbitando con estela y deformación dinámica de partículas.
- Ajustes responsive desktop/tablet/mobile en hero/navbar.

### Parámetros Clave De Ajuste Manual

En `src/components/ParticleGlobe.jsx`:

- `SPHERE_RADIUS`: tamaño global de esfera.
- `PARTICLE_COUNT`: densidad.
- `PARTICLE_SIZE`: tamaño de punto.
- `ORBIT_SCALE`: distancia del recorrido del cohete respecto a la esfera.
- `ROCKET_SPEED_SECONDS`: velocidad de órbita.
- `ROCKET_PATH_POINTS`: complejidad de curva.
- `ROCKET_SCALE`: escala del cohete.

### Convención De Control Y Memoria

Para mantener “memoria viva” del proyecto, cada cambio relevante debería registrarse en este archivo bajo la bitácora.

## Bitácora De Cambios

### 2026-04-24

- Se centralizó la documentación operativa en `AGENTS.md`.
- Se consolidaron lineamientos técnicos/visuales previos en este documento.
- Se estableció esta bitácora como fuente única para seguimiento de decisiones.

### 2026-04-28

- Se rediseñó el preloader con una secuencia espacial cinematográfica (starfield + esfera energética + cohete 3D en profundidad).
- Se implementó bloqueo total de scroll/interacciones mientras el preloader está activo.
- Se añadió transición del texto `DEPLOY` hacia la posición real del logo en navbar para continuidad visual.
- Se sincronizó el inicio de animaciones de `HeroSection` y `Navbar` al evento `deploy:preloader-complete` para evitar que se consuman detrás del overlay.
