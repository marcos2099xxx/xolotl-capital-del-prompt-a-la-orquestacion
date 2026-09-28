/**
 * FRAGMENTO DE CÓDIGO SELECCIONADO — PROTOTIPO WEB XOLOTL CAPITAL
 * Archivo de origen: data/assets.js (abril de 2026)
 * Propósito: Demostrar el catálogo inicial de activos bursátiles mexicanos (BMV),
 *            incluyendo acciones representativas, FIBRAs y ETFs con parámetros de volatilidad simulada.
 */

const ASSETS_DATA = [
    // Acciones locales (BMV)
    {
        id: 'amx',
        ticker: 'AMXB',
        name: 'América Móvil',
        type: 'accion',
        sector: 'Telecomunicaciones',
        icon: '📱',
        basePrice: 16.85,
        volatility: 0.025,
        description: 'Líder de telecomunicaciones en México y Latinoamérica'
    },
    {
        id: 'walmex',
        ticker: 'WALMEX',
        name: 'Walmart de México y Centroamérica',
        type: 'accion',
        sector: 'Consumo Frecuente',
        icon: '🛒',
        basePrice: 56.30,
        volatility: 0.018,
        description: 'Mayor cadena de autoservicio y comercio minorista de México'
    },
    {
        id: 'gfnorte',
        ticker: 'GFNORTEO',
        name: 'Grupo Financiero Banorte',
        type: 'accion',
        sector: 'Financiero',
        icon: '🏦',
        basePrice: 128.50,
        volatility: 0.022,
        description: 'Institución bancaria mexicana con diversificación nacional'
    },
    {
        id: 'cemex',
        ticker: 'CEMEXCPO',
        name: 'CEMEX',
        type: 'accion',
        sector: 'Materiales',
        icon: '🏗️',
        basePrice: 8.45,
        volatility: 0.032,
        description: 'Empresa global de materiales para la industria de la construcción'
    },
    // Fideicomisos de Bienes Raíces (FIBRAs)
    {
        id: 'fibramq',
        ticker: 'FIBRAMQ',
        name: 'Fibra Macquarie México',
        type: 'fibra',
        sector: 'Bienes Raíces',
        icon: '🏢',
        basePrice: 32.10,
        volatility: 0.015,
        description: 'Fideicomiso inmobiliario enfocado en naves industriales y comerciales'
    },
    // Fondos Cotizados en Bolsa (ETFs)
    {
        id: 'naftrac',
        ticker: 'NAFTRAC',
        name: 'iShares S&P/BMV IPC ETF',
        type: 'etf',
        sector: 'Índice BMV',
        icon: '🇲🇽',
        basePrice: 52.40,
        volatility: 0.019,
        description: 'Fondo que replica el índice bursátil líder de México (S&P/BMV IPC)'
    }
];
