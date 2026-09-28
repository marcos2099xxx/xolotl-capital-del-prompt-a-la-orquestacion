// Catálogo de Activos del Mercado de Capitales Mexicano
const ASSETS_DATA = [
    // ACCIONES (BMV)
    {
        id: 'amx',
        ticker: 'AMXB',
        name: 'América Móvil',
        type: 'accion',
        sector: 'Telecomunicaciones',
        icon: '📱',
        basePrice: 16.85,
        volatility: 0.025,
        description: 'Mayor empresa de telecomunicaciones en Latinoamérica'
    },
    {
        id: 'walmex',
        ticker: 'WALMEX',
        name: 'Walmart de México',
        type: 'accion',
        sector: 'Comercio',
        icon: '🛒',
        basePrice: 56.30,
        volatility: 0.018,
        description: 'Cadena de tiendas más grande de México'
    },
    {
        id: 'gf',
        ticker: 'GFNORTE',
        name: 'Grupo Financiero Banorte',
        type: 'accion',
        sector: 'Financiero',
        icon: '🏦',
        basePrice: 128.50,
        volatility: 0.022,
        description: 'Uno de los bancos más grandes de México'
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
        description: 'Líder global en producción de cemento y concreto'
    },
    {
        id: 'femsa',
        ticker: 'FEMSAUBD',
        name: 'FEMSA',
        type: 'accion',
        sector: 'Consumo',
        icon: '🍺',
        basePrice: 142.80,
        volatility: 0.02,
        description: 'Embotelladora de Coca-Cola y tiendas OXXO'
    },
    {
        id: 'gmexico',
        ticker: 'GMEXICOB',
        name: 'Grupo México',
        type: 'accion',
        sector: 'Minería',
        icon: '⛏️',
        basePrice: 78.95,
        volatility: 0.028,
        description: 'Mayor productor de cobre en México'
    },
    {
        id: 'televisa',
        ticker: 'TLEVISACPO',
        name: 'Televisa',
        type: 'accion',
        sector: 'Medios',
        icon: '📺',
        basePrice: 7.25,
        volatility: 0.035,
        description: 'Empresa de medios de comunicación más grande de habla hispana'
    },
    {
        id: 'bimbo',
        ticker: 'BIMBOA',
        name: 'Grupo Bimbo',
        type: 'accion',
        sector: 'Alimentos',
        icon: '🍞',
        basePrice: 72.40,
        volatility: 0.015,
        description: 'Panificadora más grande del mundo'
    },
    {
        id: 'pinfra',
        ticker: 'PINFRA',
        name: 'Promotora y Operadora de Infraestructura',
        type: 'accion',
        sector: 'Infraestructura',
        icon: '🛣️',
        basePrice: 215.30,
        volatility: 0.02,
        description: 'Operadora de carreteras y concesiones'
    },
    {
        id: 'genomma',
        ticker: 'LABB',
        name: 'Genomma Lab',
        type: 'accion',
        sector: 'Farmacéutico',
        icon: '💊',
        basePrice: 28.60,
        volatility: 0.03,
        description: 'Empresa farmacéutica de consumo masivo'
    },
    // ETFs (en BMV)
    {
        id: 'naftrac',
        ticker: 'NAFTRAC',
        name: 'iShares NAFTRAC',
        type: 'etf',
        sector: 'Índice',
        icon: '📊',
        basePrice: 48.75,
        volatility: 0.015,
        description: 'ETF que replica el IPC de la BMV'
    },
    {
        id: 'ishares-sp500',
        ticker: 'IVVPESO',
        name: 'iShares S&P 500 (Pesos)',
        type: 'etf',
        sector: 'Índice Internacional',
        icon: '🇺🇸',
        basePrice: 635.20,
        volatility: 0.012,
        description: 'Exposición al S&P 500 en pesos mexicanos'
    },
    {
        id: 'ishares-em',
        ticker: 'EMMXX',
        name: 'iShares Mercados Emergentes',
        type: 'etf',
        sector: 'Emergentes',
        icon: '🌏',
        basePrice: 42.10,
        volatility: 0.02,
        description: 'Diversificación en mercados emergentes'
    },
    {
        id: 'gold-etf',
        ticker: 'GLD',
        name: 'SPDR Gold Shares',
        type: 'etf',
        sector: 'Commodities',
        icon: '🥇',
        basePrice: 3850.00,
        volatility: 0.008,
        description: 'Respaldado por oro físico'
    },
    // FIBRAs
    {
        id: 'fibra-11',
        ticker: 'FUNO 11',
        name: 'Fibra Uno',
        type: 'fibra',
        sector: 'Inmobiliario',
        icon: '🏢',
        basePrice: 24.85,
        volatility: 0.018,
        description: 'Mayor FIBRA de oficinas y comerciales en México'
    },
    {
        id: 'fibra-mty',
        ticker: 'FMTY 14',
        name: 'Fibra Macquarie',
        type: 'fibra',
        sector: 'Inmobiliario',
        icon: '🏭',
        basePrice: 32.40,
        volatility: 0.016,
        description: 'FIBRA enfocada en propiedades industriales'
    },
    {
        id: 'fibra-prologis',
        ticker: 'FIBRAMQ 12',
        name: 'Fibra Prologis',
        type: 'fibra',
        sector: 'Inmobiliario',
        icon: '📦',
        basePrice: 78.90,
        volatility: 0.014,
        description: 'FIBRA de centros logísticos y distribución'
    },
    {
        id: 'fibra-h',
        ticker: 'FIHO 12',
        name: 'Fibra Hotel',
        type: 'fibra',
        sector: 'Hospitalidad',
        icon: '🏨',
        basePrice: 18.30,
        volatility: 0.022,
        description: 'FIBRA de hoteles de marca en México'
    }
];

// Compañías simuladas para el feed social
const SIMULATED_USERS = [
    { id: 'u1', name: 'AnaTrader', level: 15, league: 'Oro', avatar: '👩‍💼' },
    { id: 'u2', name: 'CarlosMX', level: 12, league: 'Plata', avatar: '👨‍💻' },
    { id: 'u3', name: 'InversorPro', level: 22, league: 'Platino', avatar: '🧑‍💼' },
    { id: 'u4', name: 'BolsaNovato', level: 3, league: 'Bronce', avatar: '🧑‍🎓' },
    { id: 'u5', name: 'TradingQueen', level: 18, league: 'Oro', avatar: '👸' },
    { id: 'u6', name: 'WallStreetMex', level: 25, league: 'Diamante', avatar: '💎' },
    { id: 'u7', name: 'DividendosPro', level: 10, league: 'Plata', avatar: '💰' },
    { id: 'u8', name: 'CryptoBull', level: 7, league: 'Bronce', avatar: '🐂' },
    { id: 'u9', name: 'ValueInvestor', level: 20, league: 'Platino', avatar: '📈' },
    { id: 'u10', name: 'DayTrader99', level: 8, league: 'Bronce', avatar: '⚡' }
];

// Achievements definitions
const ACHIEVEMENTS = [
    { id: 'first_step', icon: '🎯', name: 'Primer Paso', desc: 'Ejecuta tu primera orden de compra', condition: (stats) => stats.totalTrades >= 1 },
    { id: 'diversifier', icon: '🌈', name: 'Diversificador', desc: 'Mantén 3 o más activos diferentes', condition: (stats) => stats.uniqueAssets >= 3 },
    { id: 'streak_3', icon: '🔥', name: 'Constancia', desc: 'Mantén una racha de 3 días', condition: (stats) => stats.maxStreak >= 3 },
    { id: 'streak_7', icon: '🔥🔥', name: 'Imparable', desc: 'Mantén una racha de 7 días', condition: (stats) => stats.maxStreak >= 7 },
    { id: 'justified_10', icon: '🧠', name: 'Pensador', desc: 'Justifica 10 operaciones analíticamente', condition: (stats) => stats.justifiedTrades >= 10 },
    { id: 'profit_1000', icon: '💵', name: 'Beneficio+', desc: 'Alcanza $1,000 de ganancia', condition: (stats) => stats.maxProfit >= 1000 },
    { id: 'trade_50', icon: '📊', name: 'Trader Activo', desc: 'Realiza 50 operaciones', condition: (stats) => stats.totalTrades >= 50 },
    { id: 'critical_think', icon: '🤔', name: 'Pensamiento Crítico', desc: 'Responde 5 prompts de IA con argumentos técnicos', condition: (stats) => stats.technicalResponses >= 5 }
];

// Niveles y XP requerido
const LEVELS = [
    { level: 1, name: 'Novato', xpRequired: 0, icon: '🌱' },
    { level: 2, name: 'Aprendiz', xpRequired: 100, icon: '📚' },
    { level: 3, name: 'Principiante', xpRequired: 250, icon: '🔍' },
    { level: 4, name: 'Intermedio', xpRequired: 500, icon: '📊' },
    { level: 5, name: 'Avanzado', xpRequired: 850, icon: '🎯' },
    { level: 6, name: 'Experto', xpRequired: 1300, icon: '🏆' },
    { level: 7, name: 'Maestro', xpRequired: 2000, icon: '👑' },
    { level: 8, name: 'Leyenda', xpRequired: 3000, icon: '⭐' },
    { level: 9, name: 'Titán', xpRequired: 4500, icon: '🦅' },
    { level: 10, name: 'Leyenda del Mercado', xpRequired: 7000, icon: '💎' }
];

// Ligas
const LEAGUES = [
    { id: 'bronce', name: 'Bronce', icon: '🥉', xpMin: 0, xpMax: 500, color: '#CD7F32' },
    { id: 'plata', name: 'Plata', icon: '🥈', xpMin: 500, xpMax: 1500, color: '#C0C0C0' },
    { id: 'oro', name: 'Oro', icon: '🥇', xpMin: 1500, xpMax: 3500, color: '#FFD700' },
    { id: 'platino', name: 'Platino', icon: '💫', xpMin: 3500, xpMax: 7000, color: '#E5E4E2' },
    { id: 'diamante', name: 'Diamante', icon: '💎', xpMin: 7000, xpMax: Infinity, color: '#B9F2FF' }
];

// XP Rewards
const XP_REWARDS = {
    buy: 10,
    sell: 5,
    justified: 20,
    diversify: 30,
    daily_streak: 10,
    weekly_bonus: 50,
    achievement: 100
};
