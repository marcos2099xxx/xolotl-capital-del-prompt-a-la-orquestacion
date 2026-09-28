// Logger Module - Sistema de logs y exportación JSON para tesis
const Logger = (() => {
    const LOG_KEY = 'xolotl_logs';
    const SESSION_KEY = 'xolotl_session';
    const MAX_LOGS = 1000;
    const ROTATION_BATCH = 200;
    let sessionId = null;
    let logs = [];

    function init() {
        sessionId = generateSessionId();
        logs = loadLogs();
        rotateLogsIfNeeded();
        logEvent('session_start', { sessionId, timestamp: Date.now() });
    }

    function generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function loadLogs() {
        try {
            const stored = localStorage.getItem(LOG_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    function saveLogs() {
        try {
            localStorage.setItem(LOG_KEY, JSON.stringify(logs));
        } catch (e) {
            console.warn('Logger: No se pudieron guardar los logs', e);
            handleStorageFull();
        }
    }

    function rotateLogsIfNeeded() {
        if (logs.length > MAX_LOGS) {
            const importantTypes = ['trade', 'ai_intervention', 'achievement_unlocked', 'monthly_reset', 'session_start'];
            const important = logs.filter(l => importantTypes.includes(l.type));
            const recent = logs.slice(-ROTATION_BATCH);
            
            const merged = [...important, ...recent];
            const unique = [...new Map(merged.map(l => [l.id, l])).values()];
            
            logs = unique.sort((a, b) => a.timestamp - b.timestamp).slice(-MAX_LOGS);
            saveLogs();
        }
    }

    function handleStorageFull() {
        try {
            logs = logs.slice(-500);
            localStorage.setItem(LOG_KEY, JSON.stringify(logs));
        } catch {
            logs = logs.slice(-200);
            try {
                localStorage.setItem(LOG_KEY, JSON.stringify(logs));
            } catch {
                console.error('Logger: Storage completamente lleno');
            }
        }
    }

    function logEvent(type, data = {}) {
        const entry = {
            id: generateLogId(),
            sessionId,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            type,
            data: sanitizeData(data)
        };
        logs.push(entry);
        
        if (logs.length % 50 === 0) {
            rotateLogsIfNeeded();
        }
        
        saveLogs();
        return entry;
    }

    function generateLogId() {
        return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    function sanitizeData(data) {
        const clean = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && value !== null) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    clean[key] = sanitizeData(value);
                } else {
                    clean[key] = value;
                }
            }
        }
        return clean;
    }

    function logTrade(action, asset, quantity, price, total, aiIntervention = null) {
        logEvent('trade', {
            action,
            assetId: asset.id,
            assetTicker: asset.ticker,
            assetName: asset.name,
            assetType: asset.type,
            quantity,
            price,
            total,
            aiIntervention: aiIntervention ? {
                rule: aiIntervention.rule,
                prompt: aiIntervention.prompt,
                response: aiIntervention.response,
                responseLength: aiIntervention.response ? aiIntervention.response.length : 0,
                hasTechnicalTerms: aiIntervention.response ? containsTechnicalTerms(aiIntervention.response) : false
            } : null
        });
    }

    function logAIIntervention(rule, prompt, response, outcome) {
        logEvent('ai_intervention', {
            rule,
            prompt,
            userResponse: response,
            responseLength: response ? response.length : 0,
            hasTechnicalTerms: response ? containsTechnicalTerms(response) : false,
            outcome,
            responseTime: Date.now()
        });
    }

    function logStreakCheckin(day, bonusXP) {
        logEvent('streak_checkin', { day, bonusXP });
    }

    function logXP(source, amount, total) {
        logEvent('xp_gain', { source, amount, total });
    }

    function logAchievement(achievementId) {
        logEvent('achievement_unlocked', { achievementId });
    }

    function logNavigation(tab) {
        logEvent('navigation', { tab });
    }

    function logAssetView(assetId) {
        logEvent('asset_view', { assetId });
    }

    function logFeedInteraction(type, postId) {
        logEvent('feed_interaction', { type, postId });
    }

    function logSessionEnd() {
        logEvent('session_end', { sessionId, timestamp: Date.now() });
    }

    function containsTechnicalTerms(text) {
        const terms = [
            'tendencia', 'soporte', 'resistencia', 'diversificación', 'riesgo',
            'análisis', 'técnico', 'fundamental', 'volatilidad', 'rendimiento',
            'valor', 'mercado', 'precio', 'acción', 'etf', 'fibra', 'portafolio',
            'capital', 'inversión', 'ganancia', 'pérdida', 'p/l', 'stop loss',
            'compra', 'venta', 'posición', 'liquidez', 'deuda', 'utilidad',
            'p/e', 'roe', 'roa', 'ebitda', 'dividendo', 'beta', 'alfa'
        ];
        const lowerText = text.toLowerCase();
        return terms.some(term => lowerText.includes(term));
    }

    function getStats() {
        const trades = logs.filter(l => l.type === 'trade');
        const interventions = logs.filter(l => l.type === 'ai_intervention');
        const justified = interventions.filter(l => l.data.hasTechnicalTerms);
        
        return {
            totalEvents: logs.length,
            totalTrades: trades.length,
            buyTrades: trades.filter(t => t.data.action === 'buy').length,
            sellTrades: trades.filter(t => t.data.action === 'sell').length,
            aiInterventions: interventions.length,
            justifiedTrades: justified.length,
            justificationRate: interventions.length > 0 ? (justified.length / interventions.length * 100).toFixed(1) : 0,
            uniqueAssets: new Set(trades.map(t => t.data.assetId)).size,
            sessionId
        };
    }

    function exportJSON() {
        const stats = getStats();
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                appVersion: '1.0.0',
                totalLogs: logs.length,
                sessionId
            },
            statistics: stats,
            logs: logs
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xolotl_capital_logs_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        logEvent('data_exported', { totalLogs: logs.length });
        return exportData;
    }

    function clearLogs() {
        logs = [];
        localStorage.removeItem(LOG_KEY);
    }

    function getLogsByType(type) {
        return logs.filter(l => l.type === type);
    }

    function getRecentLogs(count = 50) {
        return logs.slice(-count);
    }

    return {
        init,
        logEvent,
        logTrade,
        logAIIntervention,
        logStreakCheckin,
        logXP,
        logAchievement,
        logNavigation,
        logAssetView,
        logFeedInteraction,
        logSessionEnd,
        getStats,
        exportJSON,
        clearLogs,
        getLogsByType,
        getRecentLogs
    };
})();
