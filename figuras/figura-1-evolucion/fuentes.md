# Fuentes y Metodología: Figura 1 (Evolución de Xolotl Capital)

## 1. Qué Representa la Figura

La **Figura 1** representa la línea de tiempo evolutiva de Xolotl Capital a través de sus tres etapas clave de desarrollo:
1. **Etapa 1 (Abril de 2026): Origen académico y prototipado web.** Nacimiento del proyecto a partir del PRD pedagógico elaborado en la MTAC (UJAT), primer desarrollo exploratorio con Google Antigravity (Gemini 3.1 Pro) y materialización de la SPA web modular en HTML y JavaScript.
2. **Etapa 2 (Mayo – Julio de 2026): Transición a Flutter y expansión multiplataforma.** Migración de la arquitectura cliente hacia Flutter para soporte móvil y de escritorio nativo, construcción de la API Node.js/Express, persistencia en Supabase (PostgreSQL), resolución del incidente de cron inactivo en Vercel y migración de tareas periódicas hacia GitHub Actions y Cloudflare.
3. **Etapa 3 (Agosto – Septiembre de 2026): Orquestación agéntica y consolidación reflexiva.** Adopción de múltiples agentes coordinados (Codex, OpenCode, Antigravity 2.0), asignación estratégica de modelos por capacidad (razonamiento vs ejecución rápida), suites exhaustivas de pruebas (>1,500 tests), escaneo de seguridad y formalización del contrato operativo persistente en `AGENTS.md`.

---

## 2. Distinción Epistemológica de Fuentes

| Etapa / Elemento | Tipo de Evidencia | Fuente Primaria de Respaldo |
|---|---|---|
| **Etapa 1: PRD pedagógico** | Evidencia documental verificable | Archivo `pdr-version-publica.pdf` (origen: `GUIA PDR Marcos.pdf`, 28-abr-2026). |
| **Etapa 1: Prototipo web** | Evidencia documental verificable | Directorio conservado `Xolotl Capital Marcos Html/` (28-abr-2026, 17:50 CDMX). |
| **Etapa 2: Inicialización Flutter** | Evidencia documental verificable | Commit raíz `b18b1fdeba3d` (30 de mayo de 2026). |
| **Etapa 2: Incidente y fix de crons** | Evidencia documental verificable | Commits `8936ce8b82fa` (11-jun-2026) y `afcf37862207` (16-jun-2026). |
| **Etapa 3: Modelos y consumo** | Evidencia documental verificable | Capturas de cuota `capcap-260914-*.png` (GLM-5.3 / GLM-5.3-Flash en OpenCode). |
| **Etapa 3: Contrato operativo** | Evidencia documental verificable | Archivo `AGENTS.md` (361 líneas) y `docs/system/AI_WORKFLOW.md`. |
| **Periodizaciones y nombres de etapas** | Interpretación y síntesis de los autores | Categorización conceptual formulada para estructurar la narrativa del short paper. |

---

## 3. Capturas de Pantalla Vinculadas

- **Prototipo web conservado (Etapa 1):** Captura auténtica [`prototipo/capturas/prototipo-web-abril-2026-mercado.png`](../../prototipo/capturas/prototipo-web-abril-2026-mercado.png) tomada directamente de la ejecución local del prototipo original de abril de 2026 (modo oscuro, grid de activos BMV, saldo simulado $10,000 MXN y sparklines).
- **Aplicación actual en producción (Etapa 3):** Serie de capturas auténticas en [`evidencias/capturas-simulador-actual/`](../../evidencias/capturas-simulador-actual/) tomadas directamente del entorno productivo (`https://xolotl-capital.com`):
  - `01-dashboard-inicio-movil.jpeg`: Dashboard patrimonial y evaluación previa del razonamiento.
  - `02-mercados-cotizaciones-movil.jpeg`: Cotizaciones en tiempo real BMV/SIC e integración del tutor IA.
  - `03-detalle-activo-bimboa-movil.jpeg`: Ficha avanzada con gráficos interactivos y orden de compra.
  - `04-dashboard-escritorio-responsive.png`: Renderizado adaptativo en Flutter Web para escritorio.
