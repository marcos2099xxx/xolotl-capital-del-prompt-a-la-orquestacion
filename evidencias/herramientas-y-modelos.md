# Inventario de Herramientas, Agentes y Modelos de Lenguaje

Este documento sistematiza las herramientas de desarrollo, entornos agénticos, modelos fundacionales y protocolos de integración empleados a lo largo de las distintas etapas de construcción de Xolotl Capital.

## 1. Principio de Certeza Probatoria

Cada entrada se clasifica rigurosamente según el nivel de evidencia disponible:
- **Documentado:** Respaldado por trazas directas, registros de consumo de tokens, commits fechados, archivos de configuración activos o capturas auténticas de paneles de cuota.
- **Parcialmente documentado:** Respaldado por configuración de entorno o menciones consistentes en la documentación del repositorio, pero sin registro cuantitativo directo de llamadas.
- **Reconstrucción retrospectiva:** Declarado por el autor con base en su memoria metodológica de fases tempranas donde no se conservaron registros automáticos de telemetría.

---

## 2. Matriz de Herramientas y Modelos

| Herramienta / Entorno | Modelo de Lenguaje | Uso o Función Principal | Periodo Aproximado | Fuente de Evidencia | Nivel de Certeza | Observaciones |
|---|---|---|---|---|---|---|
| **Google Antigravity 1.0 (IDE)** | Gemini 3.1 Pro | Generación del plan inicial del prototipo web a partir del PRD y primera iteración de código HTML/JS. | Abril de 2026 | Testimonio del autor triangulado con el prototipo web conservado de 28-abr-2026. | **Reconstrucción retrospectiva** | No se conservaron los logs de sesión de las primeras llamadas en Antigravity 1.0; la evidencia física es el artefacto resultante. |
| **Google Antigravity 2.0 (IDE)** | Gemini 3.8-Flash | Modo de planificación asistida, tareas de complejidad media, mantenimiento de rutas y refactorizaciones de componentes. | Julio – Septiembre de 2026 | Base de datos SQLite local de resúmenes de conversación (`~/.gemini/antigravity/conversation_summaries.db`). | **Documentado** | Registros activos de sesiones, planes de implementación generados y trazas de herramientas locales. |
| **OpenCode** | GLM-5.3 | Planificación arquitectónica de alta capacidad en modo de razonamiento profundo; análisis de dependencias complejas. | Agosto – Septiembre de 2026 | Capturas de pantalla auténticas del panel de cuotas AIUsage (`capcap-260914-172341.png`) y Z.ai Coding Plan. | **Documentado** | Registro de consumo de tokens: 10.45M tokens consumidos en GLM-5.3 para razonamiento y planificación. |
| **OpenCode** | GLM-5.3-Flash | Implementación delegada rápida de componentes, resolución de incidencias de linter y generación de tests unitarios. | Agosto – Septiembre de 2026 | Panel de cuotas AIUsage (`capcap-260914-172341.png`, dispositivo `opencode 5`). | **Documentado** | Registro de consumo: 38.68M tokens en tareas de ejecución y edición de código. |
| **Codex** | GPT-5.6 | Planificación estratégica y diseño de refactorizaciones de gran escala en modo de razonamiento extendido. | Julio – Agosto de 2026 | Ramas Git `codex/*` en el repositorio (`codex/node24-supabase`, `codex/dependencias-compatibles`), citas en `docs/system/AI_WORKFLOW.md`. | **Parcialmente documentado** | Evidencia indirecta en ramas y convenciones de commits; no se conservan logs JSON de telemetría de OpenAI. |
| **OpenCode / Hermes** | DeepSeek V4.1-Flash | Ejecución delegada de código y transformaciones repetitivas de bajo costo. | Agosto – Septiembre de 2026 | Menciones en la documentación operativa de flujos (`docs/system/AI_WORKFLOW.md`) y perfiles de agente. | **Parcialmente documentado** | Modelo alternativo de ejecución rápida empleado para tareas mecánicas. |
| **Context7 (MCP Server)** | N/A (Herramienta MCP) | Consulta de documentación oficial actualizada de librerías y frameworks (Riverpod, GoRouter, Express 5, Tailwind). | Junio – Septiembre de 2026 | Regla global obligatoria en `AGENTS.md` y configuración en `mcp_config.json`. | **Documentado** | Previene que el agente use APIs obsoletas al forzar la recuperación de documentación viva antes de programar. |
| **codebase-memory (MCP Server)** | N/A (Herramienta MCP) | Exploración contextual mediante grafo de conocimiento del repositorio (búsqueda de funciones, rastreo de rutas y llamadas). | Julio – Septiembre de 2026 | Regla obligatoria en `AGENTS.md` (proyecto `Users-marcos2099x-...`), base de datos SQLite del grafo local. | **Documentado** | Reduce el consumo de tokens y evita barridos ciegos con `grep` en repositorios grandes. |
| **Playwright + Edge (`~/xolotl-qa`)** | N/A (Herramienta de QA) | Pruebas funcionales de extremo a extremo en navegador con sesión persistente y viewport 393×1800 para capturar pantallas completas. | Septiembre de 2026 | Suite de scripts en `~/xolotl-qa/`, documentación en `docs/system/BROWSER_DEBUGGING.md`, regla en `AGENTS.md`. | **Documentado** | Sustituyó el uso invasivo de pantallas reales por un puente de archivos (`cmd.txt`/`out.txt`) para QA automatizado. |
| **CLIs Oficiales (`gh`, `supabase`, `vercel`, `wrangler`)** | N/A (Herramientas de Infraestructura) | Operación de servicios reales: estado de CI (`gh`), migraciones remotas (`supabase db push --linked`), logs de backend (`vercel`) y Worker (`wrangler`). | Junio – Septiembre de 2026 | Sección 9 de `AGENTS.md`, workflows de GitHub Actions y scripts de despliegue. | **Documentado** | Demuestra que los agentes operan terminales reales bajo supervisión humana estricta y sin permisos destructivos. |

---

## 3. Consideraciones de Seguridad y Privacidad

- **Ausencia de credenciales:** No se publican tokens de autenticación, llaves de API, identificadores de cuenta ni variables de entorno.
- **Rigor sobre carpetas locales:** La existencia en disco de carpetas como `.cursor`, `.claude`, `.kiro` o `.kilo` no se incluye como evidencia de uso regular salvo que existan trazas de commits, reglas en `AGENTS.md` o documentación operativa que respalde su intervención real en el flujo de trabajo.
