// AI Socratic Module - Sistema de intervención reflexiva
const AISocratic = (() => {
    const PROMPTS = {
        concentration: [
            "Vas a comprometer el {percent}% de tu capital en un solo activo. ¿Qué análisis técnico o fundamental justifica este riesgo?",
            "Estás concentrando {percent}% de tu portafolio en {asset}. ¿Has considerado qué pasaría si este activo cae un 20%?",
            "Tu portafolio quedaría muy concentrado. ¿Qué estrategia de diversificación has evaluado?",
            "Concentrar más del 50% en un activo aumenta significativamente tu riesgo. ¿Cuál es tu tesis de inversión?"
        ],
        herding: [
            "Estás replicando la operación de {user}. ¿Cuál es tu argumento independiente para esta compra?",
            "Vi que interactuaste con el post de {user} antes de comprar. ¿Analizaste el activo por tu cuenta?",
            "Copiar operaciones sin análisis propio es un sesgo común. ¿Qué dice el análisis fundamental de {asset}?",
            "El comportamiento de rebaño es uno de los errores más comunes. ¿Por qué crees que {asset} es una buena inversión para ti?"
        ],
        disposition: [
            "Estás asumiendo una pérdida rápida. ¿El fundamento de la empresa cambió o es volatilidad del mercado?",
            "Vender en pánico puede ser un error. ¿Tu tesis de inversión original sigue vigente?",
            "Has mantenido {asset} solo por {time}. ¿La caída se debe a razones fundamentales o es corrección temporal?",
            "El efecto disposición te hace vender perdedores muy rápido. ¿Has evaluado si el precio actual es una oportunidad de compra?"
        ],
        quickSell: [
            "Vendes muy rápido. ¿Cuál fue tu estrategia de salida cuando compraste?",
            "El trading de corto plazo tiene altos costos. ¿Consideraste mantener la posición más tiempo?",
            "Tu tiempo de retención promedio es muy bajo. ¿Inviertes o especulas?"
        ],
        general: [
            "Antes de ejecutar, ¿puedes explicar brevemente por qué esta operación es buena?",
            "¿Qué indicadores o datos usaste para tomar esta decisión?",
            "¿Cuál es tu plan si el mercado se mueve en tu contra?"
        ]
    };

    const TECHNICAL_TERMS = [
        'tendencia', 'soporte', 'resistencia', 'diversificación', 'riesgo',
        'análisis', 'técnico', 'fundamental', 'volatilidad', 'rendimiento',
        'valor', 'mercado', 'precio', 'acción', 'etf', 'fibra', 'portafolio',
        'capital', 'inversión', 'ganancia', 'pérdida', 'stop loss',
        'compra', 'venta', 'posición', 'liquidez', 'deuda', 'utilidad',
        'p/e', 'roe', 'roa', 'ebitda', 'dividendo', 'beta', 'alfa',
        'corto plazo', 'largo plazo', 'tendencia', 'corrección', 'rebote',
        'volumen', 'promedio', 'media', 'desviación', 'correlación'
    ];

    let pendingIntervention = null;
    let recentFeedView = null;

    function init() {
        recentFeedView = null;
    }

    function checkBuyOrder(assetId, quantity) {
        const asset = Market.getAsset(assetId);
        if (!asset) return null;

        const price = asset.currentPrice * quantity;
        const cash = Portfolio.getCash();
        const holdingsValue = Portfolio.getHoldingsValue();
        const totalCapital = cash + holdingsValue;
        const concentrationPercent = (price / totalCapital) * 100;

        if (concentrationPercent > 50) {
            return createIntervention('concentration', {
                asset: asset.name,
                ticker: asset.ticker,
                percent: concentrationPercent.toFixed(1)
            });
        }

        if (recentFeedView) {
            const timeSinceFeed = Date.now() - recentFeedView.timestamp;
            if (timeSinceFeed < 120000) {
                const intervention = createIntervention('herding', {
                    user: recentFeedView.userName,
                    asset: asset.name
                });
                recentFeedView = null;
                return intervention;
            }
        }

        return null;
    }

    function checkSellOrder(assetId, quantity) {
        const holding = Portfolio.getHolding(assetId);
        if (!holding) return null;

        const holdTime = Date.now() - holding.firstBuyTime;
        const asset = Market.getAsset(assetId);
        if (!asset) return null;

        const currentPL = (asset.currentPrice - holding.avgPrice) * quantity;

        if (currentPL < 0 && holdTime < 86400000) {
            return createIntervention('disposition', {
                asset: asset.name,
                time: Portfolio.formatHoldTime(holdTime)
            });
        }

        if (holdTime < 3600000 && Portfolio.getTrades().length > 3) {
            return createIntervention('quickSell', {});
        }

        return null;
    }

    function createIntervention(rule, context) {
        const prompts = PROMPTS[rule] || PROMPTS.general;
        let prompt = prompts[Math.floor(Math.random() * prompts.length)];

        Object.keys(context).forEach(key => {
            prompt = prompt.replace(`{${key}}`, context[key]);
        });

        pendingIntervention = {
            rule,
            prompt,
            context,
            timestamp: Date.now()
        };

        return pendingIntervention;
    }

    function getPendingIntervention() {
        return pendingIntervention;
    }

    function clearIntervention() {
        pendingIntervention = null;
    }

    function analyzeResponse(response) {
        if (!response || response.trim().length < 5) {
            return { valid: false, type: 'empty', message: 'Tu respuesta es muy corta. Intenta justificar tu decisión.' };
        }

        const lowerResponse = response.toLowerCase().trim();

        const gibberishPatterns = [
            /^(.)\1+$/,
            /^(as|df|gh|jk|qw|ty|ui|op|zx|cv|bn)+$/i,
            /^[a-z]{1,3}$/i,
            /^(no se|ns|nah|meh|ok|si|no)$/i
        ];

        if (gibberishPatterns.some(pattern => pattern.test(lowerResponse))) {
            return { valid: false, type: 'gibberish', message: 'Parece que no escribiste una justificación válida. ¿Puedes explicar tu razonamiento?' };
        }

        const hasTechnical = TECHNICAL_TERMS.some(term => lowerResponse.includes(term));
        const wordCount = lowerResponse.split(/\s+/).length;
        const hasReasoning = wordCount >= 5;

        if (hasTechnical && hasReasoning) {
            return { 
                valid: true, 
                type: 'technical', 
                quality: 'high',
                message: 'Excelente análisis. Tu justificación muestra pensamiento fundamentado.',
                xpBonus: 20
            };
        }

        if (hasReasoning) {
            return { 
                valid: true, 
                type: 'reasoning', 
                quality: 'medium',
                message: 'Buena reflexión. Considera incluir datos técnicos o fundamentales.',
                xpBonus: 10
            };
        }

        return { 
            valid: true, 
            type: 'emotional', 
            quality: 'low',
            message: 'Tu respuesta parece emocional. Intenta basarte en datos y análisis.',
            xpBonus: 0
        };
    }

    function setRecentFeedView(post) {
        recentFeedView = {
            userName: post.userName,
            assetTicker: post.assetTicker,
            timestamp: Date.now()
        };
    }

    function getInterventionStats() {
        const logs = Logger.getLogsByType('ai_intervention');
        const total = logs.length;
        const technical = logs.filter(l => l.data.hasTechnicalTerms).length;
        const responded = logs.filter(l => l.data.userResponse && l.data.userResponse.length > 0).length;

        return {
            totalInterventions: total,
            responded,
            technicalResponses: technical,
            responseRate: total > 0 ? (responded / total * 100).toFixed(0) : 0,
            technicalRate: responded > 0 ? (technical / responded * 100).toFixed(0) : 0
        };
    }

    function reset() {
        pendingIntervention = null;
        recentFeedView = null;
    }

    return {
        init,
        checkBuyOrder,
        checkSellOrder,
        getPendingIntervention,
        clearIntervention,
        analyzeResponse,
        setRecentFeedView,
        getInterventionStats,
        reset
    };
})();
