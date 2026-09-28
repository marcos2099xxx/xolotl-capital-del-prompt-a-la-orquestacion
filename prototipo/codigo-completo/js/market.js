// Market Module - Motor de simulación de precios bursátiles
const Market = (() => {
    const STORAGE_KEY = 'xolotl_market';
    let assets = {};
    let priceHistory = {};
    let marketTrend = 0;
    let volatilityMultiplier = 1;
    let updateInterval = null;

    function init() {
        loadState();
        if (Object.keys(assets).length === 0) {
            initializeAssets();
        }
        generateMarketTrend();
        startPriceUpdates();
    }

    function initializeAssets() {
        ASSETS_DATA.forEach(asset => {
            assets[asset.id] = {
                ...asset,
                currentPrice: asset.basePrice,
                previousClose: asset.basePrice,
                dayOpen: asset.basePrice,
                dayHigh: asset.basePrice,
                dayLow: asset.basePrice,
                change: 0,
                changePercent: 0,
                volume: Math.floor(Math.random() * 1000000) + 100000,
                lastUpdate: Date.now()
            };
            priceHistory[asset.id] = generateInitialHistory(asset.basePrice, asset.volatility);
        });
        saveState();
    }

    function generateInitialHistory(basePrice, volatility) {
        const history = [];
        let price = basePrice;
        for (let i = 30; i >= 0; i--) {
            const change = (Math.random() - 0.48) * volatility * price;
            price = Math.max(price * 0.7, price + change);
            history.push({
                price: parseFloat(price.toFixed(2)),
                timestamp: Date.now() - (i * 24 * 60 * 60 * 1000)
            });
        }
        return history;
    }

    function generateMarketTrend() {
        marketTrend = (Math.random() - 0.5) * 0.01;
    }

    function startPriceUpdates() {
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(updatePrices, 5000);
    }

    function updatePrices() {
        const now = Date.now();
        Object.keys(assets).forEach(id => {
            const asset = assets[id];
            const oldPrice = asset.currentPrice;
            
            const randomWalk = (Math.random() - 0.5) * asset.volatility * volatilityMultiplier;
            const trendComponent = marketTrend * 0.1;
            const meanReversion = (asset.basePrice - asset.currentPrice) / asset.basePrice * 0.01;
            const noise = (Math.random() - 0.5) * asset.volatility * 0.3;
            
            const totalChange = randomWalk + trendComponent + meanReversion + noise;
            const newPrice = Math.max(asset.basePrice * 0.5, asset.currentPrice * (1 + totalChange));
            
            asset.previousClose = asset.dayOpen;
            asset.currentPrice = parseFloat(newPrice.toFixed(2));
            asset.change = parseFloat((asset.currentPrice - asset.dayOpen).toFixed(2));
            asset.changePercent = parseFloat(((asset.change / asset.dayOpen) * 100).toFixed(2));
            asset.dayHigh = Math.max(asset.dayHigh, asset.currentPrice);
            asset.dayLow = Math.min(asset.dayLow, asset.currentPrice);
            asset.volume += Math.floor(Math.random() * 10000);
            asset.lastUpdate = now;
            
            priceHistory[id].push({
                price: asset.currentPrice,
                timestamp: now
            });
            if (priceHistory[id].length > 100) {
                priceHistory[id] = priceHistory[id].slice(-100);
            }
        });
        
        if (Math.random() < 0.05) {
            generateMarketTrend();
        }
        
        saveState();
    }

    function getAsset(id) {
        return assets[id] || null;
    }

    function getAllAssets() {
        return Object.values(assets);
    }

    function getAssetsByType(type) {
        if (type === 'all') return getAllAssets();
        return Object.values(assets).filter(a => a.type === type);
    }

    function searchAssets(query) {
        const q = query.toLowerCase();
        return Object.values(assets).filter(a => 
            a.name.toLowerCase().includes(q) || 
            a.ticker.toLowerCase().includes(q) ||
            a.sector.toLowerCase().includes(q)
        );
    }

    function getPriceHistory(id, periods = 30) {
        const history = priceHistory[id];
        if (!history) return [];
        return history.slice(-periods);
    }

    function getChartData(id, periods = 20) {
        const history = getPriceHistory(id, periods);
        return history.map(h => h.price);
    }

    function calculatePnL(id, entryPrice, quantity) {
        const asset = assets[id];
        if (!asset) return { pnl: 0, pnlPercent: 0 };
        const currentValue = asset.currentPrice * quantity;
        const entryValue = entryPrice * quantity;
        const pnl = currentValue - entryValue;
        const pnlPercent = (pnl / entryValue) * 100;
        return { pnl: parseFloat(pnl.toFixed(2)), pnlPercent: parseFloat(pnlPercent.toFixed(2)) };
    }

    function setVolatilityMultiplier(multiplier) {
        volatilityMultiplier = multiplier;
    }

    function simulateMarketEvent(eventType) {
        switch (eventType) {
            case 'boom':
                marketTrend = 0.02;
                volatilityMultiplier = 1.5;
                break;
            case 'crash':
                marketTrend = -0.03;
                volatilityMultiplier = 2;
                break;
            case 'calm':
                marketTrend = 0;
                volatilityMultiplier = 0.5;
                break;
            case 'volatile':
                marketTrend = 0;
                volatilityMultiplier = 2.5;
                break;
        }
        setTimeout(() => {
            marketTrend = (Math.random() - 0.5) * 0.01;
            volatilityMultiplier = 1;
        }, 60000);
    }

    function formatPrice(price) {
        return '$' + price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatChange(change, percent) {
        const sign = change >= 0 ? '+' : '';
        const color = change >= 0 ? 'text-green-400' : 'text-red-400';
        return `<span class="${color}">${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)</span>`;
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ assets, priceHistory, marketTrend }));
        } catch (e) {
            console.warn('Market: No se pudo guardar estado', e);
        }
    }

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const state = JSON.parse(stored);
                assets = state.assets || {};
                priceHistory = state.priceHistory || {};
                marketTrend = state.marketTrend || 0;
            }
        } catch {
            assets = {};
            priceHistory = {};
        }
    }

    function reset() {
        assets = {};
        priceHistory = {};
        marketTrend = 0;
        volatilityMultiplier = 1;
        initializeAssets();
    }

    function destroy() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    }

    return {
        init,
        getAsset,
        getAllAssets,
        getAssetsByType,
        searchAssets,
        getPriceHistory,
        getChartData,
        calculatePnL,
        setVolatilityMultiplier,
        simulateMarketEvent,
        formatPrice,
        formatChange,
        reset,
        destroy
    };
})();
