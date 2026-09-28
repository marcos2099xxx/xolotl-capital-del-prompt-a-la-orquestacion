# Prototipo Web Conservado (Abril de 2026)

## 1. Identificación y Estado de Conservación

- **Fecha del artefacto conservado:** 28 de abril de 2026, 17:50 (CDMX, UTC-6).
- **Entorno de ejecución:** Aplicación web cliente pura (*Single-Page Application* estática), ejecutable directamente en el navegador mediante `index.html` sin requerir servidor backend ni compiladores.
- **Tecnologías:** HTML5 semántico, Tailwind CSS (CDN), Chart.js (CDN), módulos JavaScript ES6 desacoplados en el navegador y almacenamiento persistente en `localStorage`.
- **Estructura completa disponible en [`codigo-completo/`](codigo-completo/):**
  ```text
  codigo-completo/
  ├── index.html                (Página principal y vistas de la app, 52 KB)
  ├── manifest.json             (Configuración PWA web manifest)
  ├── sw.js                     (Service Worker de caché offline)
  ├── data/
  │   └── assets.js             (Catálogo inicial de 15 activos BMV/SIC)
  └── js/
      ├── ai-socratic.js        (Sistema de intervención reflexiva y detección de sesgos)
      ├── animations.js         (Microinteracciones visuales)
      ├── app.js                (Inicialización, router y navegación de pestañas)
      ├── charts.js             (Renderizado de gráficas con Chart.js)
      ├── favorites.js          (Gestión de activos favoritos)
      ├── gamification.js       (Rachas, niveles, logros y XP)
      ├── history.js            (Bitácora de órdenes ejecutadas)
      ├── logger.js             (Exportador de telemetría de eventos a JSON)
      ├── market.js             (Simulación de precios y variación bursátil)
      ├── missions.js           (Retos diarios y misiones educativas)
      ├── notifications.js      (Notificaciones simuladas en interfaz)
      ├── onboarding.js         (Flujo de bienvenida e introducción)
      ├── portfolio.js          (Cálculo de saldo virtual, tenencias y valuación)
      ├── social.js             (Feed social simulado para provocar sesgo de rebaño)
      └── sounds.js             (Efectos de audio sintéticos con Web Audio API)
  ```

---

## 2. Instrucciones para Ejecución Local

Para auditar y explorar interactivamente la primera versión completa del simulador en cualquier computadora:

1. Navegar a la carpeta del prototipo:
   ```bash
   cd prototipo/codigo-completo
   ```
2. Iniciar un servidor web estático local:
   ```bash
   python3 -m http.server 8000
   ```
3. Abrir en cualquier navegador web moderno:
   ```text
   http://localhost:8000
   ```
*(Alternativamente, puede abrirse `index.html` directamente en el navegador haciendo doble clic, aunque algunas funciones del Service Worker `sw.js` requieren el protocolo HTTP local).*

---

## 3. Qué Permite Afirmar Esta Evidencia

1. **Existencia de un prototipo funcional previo:** Demuestra empíricamente que, antes de la adopción de Flutter y de una infraestructura distribuida en la nube, se construyó un prototipo web funcional y autocontenido para evaluar el diseño instruccional.
2. **Naturaleza técnica web:** Demuestra que la primera iteración se apoyó en tecnologías web abiertas, tal como se postuló en la Fase 1 del PRD pedagógico.
3. **Mapeo directo de los requerimientos pedagógicos:**
   - La mitigación del **sesgo de concentración** está programada en `ai-socratic.js` (`PROMPTS.concentration`).
   - La mitigación del **comportamiento de rebaño** está programada mediante la interacción con el feed simulado de `social.js` y advertencias en `ai-socratic.js` (`PROMPTS.herding`).
   - El **efecto disposición** está formalizado al detectar ventas precipitadas tras pérdidas (`PROMPTS.disposition`).
   - El compromiso con la **recolección de datos de investigación** está materializado en `logger.js`, permitiendo exportar la telemetría en JSON.
4. **Comprobación visual y estética:** La captura auténtica conservada en [`capturas/prototipo-web-abril-2026-mercado.png`](capturas/prototipo-web-abril-2026-mercado.png) coincide exactamente con el renderizado del código en [`codigo-completo/`](codigo-completo/).

---

## 4. Qué NO Permite Afirmar (Limitaciones Históricas)

1. **No es demostrable que sea la "Versión Cero":** El prototipo conservado corresponde al estado del 28 de abril de 2026 por la tarde. No se cuenta con commits Git individuales que registren el primer prompt textual enviado a Google Antigravity (Gemini 3.1 Pro) frente a las correcciones manuales o iteraciones subsecuentes.
2. **No demuestra efectos de aprendizaje:** La existencia del software demuestra su arquitectura y su lógica pedagógica declarada, pero no la efectividad real en los estudiantes (la cual corresponde a la fase de intervención empírica de la tesis).
3. **Desconexión con el backend actual:** Este prototipo no utilizaba PostgreSQL, Supabase, Vercel ni Firebase; toda su persistencia era local (`localStorage`).
