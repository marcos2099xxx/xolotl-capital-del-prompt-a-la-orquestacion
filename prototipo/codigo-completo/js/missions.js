// Missions Module - Misiones diarias y desafíos semanales
const Missions = (() => {
    const STORAGE_KEY = 'xolotl_missions';
    
    let state = {
        dailyMissions: [],
        weeklyChallenges: [],
        lastDailyReset: null,
        lastWeeklyReset: null,
        completedToday: [],
        completedThisWeek: [],
        stats: {
            todayBuys: 0,
            todaySells: 0,
            todayJustified: 0,
            todayViews: 0,
            todayTrades: 0,
            weekTrades: 0,
            weekBuys: 0,
            weekSells: 0,
            weekJustified: 0,
            weekPL: 0,
            uniqueAssets: 0,
            streakActive: false
        }
    };

    const DAILY_MISSIONS = [
        { id: 'buy_1', icon: '🛒', desc: 'Ejecuta 1 orden de compra', reward: 15, check: s => s.todayBuys >= 1 },
        { id: 'buy_3', icon: '🛍️', desc: 'Ejecuta 3 órdenes de compra', reward: 30, check: s => s.todayBuys >= 3 },
        { id: 'sell_1', icon: '💰', desc: 'Vende 1 posición', reward: 15, check: s => s.todaySells >= 1 },
        { id: 'justify_1', icon: '🧠', desc: 'Justifica 1 operación ante la IA', reward: 25, check: s => s.todayJustified >= 1 },
        { id: 'justify_3', icon: '🎓', desc: 'Justifica 3 operaciones', reward: 50, check: s => s.todayJustified >= 3 },
        { id: 'view_market', icon: '👀', desc: 'Explora 5 activos del mercado', reward: 10, check: s => s.todayViews >= 5 },
        { id: 'check_streak', icon: '🔥', desc: 'Mantén tu racha activa', reward: 20, check: s => s.streakActive },
        { id: 'trade_2', icon: '📊', desc: 'Realiza 2 operaciones (compra/venta)', reward: 20, check: s => s.todayTrades >= 2 }
    ];

    const WEEKLY_CHALLENGES = [
        { id: 'diversify_3', icon: '🌈', desc: 'Diversifica en 3 activos diferentes', reward: 100, check: s => s.uniqueAssets >= 3 },
        { id: 'diversify_5', icon: '🎨', desc: 'Diversifica en 5 activos diferentes', reward: 200, check: s => s.uniqueAssets >= 5 },
        { id: 'profit_week', icon: '📈', desc: 'Termina la semana con ganancia', reward: 150, check: s => s.weekPL > 0 },
        { id: 'trades_10', icon: '⚡', desc: 'Realiza 10 operaciones esta semana', reward: 80, check: s => s.weekTrades >= 10 },
        { id: 'trades_25', icon: '🔥', desc: 'Realiza 25 operaciones esta semana', reward: 200, check: s => s.weekTrades >= 25 },
        { id: 'justified_5', icon: '🏆', desc: 'Justifica 5 operaciones esta semana', reward: 120, check: s => s.weekJustified >= 5 },
        { id: 'streak_5', icon: '⭐', desc: 'Mantén una racha de 5 días', reward: 150, check: s => s.streakActive && Gamification.getStreak() >= 5 }
    ];

    function init() {
        loadState();
        checkResets();
        generateDailyMissions();
        generateWeeklyChallenges();
    }

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const saved = JSON.parse(stored);
                state = { ...state, ...saved };
            }
        } catch {}
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Missions: No se pudo guardar', e);
        }
    }

    function checkResets() {
        const now = new Date();
        const today = now.toDateString();

        if (!state.lastDailyReset || new Date(state.lastDailyReset).toDateString() !== today) {
            state.completedToday = [];
            state.stats.todayBuys = 0;
            state.stats.todaySells = 0;
            state.stats.todayJustified = 0;
            state.stats.todayViews = 0;
            state.stats.todayTrades = 0;
            state.lastDailyReset = now.toISOString();
            generateDailyMissions();
        }

        const weekStart = getWeekStart(now);
        if (!state.lastWeeklyReset || new Date(state.lastWeeklyReset) < weekStart) {
            state.completedThisWeek = [];
            state.stats.weekTrades = 0;
            state.stats.weekBuys = 0;
            state.stats.weekSells = 0;
            state.stats.weekJustified = 0;
            state.stats.weekPL = 0;
            state.lastWeeklyReset = now.toISOString();
            generateWeeklyChallenges();
        }

        saveState();
    }

    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function generateDailyMissions() {
        const shuffled = [...DAILY_MISSIONS].sort(() => Math.random() - 0.5);
        state.dailyMissions = shuffled.slice(0, 4).map(m => ({
            ...m,
            completed: state.completedToday.includes(m.id)
        }));
        saveState();
    }

    function generateWeeklyChallenges() {
        const shuffled = [...WEEKLY_CHALLENGES].sort(() => Math.random() - 0.5);
        state.weeklyChallenges = shuffled.slice(0, 3).map(c => ({
            ...c,
            completed: state.completedThisWeek.includes(c.id)
        }));
        saveState();
    }

    function updateStats(type, data = {}) {
        state.stats.streakActive = Gamification.getStreak() > 0;
        state.stats.uniqueAssets = Object.keys(Portfolio.getHoldings()).length;

        switch (type) {
            case 'buy':
                state.stats.todayBuys++;
                state.stats.todayTrades++;
                state.stats.weekTrades++;
                state.stats.weekBuys++;
                break;
            case 'sell':
                state.stats.todaySells++;
                state.stats.todayTrades++;
                state.stats.weekTrades++;
                state.stats.weekSells++;
                if (data.pnl !== undefined) {
                    state.stats.weekPL += data.pnl;
                }
                break;
            case 'justify':
                state.stats.todayJustified++;
                state.stats.weekJustified++;
                break;
            case 'view':
                state.stats.todayViews++;
                break;
        }

        saveState();
        checkMissionCompletion();
    }

    function checkMissionCompletion() {
        const newCompletions = [];

        state.dailyMissions.forEach(mission => {
            if (!mission.completed && mission.check(state.stats)) {
                mission.completed = true;
                state.completedToday.push(mission.id);
                newCompletions.push({ ...mission, type: 'daily' });
                Gamification.addXP(mission.reward, 'mission_' + mission.id);
            }
        });

        state.weeklyChallenges.forEach(challenge => {
            if (!challenge.completed && challenge.check(state.stats)) {
                challenge.completed = true;
                state.completedThisWeek.push(challenge.id);
                newCompletions.push({ ...challenge, type: 'weekly' });
                Gamification.addXP(challenge.reward, 'challenge_' + challenge.id);
            }
        });

        saveState();
        return newCompletions;
    }

    function getDailyMissions() {
        return state.dailyMissions.map(m => ({
            ...m,
            progress: getMissionProgress(m),
            completed: state.completedToday.includes(m.id)
        }));
    }

    function getWeeklyChallenges() {
        return state.weeklyChallenges.map(c => ({
            ...c,
            progress: getChallengeProgress(c),
            completed: state.completedThisWeek.includes(c.id)
        }));
    }

    function getMissionProgress(mission) {
        switch (mission.id) {
            case 'buy_1': return Math.min(state.stats.todayBuys, 1);
            case 'buy_3': return Math.min(state.stats.todayBuys, 3);
            case 'sell_1': return Math.min(state.stats.todaySells, 1);
            case 'justify_1': return Math.min(state.stats.todayJustified, 1);
            case 'justify_3': return Math.min(state.stats.todayJustified, 3);
            case 'view_market': return Math.min(state.stats.todayViews, 5);
            case 'check_streak': return state.stats.streakActive ? 1 : 0;
            case 'trade_2': return Math.min(state.stats.todayTrades, 2);
            default: return 0;
        }
    }

    function getChallengeProgress(challenge) {
        switch (challenge.id) {
            case 'diversify_3': return Math.min(state.stats.uniqueAssets, 3);
            case 'diversify_5': return Math.min(state.stats.uniqueAssets, 5);
            case 'profit_week': return state.stats.weekPL > 0 ? 1 : 0;
            case 'trades_10': return Math.min(state.stats.weekTrades, 10);
            case 'trades_25': return Math.min(state.stats.weekTrades, 25);
            case 'justified_5': return Math.min(state.stats.weekJustified, 5);
            case 'streak_5': return Math.min(Gamification.getStreak(), 5);
            default: return 0;
        }
    }

    function getProgressMax(missionId) {
        const map = { 'buy_1': 1, 'buy_3': 3, 'sell_1': 1, 'justify_1': 1, 'justify_3': 3, 'view_market': 5, 'check_streak': 1, 'trade_2': 2, 'diversify_3': 3, 'diversify_5': 5, 'profit_week': 1, 'trades_10': 10, 'trades_25': 25, 'justified_5': 5, 'streak_5': 5 };
        return map[missionId] || 1;
    }

    function renderMissionsPanel() {
        const daily = getDailyMissions();
        const weekly = getWeeklyChallenges();

        return `
            <div class="space-y-4">
                <!-- Daily Missions -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-semibold">📋 Misiones Diarias</h4>
                        <span class="text-[10px] text-slate-500">Se renuevan cada día</span>
                    </div>
                    <div class="space-y-2">
                        ${daily.map(m => renderMissionCard(m, 'daily')).join('')}
                    </div>
                </div>
                
                <!-- Weekly Challenges -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-semibold">🏆 Desafíos Semanales</h4>
                        <span class="text-[10px] text-slate-500">Se renuevan cada lunes</span>
                    </div>
                    <div class="space-y-2">
                        ${weekly.map(c => renderMissionCard(c, 'weekly')).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function renderMissionCard(mission, type) {
        const progress = mission.progress;
        const max = getProgressMax(mission.id);
        const percent = max > 0 ? (progress / max) * 100 : 0;
        const isComplete = mission.completed;

        return `
            <div class="glass-light rounded-xl p-3 ${isComplete ? 'opacity-70' : ''}">
                <div class="flex items-center gap-3">
                    <span class="text-xl ${isComplete ? 'grayscale' : ''}">${mission.icon}</span>
                    <div class="flex-1">
                        <p class="text-sm ${isComplete ? 'line-through text-slate-500' : ''}">${mission.desc}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <div class="flex-1 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                <div class="h-full ${isComplete ? 'bg-green-500' : 'bg-primary-500'} rounded-full transition-all" style="width: ${percent}%"></div>
                            </div>
                            <span class="text-[10px] text-slate-500">${progress}/${max}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        ${isComplete 
                            ? '<span class="text-green-400 text-lg">✅</span>' 
                            : `<span class="text-xs font-bold text-yellow-400">+${mission.reward} XP</span>`
                        }
                    </div>
                </div>
            </div>
        `;
    }

    function getCompletedCount() {
        return {
            daily: state.completedToday.length,
            dailyTotal: state.dailyMissions.length,
            weekly: state.completedThisWeek.length,
            weeklyTotal: state.weeklyChallenges.length
        };
    }

    function reset() {
        state = {
            dailyMissions: [],
            weeklyChallenges: [],
            lastDailyReset: null,
            lastWeeklyReset: null,
            completedToday: [],
            completedThisWeek: [],
            stats: { todayBuys: 0, todaySells: 0, todayJustified: 0, todayViews: 0, todayTrades: 0, weekTrades: 0, weekBuys: 0, weekSells: 0, weekJustified: 0, weekPL: 0, uniqueAssets: 0, streakActive: false }
        };
        saveState();
    }

    return {
        init,
        updateStats,
        checkMissionCompletion,
        getDailyMissions,
        getWeeklyChallenges,
        renderMissionsPanel,
        getCompletedCount,
        reset
    };
})();
