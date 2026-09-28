# Caso Longitudinal: Subsistema de Órdenes Bursátiles Programadas

Este documento analiza la evolución y maduración técnica del subsistema de **órdenes bursátiles programadas** en Xolotl Capital. Ilustra cómo una misma pieza crítica de software atravesó distintos momentos de problematización, intervención y verificación a lo largo de su ciclo de vida.

Para garantizar la máxima integridad académica, este caso longitudinal distingue taxativamente tres momentos y sus correspondientes niveles de evidencia probatoria:

---

## Momento 1 (Junio de 2026): Incidente Operativo por Entorno Serverless

- **Tipo de evidencia:** **Evidencia documental verificable.**
- **Commits asociados:**
  - `8936ce8b82fa` (11 de junio de 2026, 01:41 CDMX): *Fix: Ordenes pendientes se ejecutan y sistema completo de cancelacion*.
  - `4c0e04038ec4` (11 de junio de 2026, 14:29 CDMX): *Fix: Cron Vercel para ejecutar ordenes pendientes + logos en ordenes*.
  - `afcf37862207` (16 de junio de 2026, 22:30 CDMX): *feat(cron): migra cron jobs de Vercel a GitHub Actions*.

### El problema documentado
En el simulador, cuando un usuario introduce una orden fuera del horario bursátil de la Bolsa Mexicana de Valores (08:30 a 15:00 CDMX), la orden debe quedar en estado `pending` para ejecutarse automáticamente en la siguiente apertura del mercado. En el entorno local de desarrollo, un temporizador en memoria (`node-cron` dentro de un proceso Node continuo) ejecutaba las órdenes pendientes.

Sin embargo, al desplegar el backend en el entorno serverless de **Vercel**, las funciones son efímeras y no conservan procesos residentes en segundo plano. Como consecuencia:
1. Las tareas en segundo plano de Node.js no corrían de forma continua en producción.
2. Las órdenes programadas por los usuarios quedaban en estado pendiente indefinidamente, sin reflejarse en las tenencias del portafolio ni en el historial de transacciones.

### La solución implementada
La intervención agéntica abordó la incidencia en dos etapas:
1. **Mecanismo de mitigación inmediata (on-demand):** En el commit `8936ce8b`, se modificaron los controladores `getPortfolio` y `getPortfolioSummary` para invocar `executePendingOrders()` de forma oportunista bajo demanda cada vez que el usuario consulta su portafolio durante el horario de mercado abierto (`isTradingTime()`). Asimismo, se protegió el saldo virtual debitándolo al programar la orden y permitiendo su cancelación mediante `PATCH /api/orders/:id/cancel`.
2. **Orquestación externa desacoplada:** En los commits `4c0e0403` y `afcf3786`, se formalizó un endpoint de cron dedicado (`GET /api/cron/execute-pending`), protegido por un secreto criptográfico (`CRON_SECRET`), cuya invocación periódica fue transferida primeramente a GitHub Actions y posteriormente al Worker de Cloudflare (`xolotl-cron`), asegurando disparos regulares independientes de la navegación del usuario.

*(Detalle técnico completo y diff en [`junio-2026-cron-inactivo.md`](junio-2026-cron-inactivo.md)).*

---

## Momento 2 (Agosto de 2026): Endurecimiento Preventivo por Límite de Tiempo

- **Tipo de evidencia:** **Evidencia documental verificable.**
- **Commit asociado:**
  - `8a8837e4eaff` (3 de agosto de 2026, 15:14 CDMX): *feat(cron): cap de 25s en executePendingOrders para no agotar el maxDuration de Vercel*.

### El riesgo analizado
Semanas después de estabilizada la ejecución externa, el crecimiento en el volumen de usuarios y órdenes concurrentes motivó un análisis preventivo de escalabilidad. Se identificó que `executePendingOrders()` procesaba hasta 500 órdenes (5 iteraciones de 100 órdenes) en una sola corrida. Bajo condiciones de congestión de base de datos o latencia en el proveedor de cotizaciones bursátiles (Yahoo Finance), el tiempo de cómputo podía aproximarse al tiempo máximo de ejecución configurado para las funciones serverless de Vercel (30 segundos).

Si la función era cancelada abruptamente por la plataforma de hosting al alcanzar el segundo 30, aunque la atomicidad por orden (`SELECT ... FOR UPDATE` + `BEGIN/COMMIT`) evitaba la corrupción de datos, el corte forzado impedía serializar la respuesta HTTP y emitir los registros de advertencia.

> [!IMPORTANT]
> **Distinción metodológica:** Este riesgo de tiempo de ejecución **NO fue la causa raíz del incidente de junio de 2026**. El problema de junio se debió a la ausencia total de un proceso ejecutor activo en serverless, mientras que la mejora de agosto constituyó un **endurecimiento preventivo posterior** frente a cuellos de botella de latencia bajo carga.

### La solución implementada
Se implementó un presupuesto estricto de tiempo de 25 segundos (`HARD_DEADLINE_MS = 25000`):
- Se reserva un margen de seguridad de 5 segundos antes del límite de 30 segundos.
- Se introdujo la verificación booleana `withinBudget()` antes de iniciar cada lote y antes de procesar cada orden individual.
- Si el presupuesto se agota, la función corta de forma limpia, marca `cutoff: true` en el resumen para no duplicar alertas y delega las órdenes pendientes restantes al siguiente ciclo periódico del cron.

*(Detalle técnico completo y diff en [`agosto-2026-limite-tiempo.md`](agosto-2026-limite-tiempo.md)).*

---

## Momento 3: Comprobación Manual Nocturna

- **Tipo de evidencia:** **Reconstrucción retrospectiva del autor.**
- **Estado probatorio:** Relato experiencial declarado; **no vinculado a un commit específico.**

### Descripción de la experiencia
Como parte de la validación del subsistema en el entorno real, el autor programó manualmente una orden de compra virtual durante la noche (con el mercado mexicano cerrado) utilizando la interfaz móvil de la aplicación. Al día siguiente, una vez iniciada la sesión de negociación de la Bolsa Mexicana de Valores (a partir de las 08:30 CDMX), ingresó a la plataforma para observar si la orden había sido drenada y ejecutada satisfactoriamente, contrastando el saldo disponible, la asignación de títulos y el registro en el Diario de Inversión.

Esta comprobación humana en condiciones reales de uso forma parte del relato metodológico del estudio de caso y ejemplifica la Fase 5 (*Verificación reflexiva*), pero carece de un registro de commit asociado, por lo que se reporta estrictamente como memoria del desarrollador.

---

## 4. Síntesis Epistemológica del Caso

| Momento | Fenómeno Técnico | Naturaleza de la Intervención | Fuente Primaria | Nivel de Certeza |
|---|---|---|---|---|
| **Junio 2026** | Inactividad de cron interno en Vercel | Corrección reactiva de defecto arquitectónico (on-demand + cron externo) | Commit `8936ce8b` / `4c0e0403` | **Documentado** |
| **Agosto 2026** | Riesgo de timeout en ejecuciones masivas | Endurecimiento preventivo con presupuesto de tiempo (deadline 25s) | Commit `8a8837e4` | **Documentado** |
| **Prueba manual** | Verificación de orden colocada de noche | Validación empírica humana en dispositivo real | Testimonio del desarrollador | **Reconstrucción retrospectiva** |
