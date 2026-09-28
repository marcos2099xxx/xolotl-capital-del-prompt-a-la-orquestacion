// Portfolio Module - Gestión de portafolio, capital y P/L
const Portfolio = (() => {
    const STORAGE_KEY = 'xolotl_portfolio';
    const INITIAL_CAPITAL = 10000;
    const WEEKLY_DEPOSIT = 10000;
    
    let state = {
        cash: INITIAL_CAPITAL,
        holdings: {},
        history: [],
        totalDeposited: INITIAL_CAPITAL,
        totalWithdrawn: 0,
        trades: [],
        createdAt: Date.now(),
        lastDeposit: Date.now(),
        monthStart: Date.now(),
        monthStartCapital: INITIAL_CAPITAL
    };

    function init() {
        loadState();
        checkWeeklyDeposit();
    }

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const saved = JSON.parse(stored);
                state = { ...state, ...saved };
            }
        } catch {
            // Use default state
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Portfolio: No se pudo guardar estado', e);
        }
    }

    function checkWeeklyDeposit() {
        const now = Date.now();
        const daysSinceDeposit = (now - state.lastDeposit) / (1000 * 60 * 60 * 24);
        if (daysSinceDeposit >= 7) {
            const weeks = Math.floor(daysSinceDeposit / 7);
            const depositAmount = WEEKLY_DEPOSIT * weeks;
            state.cash += depositAmount;
            state.totalDeposited += depositAmount;
            state.lastDeposit = now;
            saveState();
            return depositAmount;
        }
        return 0;
    }

    function getCash() {
        return parseFloat(state.cash.toFixed(2));
    }

    function getHoldings() {
        return { ...state.holdings };
    }

    function getHolding(assetId) {
        return state.holdings[assetId] || null;
    }

    function buyAsset(assetId, quantity, aiIntervention = null) {
        const asset = Market.getAsset(assetId);
        if (!asset) return { success: false, error: 'Activo no encontrado' };

        const totalCost = asset.currentPrice * quantity;
        if (totalCost > state.cash) {
            return { success: false, error: 'Fondos insuficientes' };
        }

        state.cash -= totalCost;

        if (state.holdings[assetId]) {
            const holding = state.holdings[assetId];
            const newTotalQuantity = holding.quantity + quantity;
            const newTotalCost = (holding.avgPrice * holding.quantity) + totalCost;
            holding.avgPrice = newTotalCost / newTotalQuantity;
            holding.quantity = newTotalQuantity;
            holding.lastBuyPrice = asset.currentPrice;
            holding.lastBuyTime = Date.now();
        } else {
            state.holdings[assetId] = {
                assetId,
                ticker: asset.ticker,
                name: asset.name,
                type: asset.type,
                icon: asset.icon,
                quantity,
                avgPrice: asset.currentPrice,
                lastBuyPrice: asset.currentPrice,
                lastBuyTime: Date.now(),
                firstBuyTime: Date.now()
            };
        }

        const trade = {
            id: 'trade_' + Date.now(),
            action: 'buy',
            assetId,
            ticker: asset.ticker,
            name: asset.name,
            quantity,
            price: asset.currentPrice,
            total: totalCost,
            timestamp: Date.now(),
            aiIntervention
        };
        state.trades.push(trade);

        saveState();
        Logger.logTrade('buy', asset, quantity, asset.currentPrice, totalCost, aiIntervention);

        return { success: true, trade, newCash: state.cash };
    }

    function sellAsset(assetId, quantity, aiIntervention = null) {
        const asset = Market.getAsset(assetId);
        if (!asset) return { success: false, error: 'Activo no encontrado' };

        const holding = state.holdings[assetId];
        if (!holding || holding.quantity < quantity) {
            return { success: false, error: 'Cantidad insuficiente' };
        }

        const totalRevenue = asset.currentPrice * quantity;
        const costBasis = holding.avgPrice * quantity;
        const pnl = totalRevenue - costBasis;

        state.cash += totalRevenue;
        holding.quantity -= quantity;

        if (holding.quantity <= 0) {
            delete state.holdings[assetId];
        }

        const trade = {
            id: 'trade_' + Date.now(),
            action: 'sell',
            assetId,
            ticker: asset.ticker,
            name: asset.name,
            quantity,
            price: asset.currentPrice,
            total: totalRevenue,
            pnl,
            pnlPercent: (pnl / costBasis) * 100,
            holdTime: Date.now() - (holding.firstBuyTime || Date.now()),
            timestamp: Date.now(),
            aiIntervention
        };
        state.trades.push(trade);

        saveState();
        Logger.logTrade('sell', asset, quantity, asset.currentPrice, totalRevenue, aiIntervention);

        return { success: true, trade, pnl, newCash: state.cash };
    }

    function getHoldingsValue() {
        let total = 0;
        Object.keys(state.holdings).forEach(assetId => {
            const holding = state.holdings[assetId];
            const asset = Market.getAsset(assetId);
            if (asset) {
                total += asset.currentPrice * holding.quantity;
            }
        });
        return parseFloat(total.toFixed(2));
    }

    function getTotalCapital() {
        return parseFloat((state.cash + getHoldingsValue()).toFixed(2));
    }

    function getTotalPL() {
        return parseFloat((getTotalCapital() - state.totalDeposited + state.totalWithdrawn).toFixed(2));
    }

    function getTotalPLPercent() {
        const invested = state.totalDeposited - state.totalWithdrawn;
        if (invested <= 0) return 0;
        return parseFloat(((getTotalPL() / invested) * 100).toFixed(2));
    }

    function getHoldingPL(assetId) {
        const holding = state.holdings[assetId];
        if (!holding) return { pnl: 0, pnlPercent: 0 };
        return Market.calculatePnL(assetId, holding.avgPrice, holding.quantity);
    }

    function getDiversification() {
        const holdings = Object.keys(state.holdings);
        if (holdings.length === 0) return { score: 0, level: 'Ninguna', tip: 'Invierte en al menos 3 activos diferentes' };

        const types = new Set();
        const sectors = new Set();
        holdings.forEach(id => {
            const holding = state.holdings[id];
            types.add(holding.type);
        });

        const assetCount = holdings.length;
        const typeCount = types.size;
        
        let score = 0;
        if (assetCount >= 1) score += 20;
        if (assetCount >= 2) score += 20;
        if (assetCount >= 3) score += 20;
        if (typeCount >= 2) score += 20;
        if (typeCount >= 3) score += 20;

        let level, tip;
        if (score < 40) {
            level = 'Baja';
            tip = 'Distribuye tu capital en al menos 3 activos de diferentes sectores';
        } else if (score < 60) {
            level = 'Moderada';
            tip = 'Considera agregar ETFs o FIBRAs para mayor diversificación';
        } else if (score < 80) {
            level = 'Buena';
            tip = '¡Buena diversificación! Mantén el equilibrio';
        } else {
            level = 'Excelente';
            tip = '¡Excelente! Tu portafolio está bien diversificado';
        }

        return { score, level, tip, assetCount, typeCount };
    }

    function getConcentrationRisk() {
        const holdingsValue = getHoldingsValue();
        if (holdingsValue === 0) return [];

        const risks = [];
        Object.keys(state.holdings).forEach(assetId => {
            const holding = state.holdings[assetId];
            const asset = Market.getAsset(assetId);
            if (asset) {
                const value = asset.currentPrice * holding.quantity;
                const percentage = (value / holdingsValue) * 100;
                risks.push({
                    assetId,
                    ticker: holding.ticker,
                    percentage: parseFloat(percentage.toFixed(1)),
                    isConcentrated: percentage > 50
                });
            }
        });

        return risks.sort((a, b) => b.percentage - a.percentage);
    }

    function getPortfolioHistory() {
        return state.history.slice(-30);
    }

    function recordSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            capital: getTotalCapital(),
            cash: state.cash,
            holdingsValue: getHoldingsValue(),
            holdingsCount: Object.keys(state.holdings).length
        };
        state.history.push(snapshot);
        if (state.history.length > 100) {
            state.history = state.history.slice(-100);
        }
        saveState();
    }

    function getTrades() {
        return [...state.trades];
    }

    function getTradeStats() {
        const trades = state.trades;
        const buyTrades = trades.filter(t => t.action === 'buy');
        const sellTrades = trades.filter(t => t.action === 'sell');
        const profitableTrades = sellTrades.filter(t => t.pnl > 0);
        const losingTrades = sellTrades.filter(t => t.pnl < 0);
        const justifiedTrades = trades.filter(t => t.aiIntervention && t.aiIntervention.response);

        return {
            totalTrades: trades.length,
            buyCount: buyTrades.length,
            sellCount: sellTrades.length,
            profitableCount: profitableTrades.length,
            losingCount: losingTrades.length,
            justifiedCount: justifiedTrades.length,
            justificationRate: trades.length > 0 ? (justifiedTrades.length / trades.length * 100).toFixed(0) : 0,
            bestTrade: sellTrades.length > 0 ? Math.max(...sellTrades.map(t => t.pnl || 0)) : 0,
            worstTrade: sellTrades.length > 0 ? Math.min(...sellTrades.map(t => t.pnl || 0)) : 0,
            avgHoldTime: calculateAvgHoldTime(sellTrades),
            uniqueAssets: new Set(trades.map(t => t.assetId)).size,
            maxProfit: Math.max(0, getTotalPL())
        };
    }

    function calculateAvgHoldTime(sellTrades) {
        if (sellTrades.length === 0) return 0;
        const totalHoldTime = sellTrades.reduce((sum, t) => sum + (t.holdTime || 0), 0);
        return totalHoldTime / sellTrades.length;
    }

    function formatHoldTime(ms) {
        if (ms < 60000) return '< 1 min';
        if (ms < 3600000) return Math.floor(ms / 60000) + ' min';
        if (ms < 86400000) return Math.floor(ms / 3600000) + ' hrs';
        return Math.floor(ms / 86400000) + ' días';
    }

    function checkMonthlyReset() {
        const now = Date.now();
        const daysSinceReset = (now - state.monthStart) / (1000 * 60 * 60 * 24);
        if (daysSinceReset >= 30) {
            return true;
        }
        return false;
    }

    function executeMonthlyReset() {
        const endCapital = getTotalCapital();
        const returnPercent = ((endCapital - state.monthStartCapital) / state.monthStartCapital * 100).toFixed(2);
        const stats = getTradeStats();
        
        const monthlyReport = {
            startCapital: state.monthStartCapital,
            endCapital,
            returnPercent: parseFloat(returnPercent),
            trades: stats.totalTrades,
            justifiedRate: stats.justificationRate,
            timestamp: Date.now()
        };

        state.monthStart = Date.now();
        state.monthStartCapital = endCapital;
        state.cash = endCapital;
        state.holdings = {};
        
        saveState();
        Logger.logEvent('monthly_reset', monthlyReport);

        return monthlyReport;
    }

    function reset() {
        state = {
            cash: INITIAL_CAPITAL,
            holdings: {},
            history: [],
            totalDeposited: INITIAL_CAPITAL,
            totalWithdrawn: 0,
            trades: [],
            createdAt: Date.now(),
            lastDeposit: Date.now(),
            monthStart: Date.now(),
            monthStartCapital: INITIAL_CAPITAL
        };
        saveState();
    }

    return {
        init,
        getCash,
        getHoldings,
        getHolding,
        buyAsset,
        sellAsset,
        getHoldingsValue,
        getTotalCapital,
        getTotalPL,
        getTotalPLPercent,
        getHoldingPL,
        getDiversification,
        getConcentrationRisk,
        getPortfolioHistory,
        recordSnapshot,
        getTrades,
        getTradeStats,
        formatHoldTime,
        checkWeeklyDeposit,
        checkMonthlyReset,
        executeMonthlyReset,
        reset
    };
})();
