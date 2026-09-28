// Gamification Module - XP, Streaks, Ligas, Niveles y Logros
const Gamification = (() => {
    const STORAGE_KEY = 'xolotl_gamification';
    
    let state = {
        xp: 0,
        level: 1,
        streak: 0,
        maxStreak: 0,
        lastCheckin: null,
        achievements: [],
        league: 'bronce',
        dailyCheckins: [],
        xpHistory: []
    };

    function init() {
        loadState();
        checkStreakStatus();
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
            console.warn('Gamification: No se pudo guardar estado', e);
        }
    }

    function addXP(amount, source = 'unknown') {
        state.xp += amount;
        state.xpHistory.push({ amount, source, timestamp: Date.now() });
        
        const newLevel = calculateLevel(state.xp);
        const leveledUp = newLevel > state.level;
        state.level = newLevel;
        
        const newLeague = calculateLeague(state.xp);
        const leagueChanged = newLeague !== state.league;
        state.league = newLeague;
        
        saveState();
        Logger.logXP(source, amount, state.xp);
        
        return { 
            newTotal: state.xp, 
            leveledUp, 
            newLevel: state.level,
            leagueChanged,
            newLeague: state.league
        };
    }

    function deductXP(amount, reason = 'unknown') {
        state.xp = Math.max(0, state.xp - amount);
        state.level = calculateLevel(state.xp);
        state.league = calculateLeague(state.xp);
        saveState();
        Logger.logEvent('xp_deducted', { amount, reason, newTotal: state.xp });
        return state.xp;
    }

    function calculateLevel(xp) {
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (xp >= LEVELS[i].xpRequired) {
                return LEVELS[i].level;
            }
        }
        return 1;
    }

    function calculateLeague(xp) {
        for (let i = LEAGUES.length - 1; i >= 0; i--) {
            if (xp >= LEAGUES[i].xpMin) {
                return LEAGUES[i].id;
            }
        }
        return 'bronce';
    }

    function getLevel() {
        const levelData = LEVELS.find(l => l.level === state.level) || LEVELS[0];
        const nextLevel = LEVELS.find(l => l.level === state.level + 1);
        const progress = nextLevel 
            ? ((state.xp - levelData.xpRequired) / (nextLevel.xpRequired - levelData.xpRequired)) * 100 
            : 100;
        
        return {
            ...levelData,
            progress: Math.min(100, Math.max(0, progress)),
            nextLevel
        };
    }

    function getLeague() {
        const leagueData = LEAGUES.find(l => l.id === state.league) || LEAGUES[0];
        const progress = leagueData.xpMax === Infinity 
            ? 100 
            : ((state.xp - leagueData.xpMin) / (leagueData.xpMax - leagueData.xpMin)) * 100;
        const nextLeague = LEAGUES[LEAGUES.indexOf(leagueData) + 1];
        
        return {
            ...leagueData,
            progress: Math.min(100, Math.max(0, progress)),
            nextLeague,
            xpToNext: nextLeague ? nextLeague.xpMin - state.xp : 0
        };
    }

    function checkStreakStatus() {
        const now = new Date();
        const today = now.toDateString();
        
        if (!state.lastCheckin) {
            return { canCheckin: true, streak: state.streak, isFirstTime: true };
        }
        
        const lastCheckin = new Date(state.lastCheckin);
        const lastCheckinDate = lastCheckin.toDateString();
        
        if (lastCheckinDate === today) {
            return { canCheckin: false, streak: state.streak, checkedInToday: true };
        }
        
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastCheckinDate === yesterday.toDateString()) {
            return { canCheckin: true, streak: state.streak, continueStreak: true };
        }
        
        const daysDiff = Math.floor((now - lastCheckin) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) {
            return { canCheckin: true, streak: 0, streakBroken: true, daysMissed: daysDiff - 1 };
        }
        
        return { canCheckin: true, streak: state.streak };
    }

    function doDailyCheckin() {
        const status = checkStreakStatus();
        if (!status.canCheckin) {
            return { success: false, message: 'Ya hiciste check-in hoy', streak: state.streak };
        }

        const now = new Date();
        const today = now.toDateString();

        if (status.streakBroken) {
            state.streak = 0;
        }

        state.streak += 1;
        state.maxStreak = Math.max(state.maxStreak, state.streak);
        state.lastCheckin = now.toISOString();
        state.dailyCheckins.push(today);

        if (state.dailyCheckins.length > 30) {
            state.dailyCheckins = state.dailyCheckins.slice(-30);
        }

        const streakBonus = calculateStreakBonus(state.streak);
        const result = addXP(streakBonus, 'daily_streak');
        
        saveState();
        Logger.logStreakCheckin(state.streak, streakBonus);

        return {
            success: true,
            streak: state.streak,
            maxStreak: state.maxStreak,
            bonusXP: streakBonus,
            isNewRecord: state.streak === state.maxStreak,
            streakBroken: status.streakBroken || false,
            daysMissed: status.daysMissed || 0,
            ...result
        };
    }

    function getStreak() {
        return state.streak;
    }

    function getMaxStreak() {
        return state.maxStreak;
    }

    function getLastCheckin() {
        return state.lastCheckin;
    }

    function calculateStreakBonus(streak) {
        const base = XP_REWARDS.daily_streak;
        if (streak >= 30) return base * 3;
        if (streak >= 14) return base * 2.5;
        if (streak >= 7) return base * 2;
        if (streak >= 3) return base * 1.5;
        return base;
    }

    function checkAchievements(stats) {
        const newAchievements = [];
        
        ACHIEVEMENTS.forEach(achievement => {
            if (!state.achievements.includes(achievement.id)) {
                if (achievement.condition(stats)) {
                    state.achievements.push(achievement.id);
                    newAchievements.push(achievement);
                    addXP(XP_REWARDS.achievement, 'achievement_' + achievement.id);
                    Logger.logAchievement(achievement.id);
                }
            }
        });

        saveState();
        return newAchievements;
    }

    function getAchievements() {
        return ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: state.achievements.includes(a.id)
        }));
    }

    function getStats() {
        return {
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            maxStreak: state.maxStreak,
            achievementsCount: state.achievements.length,
            totalAchievements: ACHIEVEMENTS.length,
            league: state.league,
            dailyCheckins: state.dailyCheckins.length
        };
    }

    function getXPRewards() {
        return { ...XP_REWARDS };
    }

    function formatXP(xp) {
        if (xp >= 1000000) return (xp / 1000000).toFixed(1) + 'M';
        if (xp >= 1000) return (xp / 1000).toFixed(1) + 'K';
        return xp.toString();
    }

    function reset() {
        state = {
            xp: 0,
            level: 1,
            streak: 0,
            maxStreak: 0,
            lastCheckin: null,
            achievements: [],
            league: 'bronce',
            dailyCheckins: [],
            xpHistory: []
        };
        saveState();
    }

    return {
        init,
        addXP,
        deductXP,
        getLevel,
        getLeague,
        checkStreakStatus,
        doDailyCheckin,
        checkAchievements,
        getAchievements,
        getStats,
        getXPRewards,
        formatXP,
        getStreak,
        getMaxStreak,
        getLastCheckin,
        reset
    };
})();
