# Inventario de Herramientas, Agentes y Modelos de Lenguaje

Este documento sistematiza las herramientas de desarrollo, entornos agénticos, modelos fundacionales y protocolos de integración empleados a lo largo de las distintas etapas de construcción de **Xolotl Capital**.

---

## 1. Principio de Certeza Probatoria

Cada elemento se clasifica rigurosamente según el nivel de evidencia disponible en el repositorio:
- **Documentado:** Respaldado por trazas directas, commits fechados en Git, ramas dedicadas, archivos de configuración activos o registros de diagnósticos técnicos.
- **Parcialmente documentado:** Respaldado por configuración de entorno o menciones consistentes en la documentación del repositorio, pero sin registro cuantitativo directo de llamadas.
- **Reconstrucción retrospectiva:** Declarado por el autor con base en su memoria metodológica de fases tempranas donde no se conservaron registros automáticos de telemetría.

---

## 2. Triangulación Cronológica: Fechas de Lanzamiento vs. Uso en el Proyecto

Para evitar cualquier tipo de anacronismo temporal (atribuir a una fase un modelo que aún no había sido publicado), se cotejaron las fechas oficiales de lanzamiento público en la web frente a la primera traza comprobable en el historial del repositorio:

| Modelo de Lenguaje | Entorno Agéntico | Fecha de Lanzamiento Oficial (Web) | Primera Traza Verificable en el Repositorio | Periodo en el Proyecto | Consistencia Fáctica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gemini 3.1 Pro** | Antigravity 1.0 | 19 de febrero de 2026 *(Google DeepMind)* | 28 de abril de 2026 *(Artefacto web conservado)* | **Abril de 2026** | **Consistente:** Disponible en el mercado dos meses antes del prototipado. |
| **GPT-5.6** | Codex | 9 de julio de 2026 *(OpenAI - General Availability)* | 18 al 22 de julio de 2026 *(Ramas Git `codex/*`)* | **Julio de 2026** | **Consistente:** Ramas creadas 9 días después de su lanzamiento público. |
| **GLM-5.3** | OpenCode | 14 de agosto de 2026 *(Zhipu AI / Z.ai)* | Septiembre de 2026 *(Perfiles de desarrollo y Z.ai)* | **Septiembre de 2026** | **Consistente:** Adoptado tras su salida en agosto para razonamiento arquitectónico. |
| **GLM-5.3-Flash** | OpenCode | 26 de agosto de 2026 *(Zhipu AI / Z.ai)* | 9 de septiembre de 2026 *(Commit `e1102c10` en backend)* | **Septiembre de 2026** | **Consistente:** Salió a finales de agosto; integrado en el código en septiembre. |
| **DeepSeek-V4.1-Flash** | OpenCode (Router) | 10 de septiembre de 2026 *(DeepSeek)* | 9 al 10 de septiembre de 2026 *(Diagnósticos en `agentrouter`)* | **Septiembre de 2026** | **Consistente:** Lanzado en septiembre; adoptado para tareas de ejecución rápida. |
| **Gemini 3.8 Flash** | Antigravity 2.0 | 2 de septiembre de 2026 *(Google)* | Septiembre de 2026 *(Sesiones activas e historial SQLite)* | **Septiembre de 2026** | **Consistente:** Disponible a inicios de septiembre; adoptado en Antigravity 2.0. |

---

## 3. Matriz de Herramientas y Modelos

| Herramienta / Entorno | Modelo Asignado | Rol y Función Cualitativa | Periodo Comprobado | Fuente de Evidencia en el Repositorio | Nivel de Certeza |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Antigravity 1.0 (IDE)** | Gemini 3.1 Pro | Generación del plan inicial del prototipo web a partir del PRD pedagógico e iteración guiada de código HTML/JS. | Abril de 2026 | Testimonio del autor triangulado con el prototipo web conservado de 28-abr-2026. | **Reconstrucción retrospectiva** |
| **Codex** | GPT-5.6 | Planificación estratégica y diseño de refactorizaciones de dependencias mayores y configuración de Node 24. | Julio de 2026 | 5 ramas Git dedicadas `codex/*` (`codex/node24-supabase`, `codex/flutter-3.44`, `codex/dependencias-compatibles`). | **Documentado en ramas Git** |
| **OpenCode** | GLM-5.3 | Planificación arquitectónica de alta capacidad en modo de razonamiento profundo; análisis de dependencias complejas. | Septiembre de 2026 | Perfiles de desarrollo en OpenCode y asignación de modelos en plan Z.ai. | **Documentado** |
| **OpenCode** | GLM-5.3-Flash | Implementación delegada rápida de componentes modulares, corrección de linter y generación de tests unitarios. | Septiembre de 2026 | Commit `e1102c10` (09-sep-2026) y perfiles de ejecución en OpenCode. | **Documentado** |
| **OpenCode (Router)** | DeepSeek V4.1-Flash | Ejecución rápida de código y transformaciones repetitivas de bajo costo. | Septiembre de 2026 | Registros de diagnóstico técnico (`docs/diagnostics/agentrouter-2026-09-09.md` y `.jsonl`). | **Documentado en logs** |
| **Google Antigravity 2.0 (IDE)** | Gemini 3.8 Flash | Modo de planificación supervisada, tareas de complejidad media, mantenimiento de rutas y refactorizaciones. | Septiembre de 2026 | Base de datos SQLite local de resúmenes de conversación (`~/.gemini/antigravity/conversation_summaries.db`). | **Documentado** |
| **Context7 (MCP Server)** | N/A (Herramienta MCP) | Consulta de documentación oficial viva de librerías y frameworks (Riverpod, GoRouter, Express 5, Tailwind) antes de programar. | Junio – Septiembre de 2026 | Regla global obligatoria en `AGENTS.md` y configuración local en `mcp_config.json`. | **Documentado** |
| **codebase-memory (MCP Server)** | N/A (Herramienta MCP) | Exploración contextual del código mediante grafo de conocimiento (búsqueda de funciones, rastreo de rutas y llamadas). | Julio – Septiembre de 2026 | Regla obligatoria en `AGENTS.md`, base de datos SQLite del grafo local. | **Documentado** |
| **Playwright + Edge (`~/xolotl-qa`)** | N/A (Herramienta de QA) | Pruebas funcionales de extremo a extremo en navegador con sesión persistente y viewport 393×1800 para capturar pantallas completas. | Septiembre de 2026 | Suite de scripts en `~/xolotl-qa/`, documentación en `docs/system/BROWSER_DEBUGGING.md`, regla en `AGENTS.md`. | **Documentado** |
| **CLIs Oficiales (`gh`, `supabase`, `vercel`, `wrangler`)** | N/A (Herramientas de Infraestructura) | Operación de servicios reales: estado de CI (`gh`), migraciones remotas (`supabase db push --linked`), logs de backend (`vercel`) y Worker (`wrangler`). | Junio – Septiembre de 2026 | Sección 9 de `AGENTS.md`, workflows de GitHub Actions y scripts de despliegue. | **Documentado** |

---

## 4. Asignación Estratégica de Roles según Capacidad

En lugar de delegar todo el trabajo a un único modelo o saturar el contexto con prompts monolíticos, el flujo de desarrollo se organizó bajo un principio de **especialización operativa**:

1. **Modelos de Razonamiento Profundo (Planificación):** `GPT-5.6` y `GLM-5.3` se reservan para analizar problemas complejos, diagnosticar causas raíz arquitectónicas y diseñar planes paso a paso antes de tocar código.
2. **Modelos Rápidos y Económicos (Implementación Delegada):** `GLM-5.3-Flash` y `DeepSeek V4.1-Flash` reciben tareas ya acotadas, generación de tests repetitivos y transformaciones sintácticas.
3. **Modelos de Entorno Integrado (Mantenimiento Continuo):** `Gemini 3.8 Flash` en Antigravity opera como el asistente de cabecera para tareas de complejidad media, consultas contextuales y orquestación con herramientas locales.
