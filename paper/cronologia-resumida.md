# Cronología Resumida del Proyecto Xolotl Capital

Esta cronología consolida los hitos fundamentales del proyecto utilizando exclusivamente fechas verificables mediante metadatos de archivos o commits firmados de Git. Los periodos de transición sin huella digital directa se declaran expresamente como no documentados o reconstrucciones retrospectivas.

---

## Línea Temporal de Eventos Verificables

```
[ 28-Abr-2026 ]  PRD académico (12:34) y Prototipo Web inicial (17:50)
       │
[ Mayo-2026   ]  Exploración de alternativas multiplataforma (fecha exacta no documentada)
       │
[ 30-May-2026 ]  Commit inicial del repositorio Flutter (b18b1fde)
       │
[ 11-Jun-2026 ]  Incidente de cron inactivo en Vercel (8936ce8b) y fix on-demand
       │
[ 16-Jun-2026 ]  Migración de tareas periódicas a GitHub Actions (afcf3786)
       │
[ Noche Jun/Jul]  Comprobación manual nocturna (reconstrucción retrospectiva del autor)
       │
[ 03-Ago-2026 ]  Presupuesto preventivo de 25s en executePendingOrders (8a8837e4)
       │
[ Sep-2026    ]  Estabilización de orquestación agéntica y auditoría de evidencias
```

---

## Detalle Hito por Hito

### 1. Origen Académico y Prototipado Web
- **28 de abril de 2026 (12:34:30 CDMX):** Finalización del documento `GUIA PDR Marcos.pdf` en el marco de la Maestría en Tecnologías para el Aprendizaje y el Conocimiento (UJAT).
  - *Fuente:* Metadatos del sistema de archivos y encabezado del documento (*Evidencia documental verificable*).
- **28 de abril de 2026 (17:50:24 CDMX):** Última modificación registrada de los archivos del prototipo web conservado (`index.html`, `js/app.js`, `js/ai-socratic.js`, `data/assets.js`).
  - *Fuente:* Timestamps del sistema de archivos (*Evidencia documental verificable*).

### 2. Transición hacia Aplicación Multiplataforma
- **Mayo de 2026 (*fecha exacta no documentada*):** Periodo de evaluación técnica sobre la limitación de la SPA web frente a la necesidad de soporte móvil y offline. Decisión de adoptar Flutter para unificación multiplataforma.
  - *Fuente:* Relato declarado del desarrollador (*Reconstrucción retrospectiva del autor*).
- **30 de mayo de 2026 (18:00:00 CDMX aprox.):** Creación del repositorio Git de Xolotl Capital y commit raíz `b18b1fdeba3d` (*Initial commit*), estableciendo la arquitectura Flutter con Riverpod.
  - *Fuente:* Registro de commit Git (*Evidencia documental verificable*).

### 3. Fricción Técnica y Evolución del Subsistema de Órdenes
- **11 de junio de 2026 (01:41:27 CDMX):** Commit `8936ce8b82fa`. Se identifica que los temporizadores internos de Node.js no se ejecutan en Vercel Serverless; se implementa la ejecución on-demand en consultas de portafolio y endpoint de cancelación.
  - *Fuente:* Registro de commit Git (*Evidencia documental verificable*).
- **11 de junio de 2026 (14:29:40 CDMX):** Commit `4c0e04038ec4`. Creación del endpoint protegido `/api/cron/execute-pending` con autenticación por `CRON_SECRET`.
  - *Fuente:* Registro de commit Git (*Evidencia documental verificable*).
- **16 de junio de 2026 (22:30:38 CDMX):** Commit `afcf37862207`. Migración de la activación de crons desde Vercel hacia workflows externos en GitHub Actions para superar la cuota diaria del plan Hobby.
  - *Fuente:* Registro de commit Git (*Evidencia documental verificable*).
- **Fecha exacta no documentada (junio/julio de 2026):** Comprobación manual realizada por el autor colocando una orden de compra virtual fuera de horario bursátil para observar su drenado al día siguiente.
  - *Fuente:* Memoria declarada del autor (*Reconstrucción retrospectiva del autor*).

### 4. Endurecimiento y Maduración Agéntica
- **3 de agosto de 2026 (15:14:03 CDMX):** Commit `8a8837e4eaff` en rama `feature/c1-cron-budget` (integrada en master en PR #7). Incorporación del límite preventivo de 25 segundos (`HARD_DEADLINE_MS = 25000`) para garantizar terminación limpia antes del timeout de la plataforma.
  - *Fuente:* Registro de commit Git (*Evidencia documental verificable*).
- **Agosto – Septiembre de 2026:** Formalización de la biblioteca de prompts (`docs/prompts/`), consolidación de `AGENTS.md` (361 líneas), estandarización de pruebas automáticas (1,544 tests en Flutter y 172 suites en backend) y asignación especializada de modelos por roles.
  - *Fuente:* Documentación operativa `docs/system/AI_WORKFLOW.md` y `AGENTS.md` (*Evidencia documental verificable*).
