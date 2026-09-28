/**
 * FRAGMENTO DE CÓDIGO SELECCIONADO — PROTOTIPO WEB XOLOTL CAPITAL
 * Archivo de origen: js/ai-socratic.js (abril de 2026)
 * Propósito: Demostrar la implementación del andamiaje pedagógico de IA ligera en cliente,
 *            diseñado para detectar sesgos conductuales e interrumpir decisiones impulsivas.
 */

const AISocratic = (() => {
    // Banco de prompts pedagógicos parametrizados para mitigar sesgos conductuales
    const PROMPTS = {
        // Sesgo de concentración: alertar cuando se asigna más del 40-50% a un único activo
        concentration: [
            "Vas a comprometer el {percent}% de tu capital en un solo activo ({asset}). ¿Qué análisis justifica asumir este nivel de concentración?",
            "Estás concentrando una fracción crítica de tu portafolio en {asset}. ¿Has considerado el impacto si este activo sufre una caída del 20%?",
            "Concentrar tu portafolio en una sola acción incrementa significativamente tu riesgo específico. ¿Cuál es tu tesis de diversificación?"
        ],
        // Sesgo de rebaño: alertar si compra tras interactuar con publicaciones de otros usuarios
        herding: [
            "Estás replicando una operación sugerida en el feed. ¿Cuál es tu análisis técnico o fundamental independiente para esta compra?",
            "Copiar decisiones ajenas sin validación propia es una trampa común de mercado. ¿Qué datos de {asset} respaldan tu entrada?"
        ],
        // Efecto disposición: alertar cuando se liquida una posición perdedora en pánico
        disposition: [
            "Estás asumiendo una pérdida tras una caída abrupta. ¿Cambiaron los fundamentos de la empresa o es volatilidad temporal del mercado?",
            "Vender por reacción emocional puede consolidar una pérdida recuperable. ¿Tu horizonte de inversión original era de corto o largo plazo?"
        ]
    };

    // Términos técnicos esperados para validar la calidad de la justificación del estudiante
    const TECHNICAL_TERMS = [
        'tendencia', 'soporte', 'resistencia', 'diversificación', 'riesgo',
        'análisis', 'técnico', 'fundamental', 'volatilidad', 'rendimiento',
        'valor', 'mercado', 'precio', 'acción', 'etf', 'fibra', 'portafolio',
        'capital', 'inversión', 'ganancia', 'pérdida', 'stop loss'
    ];

    /**
     * Evalúa si una orden de compra o venta requiere una pausa socrática
     */
    function evaluateOrder(order, currentPortfolio) {
        const totalCapital = currentPortfolio.cash + currentPortfolio.totalInvested;
        const orderValue = order.shares * order.price;
        const postOrderConcentration = (orderValue / totalCapital) * 100;

        // Regla 1: Detección de sobreconcentración (>40% del capital total)
        if (order.type === 'buy' && postOrderConcentration >= 40) {
            const template = PROMPTS.concentration[Math.floor(Math.random() * PROMPTS.concentration.length)];
            return {
                requiresIntervention: true,
                biasType: 'concentration',
                message: template.replace('{percent}', Math.round(postOrderConcentration)).replace('{asset}', order.ticker)
            };
        }

        // Regla 2: Venta en pérdida con tenencia muy breve (<48h)
        if (order.type === 'sell' && order.unrealizedPnLPercent < -5) {
            const template = PROMPTS.disposition[Math.floor(Math.random() * PROMPTS.disposition.length)];
            return {
                requiresIntervention: true,
                biasType: 'disposition',
                message: template.replace('{asset}', order.ticker)
            };
        }

        return { requiresIntervention: false };
    }

    /**
     * Califica la respuesta reflexiva del usuario comprobando presencia de argumentos
     */
    function scoreReflection(text) {
        if (!text || text.trim().length < 15) return { valid: false, score: 0, reason: "Respuesta demasiado breve" };
        const lower = text.toLowerCase();
        const matches = TECHNICAL_TERMS.filter(term => lower.includes(term));
        return {
            valid: true,
            score: matches.length >= 2 ? 10 : 5, // Más XP por usar vocabulario fundamentado
            matchedTerms: matches
        };
    }

    return {
        evaluateOrder,
        scoreReflection
    };
})();
