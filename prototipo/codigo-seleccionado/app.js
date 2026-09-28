/**
 * FRAGMENTO DE CÓDIGO SELECCIONADO — PROTOTIPO WEB XOLOTL CAPITAL
 * Archivo de origen: js/app.js (abril de 2026)
 * Propósito: Demostrar la orquestación cliente de la aplicación,
 *            la inicialización de subsistemas y la intercepción socrática previa a la orden.
 */

// Estado global de la vista
let currentTab = 'market';
let currentAsset = null;
let orderType = 'buy';
let orderQuantity = 1;

/**
 * Inicialización de subsistemas modulares en cliente
 */
function initApp() {
    Logger.init();          // Telemetría para la investigación
    Market.init();          // Catálogo y simulación de precios
    Portfolio.init();       // Saldos y tenencias en localStorage
    Gamification.init();    // Sistema de XP, niveles y rachas
    AISocratic.init();      // Motor de intervención pedagógica y sesgos
    Social.init();          // Feed social simulado (disparador de sesgo de rebaño)
    History.init();         // Bitácora de transacciones
    Charts.init();          // Renderizado de gráficos de velas/líneas
    
    setupTabNavigation();
    renderMarketList();
}

/**
 * Flujo de ejecución de órdenes con intercepción reflexiva
 */
function confirmOrder() {
    if (!currentAsset) return;
    
    // Evaluar si la orden detona una alerta de sesgo (concentración, rebaño o disposición)
    const intervention = orderType === 'buy' 
        ? AISocratic.checkBuyOrder(currentAsset.id, orderQuantity)
        : AISocratic.checkSellOrder(currentAsset.id, orderQuantity);
    
    if (intervention) {
        // Interrumpir el flujo de compra para exigir justificación reflexiva
        showAIIntervention(intervention);
        return;
    }
    
    // Si no hay sesgo crítico detectado, proceder a la ejecución
    executeOrder();
}

/**
 * Procesa la justificación reflexiva escrita por el estudiante
 */
function submitAIResponse() {
    const responseText = document.getElementById('aiResponse').value;
    const analysis = AISocratic.analyzeResponse(responseText);
    
    if (!analysis.valid) {
        showAIToast('Reflexión necesaria', 'Por favor explica tu argumento antes de operar.');
        return;
    }
    
    const intervention = AISocratic.getPendingIntervention();
    // Registrar evento de telemetría para el estudio pedagógico
    Logger.logAIIntervention(intervention.rule, intervention.prompt, responseText, 'proceeded');
    
    // Otorgar XP si el argumento demostró uso de conceptos técnicos
    if (analysis.xpBonus > 0) {
        Gamification.addXP(analysis.xpBonus, 'justified_trade');
    }
    
    AISocratic.clearIntervention();
    executeOrder(responseText);
}
