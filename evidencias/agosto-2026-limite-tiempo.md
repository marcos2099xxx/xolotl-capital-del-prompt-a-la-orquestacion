# Evidencia Documental: Endurecimiento Preventivo por Presupuesto de Tiempo (Agosto de 2026)

Este documento registra la evidencia técnica y el diff mínimo asociado al endurecimiento preventivo aplicado al subsistema de drenado de órdenes pendientes ante potenciales límites de tiempo en entornos serverless.

## 1. Ficha Técnica del Registro

- **Fecha y hora del commit:** Lunes 3 de agosto de 2026, 15:14:03 (CDMX, UTC-6)
- **Identificador del commit (SHA completo):** `8a8837e4eaff98d6e87b67a25f6506f0ef662da0`
- **Identificador corto:** `8a8837e4`
- **Rama original:** `feature/c1-cron-budget` (integrada en PR #7, commit `32b5ac02`)
- **Autor:** Marcos Alberto Arias Ramírez (`Marcos2099x <marcos2099x@gmail.com>`)
- **Mensaje original del commit:**
  ```text
  feat(cron): cap de 25s en executePendingOrders para no agotar el maxDuration de Vercel
  
  executePendingOrders podía procesar hasta 500 órdenes (5 iteraciones × 100
  batch) sin chequear el tiempo transcurrido. Bajo carga o con una corrida
  lenta (BD congestionada, Yahoo caído), esto puede agotar el maxDuration de
  30 s de Vercel y matar la función mid-batch. El lock por orden
  (SELECT ... FOR UPDATE) ya garantiza atomicidad, pero quedaban órdenes
  pending sin ejecutar hasta el próximo tick.
  
  Cambios:
  - Constante HARD_DEADLINE_MS = 25 s (5 s de margen bajo el maxDuration
    para que el handler alcance a serializar respuesta y logs).
  - Chequeo withinBudget() antes de cada batch y antes de cada orden
    individual; al cortar se loguea warning y se devuelve cutoff: true
    en el summary.
  - El summary ahora distingue skipped (mercado cerrado) de cutoff
    (timeout de tiempo), lo que evita que el warning de 'quedaron N pending'
    se duplique cuando el motivo real fue un cutoff.
  - Nuevo test orderLifecycle.budget.test.js (4 casos) cubriendo:
    cola vacía, cutoff mid-batch, mercado cerrado y cutoff antes de
    expirados.
  ```

---

## 2. Explicación Técnica y Contexto Histórico

> [!WARNING]
> **Aclaración sobre la configuración del entorno:** El límite de tiempo de 30 segundos (`maxDuration: 30`) correspondía a la **configuración histórica** asignada en el archivo `vercel.json` durante esa etapa del proyecto y no debe interpretarse como una restricción fija o universal de las especificaciones actuales de Vercel.

Semanas después de solucionar la inactividad de las tareas en junio, se realizó una auditoría de rendimiento sobre el volumen de órdenes. El procedimiento de drenado ejecutaba bucles de hasta 5 iteraciones de 100 órdenes cada una. Si la base de datos experimentaba contención o si la consulta de cotizaciones presentaba latencia, la ejecución podía prolongarse y aproximarse a los 30 segundos.

Si la plataforma de alojamiento abortaba la función forzadamente, se interrumpía la emisión de logs y la respuesta HTTP al despachador. Como medida de **endurecimiento preventivo posterior**, se programó un reloj interno que evalúa el tiempo transcurrido respecto a una constante de corte seguro fijada en 25 segundos (`HARD_DEADLINE_MS = 25_000`).

Al cumplirse este presupuesto, la función se detiene voluntariamente, devuelve un código de estado ordenado indicando `cutoff: true`, y delega las órdenes no procesadas para que sean retomadas en la siguiente ejecución periódica (disparada cada 10 minutos).

---

## 3. Fragmento Mínimo de Código (Diff Seleccionado)

El siguiente diff en `backend/src/services/orderExecution/orderLifecycle.js` ilustra la introducción del presupuesto temporal y la función guardiana:

```diff
--- a/backend/src/services/orderExecution/orderLifecycle.js
+++ b/backend/src/services/orderExecution/orderLifecycle.js
@@ -268,7 +268,19 @@ async function cancelPendingOrder(orderId, userId) {
   }
 }
 
+// Margen de seguridad de 5s antes del timeout duro configurado (30s)
+// Permite serializar respuesta y logs limpios sin corte forzado.
+const HARD_DEADLINE_MS = 25_000;
+
 async function executePendingOrders(now = new Date()) {
+  const startedAt = Date.now();
+  const withinBudget = () => Date.now() - startedAt < HARD_DEADLINE_MS;
+
+  // ... inspección de órdenes expiradas ...
+
+  for (let i = 0; i < MAX_ITERATIONS; i += 1) {
+    if (!withinBudget()) {
+      summary.cutoff = true;
+      logger.warn(`CRON [execute-pending] budget exhausted antes del batch ${i}, deferring al próximo tick`);
+      break;
+    }
+    const batch = await Order.findAll({ /* ... */ });
```

---

## 4. Clasificación Epistemológica

- **Categoría:** **Evidencia documental verificable.**
- **Certeza:** Máxima (commit respaldado en rama de Git con pruebas automatizadas asociadas en `orderLifecycle.budget.test.js`).
