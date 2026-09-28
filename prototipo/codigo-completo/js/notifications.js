// Notifications Module - Notificaciones push y recordatorios
const Notifications = (() => {
    const STORAGE_KEY = 'xolotl_notifications';
    let permission = 'default';
    let checkInterval = null;

    let settings = {
        enabled: true,
        streakReminder: true,
        depositNotify: true,
        missionNotify: true,
        achievementNotify: true,
        reminderHour: 9,
        soundEnabled: true
    };

    function init() {
        loadSettings();
        
        if ('Notification' in window) {
            permission = Notification.permission;
        }
        
        if (settings.enabled) {
            startChecking();
        }
    }

    function loadSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                settings = { ...settings, ...JSON.parse(stored) };
            }
        } catch {}
    }

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    async function requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Notifications: No soportadas en este navegador');
            return false;
        }

        try {
            permission = await Notification.requestPermission();
            if (permission === 'granted') {
                settings.enabled = true;
                saveSettings();
                startChecking();
                return true;
            }
        } catch (e) {
            console.warn('Notifications: Error al solicitar permiso', e);
        }
        return false;
    }

    function isEnabled() {
        return settings.enabled && permission === 'granted';
    }

    function send(title, body, options = {}) {
        if (!isEnabled()) return;

        try {
            const notification = new Notification(title, {
                body,
                icon: options.icon || '🦅',
                badge: '🦅',
                tag: options.tag || 'xolotl-' + Date.now(),
                requireInteraction: options.requireInteraction || false,
                silent: !settings.soundEnabled
            });

            notification.onclick = () => {
                window.focus();
                if (options.onClick) options.onClick();
                notification.close();
            };

            if (options.autoClose !== false) {
                setTimeout(() => notification.close(), options.duration || 8000);
            }

            Logger.logEvent('notification_sent', { title, body });
        } catch (e) {
            console.warn('Notifications: Error al enviar', e);
        }
    }

    function startChecking() {
        if (checkInterval) clearInterval(checkInterval);
        
        checkInterval = setInterval(() => {
            checkStreakReminder();
            checkDepositReminder();
        }, 60000);
    }

    function checkStreakReminder() {
        if (!settings.streakReminder) return;
        
        const now = new Date();
        const lastCheckin = Gamification.getLastCheckin();
        
        if (!lastCheckin) return;
        
        const lastDate = new Date(lastCheckin);
        const today = now.toDateString();
        
        if (lastDate.toDateString() !== today && now.getHours() >= settings.reminderHour) {
            const streak = Gamification.getStreak();
            if (streak > 0) {
                send(
                    '🔥 ¡No pierdas tu racha!',
                    `Tu racha de ${streak} días te espera. ¡Haz check-in ahora!`,
                    { tag: 'streak-reminder', requireInteraction: true }
                );
            }
        }
    }

    function checkDepositReminder() {
        if (!settings.depositNotify) return;
        
        const now = new Date();
        if (now.getDay() === 1 && now.getHours() === 10 && now.getMinutes() < 2) {
            send(
                '💰 ¡Depósito semanal!',
                'Se han agregado $10,000 MXN a tu capital. ¡Hora de invertir!',
                { tag: 'weekly-deposit' }
            );
        }
    }

    function notifyStreak(streak) {
        if (!settings.streakReminder) return;
        send(
            '🔥 ¡Racha activa!',
            `¡Llevas ${streak} días consecutivos! Sigue así.`,
            { tag: 'streak-active' }
        );
    }

    function notifyDeposit(amount) {
        if (!settings.depositNotify) return;
        send(
            '💰 ¡Depósito recibido!',
            `+$${amount.toLocaleString('es-MX')} MXN han sido agregados a tu capital.`,
            { tag: 'deposit' }
        );
    }

    function notifyMissionComplete(mission) {
        if (!settings.missionNotify) return;
        send(
            '🎯 ¡Misión completada!',
            `${mission.desc} → +${mission.reward} XP`,
            { tag: 'mission-' + mission.id }
        );
    }

    function notifyAchievement(achievement) {
        if (!settings.achievementNotify) return;
        send(
            '🏆 ¡Logro desbloqueado!',
            `${achievement.name}: ${achievement.desc}`,
            { tag: 'achievement-' + achievement.id }
        );
    }

    function notifyLevelUp(level) {
        send(
            '⬆️ ¡Nivel subido!',
            `Ahora eres nivel ${level.level} - ${level.name}`,
            { tag: 'level-up' }
        );
    }

    function updateSettings(newSettings) {
        settings = { ...settings, ...newSettings };
        saveSettings();
        
        if (settings.enabled) {
            startChecking();
        } else if (checkInterval) {
            clearInterval(checkInterval);
        }
    }

    function getSettings() {
        return { ...settings };
    }

    function stop() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    function reset() {
        stop();
        settings = {
            enabled: true,
            streakReminder: true,
            depositNotify: true,
            missionNotify: true,
            achievementNotify: true,
            reminderHour: 9,
            soundEnabled: true
        };
        saveSettings();
    }

    return {
        init,
        requestPermission,
        isEnabled,
        send,
        notifyStreak,
        notifyDeposit,
        notifyMissionComplete,
        notifyAchievement,
        notifyLevelUp,
        updateSettings,
        getSettings,
        stop,
        reset
    };
})();
