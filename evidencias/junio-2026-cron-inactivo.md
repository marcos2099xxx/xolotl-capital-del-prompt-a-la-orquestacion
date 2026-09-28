# Evidencia Documental: Incidente de Tareas Automáticas Inactivas (Junio de 2026)

Este documento contiene la evidencia técnica y el diff mínimo asociado a la primera intervención sobre el subsistema de órdenes pendientes en el entorno de producción.

## 1. Ficha Técnica del Registro

- **Fecha y hora del commit:** Jueves 11 de junio de 2026, 01:41:27 (CDMX, UTC-6)
- **Identificador del commit (SHA completo):** `8936ce8b82fafbe9025a6c82b11c410b972cdfcf`
- **Identificador corto:** `8936ce8b`
- **Autor:** Marcos Alberto Arias Ramírez (`Marcos2099x <marcos2099x@gmail.com>`)
- **Mensaje original del commit:**
  ```text
  Fix: Ordenes pendientes se ejecutan y sistema completo de cancelacion
  
  Problema raiz: En Vercel los cron jobs no corren, por lo que las ordenes
  pendientes (mercado cerrado) nunca se ejecutaban. El usuario veia 'Orden
  programada' pero nunca se reflejaba en portafolio ni historial.
  
  Cambios backend:
  - Al crear orden pendiente de compra, se descuenta el saldo inmediatamente
  - executePendingOrder() ya no deduce saldo nuevamente (evita doble descuento)
  - Nuevo endpoint PATCH /api/orders/:id/cancel para cancelar ordenes pendientes
  - cancelPendingOrder() reembolsa el saldo al cancelar una compra pendiente
  - getPortfolio/getPortfolioSummary ejecutan ordenes pendientes on-demand
    cuando el mercado BMV esta abierto (ya no dependen del cron job)
  
  Cambios Flutter:
  - Nueva pantalla 'Ordenes Programadas' con lista y boton de cancelar
  - Banner en portafolio muestra conteo de ordenes pendientes y saldo reservado
  - Seccion de disponibilidad muestra saldo total menos lo reservado
  - Logica de canSubmit descuenta ordenes pendientes del saldo disponible
  - Mensaje de confirmacion indica que el saldo se descuenta al programar
  ```

---

## 2. Explicación Técnica en Lenguaje Natural

Al desplegar una aplicación web en una arquitectura basada en funciones serverless (como Vercel), el entorno de ejecución se destruye tras responder a cada solicitud HTTP. La configuración previa de tareas automáticas en Node.js mediante temporizadores de proceso continuo (`node-cron`) resultaba inerte en producción, pues ningún proceso permanecía activo entre peticiones.

Las órdenes programadas durante el fin de semana o en horario nocturno quedaban almacenadas en la base de datos con estado `pending`, pero ningún proceso las ejecutaba al sonar la campana de apertura bursátil. 

La solución implementada en este commit desacopló la ejecución de la orden respecto al temporizador: se programó un disparador oportunista (*on-demand*) que revisa si el mercado bursátil mexicano está en sesión (`isTradingTime()`) cada vez que un usuario solicita el estado de su portafolio, ejecutando en ese instante las órdenes pendientes acumuladas. Adicionalmente, se aseguró la consistencia contable del saldo virtual, bloqueando los fondos desde la programación de la orden e incorporando el endpoint para su cancelación y reembolso.

---

## 3. Fragmento Mínimo de Código (Diff Seleccionado)

El siguiente diff muestra el mecanismo oportunista incorporado en `backend/src/controllers/portfolioController.js` para ejecutar órdenes pendientes al consultar el portafolio:

```diff
--- a/backend/src/controllers/portfolioController.js
+++ b/backend/src/controllers/portfolioController.js
@@ -4,6 +4,8 @@ const { withAssetMetadata } = require('../config/assetCatalog');
 const { INITIAL_BALANCE, WEEKLY_DEPOSIT_AMOUNT } = require('../config/appConfig');
 const { calculateReturnAgainstInitial } = require('../utils/portfolioCalculator');
 const eventBus = require('../services/eventBus');
+const { executePendingOrders } = require('../services/orderExecutionService');
+const { isTradingTime } = require('../utils/bmvMarketHours');
 
 const buildHoldingsWithLivePrices = async (holdings) => {
   const tickers = holdings.map(h => h.ticker);
@@ -70,6 +72,15 @@ const getPortfolio = async (req, res) => {
   try {
     const userId = req.user.id;
 
+    // Ejecutar órdenes pendientes bajo demanda si el mercado bursátil está abierto
+    try {
+      if (isTradingTime()) {
+        await executePendingOrders();
+      }
+    } catch (pendingErr) {
+      logger.warn('On-demand pending order execution failed:', pendingErr.message);
+    }
+
     const user = await DatabaseService.getUserById(userId);
```

---

## 4. Clasificación Epistemológica

- **Categoría:** **Evidencia documental verificable.**
- **Certeza:** Máxima (commit firmado en el árbol de Git con fecha, autoría y diff comprobables).
