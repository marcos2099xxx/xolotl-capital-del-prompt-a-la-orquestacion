/**
 * FRAGMENTO DE CÓDIGO SELECCIONADO — PROTOTIPO WEB XOLOTL CAPITAL
 * Archivo de origen: js/portfolio.js (abril de 2026)
 * Propósito: Demostrar la gestión de balance de capital virtual, tenencias,
 *            cálculo de precio promedio y ejecución de compras/ventas en cliente.
 */

const Portfolio = (() => {
    const STORAGE_KEY = 'xolotl_portfolio';
    const INITIAL_CAPITAL = 100000; // Capital virtual inicial en MXN
    
    let state = {
        cash: INITIAL_CAPITAL,
        holdings: {}, // Ticker -> { shares, avgPrice, totalCost }
        trades: []
    };

    function init() {
        loadState();
    }

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) state = { ...state, ...JSON.parse(stored) };
        } catch (e) {
            console.warn('Error al cargar portafolio local:', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Error al persistir portafolio en localStorage:', e);
        }
    }

    /**
     * Ejecuta una orden de compra ajustando efectivo y ponderando el precio promedio
     */
    function executeBuy(ticker, shares, price, justification = "") {
        const totalCost = shares * price;
        if (state.cash < totalCost) throw new Error('Saldo insuficiente para ejecutar la compra');

        state.cash -= totalCost;

        if (!state.holdings[ticker]) {
            state.holdings[ticker] = { shares: 0, avgPrice: 0, totalCost: 0 };
        }

        const holding = state.holdings[ticker];
        const newShares = holding.shares + shares;
        const newTotalCost = holding.totalCost + totalCost;
        
        holding.shares = newShares;
        holding.totalCost = newTotalCost;
        holding.avgPrice = newTotalCost / newShares;

        state.trades.push({
            id: 'tr_' + Date.now(),
            type: 'buy',
            ticker,
            shares,
            price,
            totalCost,
            justification,
            timestamp: Date.now()
        });

        saveState();
        return holding;
    }

    /**
     * Calcula la valuación total del portafolio contra precios actuales de mercado
     */
    function calculateValuation(currentPrices) {
        let totalInvestedValue = 0;
        const detailedHoldings = [];

        for (const [ticker, holding] of Object.entries(state.holdings)) {
            if (holding.shares <= 0) continue;
            const currentPrice = currentPrices[ticker] || holding.avgPrice;
            const marketValue = holding.shares * currentPrice;
            const unrealizedPnL = marketValue - holding.totalCost;
            const unrealizedPnLPercent = ((marketValue - holding.totalCost) / holding.totalCost) * 100;

            totalInvestedValue += marketValue;
            detailedHoldings.push({
                ticker,
                shares: holding.shares,
                avgPrice: holding.avgPrice,
                currentPrice,
                marketValue,
                unrealizedPnL,
                unrealizedPnLPercent
            });
        }

        return {
            cash: state.cash,
            totalInvested: totalInvestedValue,
            totalNetWorth: state.cash + totalInvestedValue,
            holdings: detailedHoldings
        };
    }

    return {
        init,
        executeBuy,
        calculateValuation,
        getState: () => ({ ...state })
    };
})();
