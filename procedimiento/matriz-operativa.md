# Matriz Operativa de Colaboración Humano-Agente

Esta matriz desglosa las entradas, acciones computacionales del agente, intervenciones de supervisión humana y salidas verificables correspondientes a cada una de las seis fases del procedimiento de desarrollo agéntico reflexivo.

| Fase | Entrada (Trigger / Contexto) | Acción del Agente (IA) | Intervención Humana (Supervisión) | Salida Verificable (Artefacto / Estado) |
|---|---|---|---|---|
| **1. Problematización** | Reporte de error, warning en logs, fallo de CI, observación de UX o nuevo requerimiento de producto. | Extrae registros de error, analiza el estado actual del repositorio (`git status`), aísla el comportamiento anómalo sin modificar código. | Delimita el alcance de la tarea, evalúa la relevancia para el producto, formula el objetivo funcional y descarta hipótesis irrelevantes. | Caracterización formal del problema con evidencia y delimitación del alcance. |
| **2. Exploración contextual** | Pregunta de investigación técnica, interfaz o servicio involucrado. | Traza rutas de ejecución en el grafo de código (MCP), consulta documentación oficial reciente (Context7), inspecciona archivos de configuración (`vercel.json`, `supabase/migrations/`). | Confirma supuestos tácitos del negocio, valida restricciones de plataforma (ej. cuotas Vercel Hobby, compatibilidad Flutter web) y delimita fronteras de investigación. | Diagnóstico técnico de dependencias, causas raíz potenciales y restricciones aplicables. |
| **3. Planificación supervisada** | Diagnóstico técnico y requerimientos aceptados. | Genera un plan estructurado: archivos a modificar, diffs propuestos, análisis de riesgos de regresión y estrategia de verificación. | Examina el diseño técnico, sugiere alternativas más limpias o seguras, evalúa el impacto en arquitectura y **autoriza explícitamente** la ejecución. | Plan de implementación formal aprobado con criterios de aceptación. |
| **4. Implementación delegada** | Plan de implementación autorizado y reglas operativas de `AGENTS.md`. | Escribe o refactoriza código fuente, genera migraciones de base de datos con timestamp, crea casos de prueba unitarios, respeta límites de líneas (<1000). | Monitorea el progreso, atiende consultas de desambiguación emitidas por el agente y vigila que no se desvíe del alcance autorizado. | Conjunto acotado de cambios de código y pruebas asociadas en el working tree local. |
| **5. Verificación reflexiva** | Código modificado y pruebas implementadas. | Ejecuta suite automatizada (`flutter test`, `npm test`), linters (`dart analyze`), chequeos de presupuesto de tamaño y suites E2E/Playwright. | Inspecciona el `git diff` línea por línea, ejecuta la app en dispositivos físicos reales, evalúa la estética contra reglas anti-slop y valida el comportamiento final. | Reporte objetivo de pruebas pasadas, análisis estático en verde y aprobación humana final. |
| **6. Consolidación del conocimiento** | Resultados de verificación aprobados y lecciones aprendidas durante la resolución. | Actualiza la documentación canónica del dominio (`docs/`), registra incidencias resueltas en `KNOWN_ISSUES.md`, redacta extractos para el contrato operativo. | Autoriza la incorporación de nuevas reglas en `AGENTS.md`, valida la precisión de la documentación técnica y ordena el commit con mensaje formal en español. | Documentación de dominio sincronizada, `AGENTS.md` enriquecido y commit trazable en Git. |

---

## Notas de Trazabilidad Operativa

- **Contrato previo:** La acción del agente en las Fases 1 a 6 está acotada en todo momento por las reglas imperativas de `AGENTS.md` (no realizar cambios destructivos, no hacer commits no solicitados, no descartar cambios ajenos).
- **Asignación de roles por modelo:**
  - Las Fases 1, 2 y 3 (alto razonamiento y planeación arquitectónica) emplean modelos de frontera (ej. GPT-5.6 en Codex, GLM-5.3 en OpenCode o Gemini Pro).
  - La Fase 4 (implementación acotada) delega a modelos ágiles y económicos (ej. GLM-5.3-Flash o DeepSeek V4.1-Flash).
  - Tareas de complejidad media o mantenimiento utilizan Gemini 3.8-Flash en Antigravity 2.0.
