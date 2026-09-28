// Sounds Module - Efectos de sonido usando Web Audio API
const Sounds = (() => {
    let audioContext = null;
    let enabled = true;
    let volume = 0.5;

    function init() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Sounds: Web Audio API no disponible');
        }
    }

    function ensureContext() {
        if (!audioContext) init();
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        return audioContext;
    }

    function setEnabled(state) {
        enabled = state;
    }

    function setVolume(v) {
        volume = Math.max(0, Math.min(1, v));
    }

    function playTone(frequency, duration, type = 'sine', fadeOut = true) {
        if (!enabled) return;
        const ctx = ensureContext();
        if (!ctx) return;

        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
            if (fadeOut) {
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            }

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            // Silent fail
        }
    }

    function playSequence(notes) {
        if (!enabled) return;
        const ctx = ensureContext();
        if (!ctx) return;

        let time = ctx.currentTime;
        notes.forEach(note => {
            try {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = note.type || 'sine';
                oscillator.frequency.setValueAtTime(note.freq, time);

                gainNode.gain.setValueAtTime(volume * 0.2, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + note.duration);

                oscillator.start(time);
                oscillator.stop(time + note.duration);

                time += note.gap || note.duration;
            } catch (e) {}
        });
    }

    function buy() {
        playSequence([
            { freq: 523, duration: 0.1, gap: 0.05 },
            { freq: 659, duration: 0.1, gap: 0.05 },
            { freq: 784, duration: 0.15, gap: 0.1 }
        ]);
    }

    function sellWin() {
        playSequence([
            { freq: 523, duration: 0.08, gap: 0.04 },
            { freq: 659, duration: 0.08, gap: 0.04 },
            { freq: 784, duration: 0.08, gap: 0.04 },
            { freq: 1047, duration: 0.2, gap: 0.15 }
        ]);
    }

    function sellLoss() {
        playSequence([
            { freq: 400, duration: 0.15, gap: 0.1, type: 'sawtooth' },
            { freq: 300, duration: 0.2, gap: 0.15, type: 'sawtooth' }
        ]);
    }

    function achievement() {
        playSequence([
            { freq: 523, duration: 0.1, gap: 0.05 },
            { freq: 659, duration: 0.1, gap: 0.05 },
            { freq: 784, duration: 0.1, gap: 0.05 },
            { freq: 1047, duration: 0.1, gap: 0.05 },
            { freq: 1319, duration: 0.25, gap: 0.2 }
        ]);
    }

    function streak() {
        playSequence([
            { freq: 880, duration: 0.08, gap: 0.04 },
            { freq: 1100, duration: 0.08, gap: 0.04 },
            { freq: 1320, duration: 0.12, gap: 0.08 }
        ]);
    }

    function levelUp() {
        playSequence([
            { freq: 523, duration: 0.08, gap: 0.04 },
            { freq: 659, duration: 0.08, gap: 0.04 },
            { freq: 784, duration: 0.08, gap: 0.04 },
            { freq: 1047, duration: 0.08, gap: 0.04 },
            { freq: 1319, duration: 0.08, gap: 0.04 },
            { freq: 1568, duration: 0.3, gap: 0.2 }
        ]);
    }

    function error() {
        playTone(200, 0.3, 'square');
    }

    function click() {
        playTone(800, 0.05, 'sine');
    }

    function notification() {
        playSequence([
            { freq: 880, duration: 0.1, gap: 0.08 },
            { freq: 1100, duration: 0.15, gap: 0.1 }
        ]);
    }

    function xpGain() {
        playTone(1200, 0.1, 'sine');
    }

    function missionComplete() {
        playSequence([
            { freq: 660, duration: 0.1, gap: 0.05 },
            { freq: 880, duration: 0.1, gap: 0.05 },
            { freq: 1100, duration: 0.15, gap: 0.1 },
            { freq: 1320, duration: 0.2, gap: 0.15 }
        ]);
    }

    function deposit() {
        playSequence([
            { freq: 523, duration: 0.06, gap: 0.03 },
            { freq: 659, duration: 0.06, gap: 0.03 },
            { freq: 784, duration: 0.06, gap: 0.03 },
            { freq: 1047, duration: 0.06, gap: 0.03 },
            { freq: 1319, duration: 0.06, gap: 0.03 },
            { freq: 1568, duration: 0.06, gap: 0.03 },
            { freq: 2093, duration: 0.3, gap: 0.2 }
        ]);
    }

    return {
        init,
        setEnabled,
        setVolume,
        buy,
        sellWin,
        sellLoss,
        achievement,
        streak,
        levelUp,
        error,
        click,
        notification,
        xpGain,
        missionComplete,
        deposit
    };
})();
