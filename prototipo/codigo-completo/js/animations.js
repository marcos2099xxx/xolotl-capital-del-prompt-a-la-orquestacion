// Animations Module - Efectos visuales para trades, logros y streaks
const Animations = (() => {
    let enabled = true;

    function init() {
        addAnimationStyles();
    }

    function setEnabled(state) {
        enabled = state;
    }

    function addAnimationStyles() {
        const style = document.createElement('style');
        style.id = 'animations-style';
        style.textContent = `
            @keyframes xConfettiFall {
                0% { transform: translateY(-10px) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg) scale(0.5); opacity: 0; }
            }
            @keyframes xCoinFall {
                0% { transform: translateY(-20px) rotateY(0deg); opacity: 1; }
                50% { opacity: 1; }
                100% { transform: translateY(100vh) rotateY(1080deg); opacity: 0; }
            }
            @keyframes xFloatUp {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
            }
            @keyframes xShake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            @keyframes xPulseGlow {
                0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.6); }
                50% { box-shadow: 0 0 20px 10px rgba(234, 179, 8, 0.3); }
                100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
            }
            @keyframes xFirework {
                0% { transform: scale(0); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(2); opacity: 0; }
            }
            @keyframes xSlideInRight {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes xSlideInLeft {
                0% { transform: translateX(-100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes xBounceScale {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.1); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes xHeartbeat {
                0%, 100% { transform: scale(1); }
                14% { transform: scale(1.3); }
                28% { transform: scale(1); }
                42% { transform: scale(1.3); }
                70% { transform: scale(1); }
            }
            @keyframes xShimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .anim-shake { animation: xShake 0.5s ease-in-out; }
            .anim-pulse-glow { animation: xPulseGlow 1.5s ease-in-out infinite; }
            .anim-bounce-scale { animation: xBounceScale 0.5s ease-out; }
            .anim-heartbeat { animation: xHeartbeat 1s ease-in-out; }
            .anim-shimmer {
                background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
                background-size: 200% 100%;
                animation: xShimmer 2s infinite;
            }
        `;
        document.head.appendChild(style);
    }

    function confetti(colors = null, count = 40) {
        if (!enabled) return;
        
        const palette = colors || ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#eab308', '#ec4899'];
        const container = document.createElement('div');
        container.className = 'fixed inset-0 z-[55] pointer-events-none overflow-hidden';
        document.body.appendChild(container);

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            const color = palette[Math.floor(Math.random() * palette.length)];
            const size = Math.random() * 8 + 4;
            const startX = Math.random() * 100;
            const delay = Math.random() * 0.8;
            const duration = Math.random() * 2 + 1.5;
            const shape = Math.random() > 0.5 ? '50%' : '2px';

            piece.style.cssText = `
                position: absolute;
                left: ${startX}%;
                top: -10px;
                width: ${size}px;
                height: ${size * 0.6}px;
                background: ${color};
                border-radius: ${shape};
                animation: xConfettiFall ${duration}s ease-in ${delay}s forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            container.appendChild(piece);
        }

        setTimeout(() => container.remove(), 4000);
    }

    function coins(count = 15) {
        if (!enabled) return;

        const container = document.createElement('div');
        container.className = 'fixed inset-0 z-[55] pointer-events-none overflow-hidden';
        document.body.appendChild(container);

        for (let i = 0; i < count; i++) {
            const coin = document.createElement('div');
            const startX = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = Math.random() * 1.5 + 1;
            const size = Math.random() * 10 + 16;

            coin.textContent = '🪙';
            coin.style.cssText = `
                position: absolute;
                left: ${startX}%;
                top: -20px;
                font-size: ${size}px;
                animation: xCoinFall ${duration}s ease-in ${delay}s forwards;
            `;
            container.appendChild(coin);
        }

        setTimeout(() => container.remove(), 3500);
    }

    function floatText(text, color = '#10b981', startX = null, startY = null) {
        if (!enabled) return;

        const el = document.createElement('div');
        el.textContent = text;
        el.className = 'fixed z-[56] pointer-events-none font-black text-2xl';
        el.style.cssText = `
            left: ${startX || window.innerWidth / 2}px;
            top: ${startY || window.innerHeight / 2}px;
            color: ${color};
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            animation: xFloatUp 1.5s ease-out forwards;
            transform: translateX(-50%);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }

    function buySuccess() {
        confetti(['#10b981', '#059669', '#34d399', '#6ee7b7'], 30);
        coins(10);
        floatText('¡Compra exitosa!', '#10b981');
    }

    function sellWin(amount) {
        confetti(['#eab308', '#f59e0b', '#fbbf24', '#fde68a'], 40);
        coins(20);
        floatText(`+$${amount.toFixed(2)}`, '#10b981');
    }

    function sellLoss(amount) {
        const el = document.createElement('div');
        el.className = 'fixed inset-0 z-[54] pointer-events-none';
        el.style.cssText = 'background: rgba(239, 68, 68, 0.1); animation: xShake 0.5s ease-in-out;';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 600);
        floatText(`-$${Math.abs(amount).toFixed(2)}`, '#ef4444');
    }

    function achievementUnlocked() {
        confetti(['#eab308', '#f59e0b', '#d97706', '#b45309'], 50);
        
        const glow = document.createElement('div');
        glow.className = 'fixed inset-0 z-[53] pointer-events-none';
        glow.style.cssText = `
            background: radial-gradient(circle at center, rgba(234, 179, 8, 0.2) 0%, transparent 70%);
            animation: xPulseGlow 2s ease-out forwards;
        `;
        document.body.appendChild(glow);
        setTimeout(() => glow.remove(), 2000);
    }

    function levelUp() {
        confetti(['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'], 60);
        confetti(['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'], 60);
        
        const banner = document.createElement('div');
        banner.className = 'fixed inset-0 z-[57] flex items-center justify-center pointer-events-none';
        banner.innerHTML = `
            <div class="text-center anim-bounce-scale">
                <div class="text-6xl mb-2">⬆️</div>
                <div class="text-3xl font-black text-gradient">¡NIVEL SUBIDO!</div>
            </div>
        `;
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2500);
    }

    function streakFire() {
        const badge = document.getElementById('streakBadge');
        if (badge) {
            badge.classList.add('anim-pulse-glow');
            setTimeout(() => badge.classList.remove('anim-pulse-glow'), 3000);
        }
    }

    function xpGain(amount) {
        const badge = document.getElementById('totalXP');
        if (badge) {
            badge.classList.add('anim-bounce-scale');
            setTimeout(() => badge.classList.remove('anim-bounce-scale'), 500);
        }
        floatText(`+${amount} XP`, '#eab308');
    }

    function screenFlash(color = 'rgba(255,255,255,0.1)') {
        if (!enabled) return;
        
        const flash = document.createElement('div');
        flash.className = 'fixed inset-0 z-[52] pointer-events-none';
        flash.style.cssText = `
            background: ${color};
            animation: xPulseGlow 0.3s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    }

    return {
        init,
        setEnabled,
        confetti,
        coins,
        floatText,
        buySuccess,
        sellWin,
        sellLoss,
        achievementUnlocked,
        levelUp,
        streakFire,
        xpGain,
        screenFlash
    };
})();
