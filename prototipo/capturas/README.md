# Capturas Auténticas del Prototipo Web Conservado

Este directorio almacena las capturas de pantalla tomadas de forma directa y auténtica a partir de la ejecución de la versión conservada del prototipo web (28 de abril de 2026).

---

## 1. Inventario de Capturas

| Archivo | Descripción | Dimensiones | Tema / Entorno | Fecha de Captura |
| :--- | :--- | :--- | :--- | :--- |
| [`prototipo-web-abril-2026-mercado.png`](prototipo-web-abril-2026-mercado.png) | Vista principal del mercado bursátil simulado, resumen de capital ($10,000 MXN), grid de activos con sparklines de barras, menú lateral y badge de "Novato". | 3016 × 1708 px | Modo Oscuro (Nativo de la versión web) | 28 de septiembre de 2026 |

---

## 2. Elementos Clave Visibles y Evidencia Documental

La captura auténtica [`prototipo-web-abril-2026-mercado.png`](prototipo-web-abril-2026-mercado.png) demuestra empíricamente:

1. **Naturaleza Web Monolítica:** Interfaz de Single Page Application (SPA) renderizada con Tailwind CSS y Chart.js en navegador.
2. **Catálogo de Activos Simulados:** Coincidencia exacta de los tickers (AMXB $17.84, WALMEX $56.62, GFNORTE $128.50, CEMEXCPO, FEMSAUBD, GMEXICOB, TLEVISACPO, BIMBOA, PINFRA, LABB, NAFTRAC, IVVPESO, EMMXX, GLD, FUNO 11) con el archivo [`data/assets.js`](../codigo-completo/data/assets.js).
3. **Mecánica de Gamificación Inicial:** Presencia de racha de 3 días, 35 estrellas de experiencia y rango inicial "Novato", implementados en cliente mediante [`js/gamification.js`](../codigo-completo/js/gamification.js).
4. **Ausencia de Dependencias Serverless / Backend:** Toda la visualización opera sobre datos en memoria y almacenamiento local (`localStorage`), confirmando la arquitectura de fase temprana antes de la migración a Flutter y Vercel.
