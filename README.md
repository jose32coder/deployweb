# Deploy Project | Plataforma Web Cinemática

Este es un proyecto interno de alto rendimiento diseñado para ofrecer una experiencia de usuario sofisticada, utilizando animaciones fluidas y componentes 3D interactivos.

## 🚀 Stack Tecnológico

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Animaciones:** [GSAP](https://greensock.com/gsap/) con `@gsap/react`
- **Gráficos 3D:** [Three.js](https://threejs.org/) vía `@react-three/fiber` y `@react-three/drei`
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Tipografía:** Plus Jakarta Sans

## ✨ Características Principales

- **Hero Experience:** Una interfaz inmersiva con un globo de partículas interactivo y un cohete 3D orbitando en tiempo real.
- **Interacción Líquida:** Sistema de partículas con física de atracción/repulsión y efecto de ondas (ripple) al interactuar.
- **Cinematic Motion:** Animaciones secuenciadas con GSAP para entradas suaves y transiciones profesionales.
- **Diseño Glassmorphism:** Uso intensivo de desenfoques, bordes sutiles y gradientes de luz ambiental.
- **Optimización Mobile:** Totalmente responsive, permitiendo el scroll vertical incluso sobre áreas interactivas 3D.

## 🛠️ Estructura del Proyecto

```text
src/
├── app/            # Rutas y configuración de Next.js
├── components/     # Componentes de UI (Hero, Navbar, Globe, etc.)
├── lib/            # Configuraciones globales (GSAP, utilidades)
└── styles/         # Estilos globales y efectos CSS
```

## 💻 Desarrollo

Para levantar el proyecto localmente:

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Construir para producción:
   ```bash
   npm run build
   ```

## 📄 Documentación Técnica

Para detalles específicos sobre la arquitectura, parámetros de ajuste del globo y guías de estilo, consultar el archivo [`AGENTS.md`](./AGENTS.md), que actúa como la base de conocimiento técnica del proyecto.

---
*Propiedad interna del equipo de desarrollo.*

