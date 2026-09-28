// Onboarding Module - Tutorial interactivo para nuevos usuarios
const Onboarding = (() => {
    const STORAGE_KEY = 'xolotl_onboarding';
    let currentSlide = 0;
    let tourIndex = -1;
    let isActive = false;
    let isTourActive = false;

    const slides = [
        {
            icon: '🦅',
            title: '¡Bienvenido a Xolotl Capital!',
            subtitle: 'Tu simulador bursátil personal',
            description: 'Aprende a invertir en el mercado de valores mexicano con dinero virtual, sin riesgo real.'
        },
        {
            icon: '💰',
            title: '$10,000 MXN Virtuales',
            subtitle: 'Tu capital inicial',
            description: 'Recibirás depósitos semanales de $10,000 para construir tu portafolio. ¡Cada mes el capital se reinicia!'
        },
        {
            icon: '📊',
            title: 'Explora el Mercado',
            subtitle: 'Acciones, ETFs y FIBRAs',
            description: 'Navega por los activos del mercado mexicano. Cada uno tiene precios en tiempo real simulados.'
        },
        {
            icon: '🤖',
            title: 'Tu Analista IA',
            subtitle: 'Decisiones más inteligentes',
            description: 'La IA te hará preguntas cuando detecte sesgos en tus decisiones. ¡Justifica tus operaciones para ganar XP extra!'
        },
        {
            icon: '🏆',
            title: 'Gamificación',
            subtitle: 'XP, Rachas y Ligas',
            description: 'Gana XP por cada operación, mantén tu racha diaria y compite en ligas desde Bronce hasta Diamante.'
        }
    ];

    const tourSteps = [
        { tab: 'market', selector: '#assetsList', message: 'Aquí encuentras todos los activos disponibles. ¡Toca uno para invertir!' },
        { tab: 'portfolio', selector: '#holdingsList', message: 'Tus posiciones aparecerán aquí. Diversifica para reducir riesgo.' },
        { tab: 'community', selector: '#communityFeed', message: 'El feed muestra operaciones de otros inversores. ¡Inspírate!' },
        { tab: 'profile', selector: '#achievements', message: 'Desbloquea logros completando desafíos.' }
    ];

    function init() {
        if (!isCompleted()) {
            setTimeout(() => show(), 500);
        }
    }

    function isCompleted() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored).completed : false;
        } catch {
            return false;
        }
    }

    function markCompleted() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: true, timestamp: Date.now() }));
    }

    function show() {
        isActive = true;
        currentSlide = 0;
        createOnboardingModal();
        renderSlide();
    }

    function createOnboardingModal() {
        const existing = document.getElementById('onboardingModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'onboardingModal';
        modal.className = 'fixed inset-0 z-[60]';
        modal.innerHTML = `
            <div class="modal-overlay absolute inset-0 bg-dark-950/95"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="glass rounded-2xl p-6 lg:p-8 max-w-md w-full animate-bounce-in relative">
                    <div class="flex justify-center gap-2 mb-6" id="onboardingDots"></div>
                    <div class="text-center" id="onboardingContent"></div>
                    <div class="flex gap-3 mt-6">
                        <button id="onboardingSkip" onclick="Onboarding.skip()" class="flex-1 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">
                            Saltar
                        </button>
                        <button id="onboardingNext" onclick="Onboarding.next()" class="flex-1 gradient-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function renderSlide() {
        const slide = slides[currentSlide];
        if (!slide) return;

        const dotsContainer = document.getElementById('onboardingDots');
        const content = document.getElementById('onboardingContent');
        const nextBtn = document.getElementById('onboardingNext');
        const skipBtn = document.getElementById('onboardingSkip');

        if (!dotsContainer || !content || !nextBtn || !skipBtn) return;

        dotsContainer.innerHTML = slides.map((_, i) => 
            `<div class="w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-primary-400 w-6' : i < currentSlide ? 'bg-primary-600' : 'bg-dark-700'}"></div>`
        ).join('');

        content.innerHTML = `
            <div class="text-5xl mb-4 animate-bounce-in">${slide.icon}</div>
            <h3 class="text-xl font-bold mb-1">${slide.title}</h3>
            <p class="text-primary-400 text-sm mb-3">${slide.subtitle}</p>
            <p class="text-slate-300 text-sm leading-relaxed">${slide.description}</p>
        `;

        if (currentSlide === slides.length - 1) {
            nextBtn.textContent = '¡Comenzar!';
            skipBtn.classList.add('hidden');
        } else {
            nextBtn.textContent = 'Siguiente';
            skipBtn.classList.remove('hidden');
        }
    }

    function next() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            closeSlides();
            setTimeout(() => startTour(), 400);
        } else {
            renderSlide();
        }
    }

    function skip() {
        closeSlides();
        markCompleted();
    }

    function closeSlides() {
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        isActive = false;
        markCompleted();
    }

    function startTour() {
        tourIndex = 0;
        isTourActive = true;
        showTourStep();
    }

    function showTourStep() {
        if (!isTourActive || tourIndex < 0 || tourIndex >= tourSteps.length) {
            endTour();
            return;
        }

        const step = tourSteps[tourIndex];
        
        removeTooltip();
        
        switchTab(step.tab);

        setTimeout(() => {
            if (!isTourActive) return;
            
            const target = document.querySelector(step.selector);
            if (!target) {
                tourIndex++;
                showTourStep();
                return;
            }

            const rect = target.getBoundingClientRect();
            const tooltip = document.createElement('div');
            tooltip.id = 'tourTooltip';
            tooltip.className = 'fixed z-[60] animate-fade-in';
            
            let top = rect.top - 90;
            if (top < 10) top = rect.bottom + 10;
            
            let left = Math.max(16, rect.left);
            if (left + 300 > window.innerWidth) {
                left = window.innerWidth - 320;
            }
            
            tooltip.style.top = top + 'px';
            tooltip.style.left = left + 'px';
            tooltip.style.maxWidth = Math.min(rect.width, 300) + 'px';

            const isLast = tourIndex >= tourSteps.length - 1;
            tooltip.innerHTML = `
                <div class="glass rounded-xl p-3 shadow-lg border border-primary-500/30">
                    <div class="flex items-start gap-2">
                        <span class="text-primary-400 text-lg">💡</span>
                        <div class="flex-1">
                            <p class="text-sm text-white">${step.message}</p>
                            <div class="flex gap-2 mt-3">
                                <button onclick="Onboarding.nextTourStep()" class="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-500 transition-colors">
                                    ${isLast ? '¡Entendido!' : 'Siguiente →'}
                                </button>
                                <button onclick="Onboarding.endTour()" class="text-xs text-slate-400 px-2 py-1.5 hover:text-white transition-colors">
                                    Saltar tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-3 h-3 glass rotate-45 absolute -bottom-1.5 left-6 border-r border-b border-primary-500/30"></div>
            `;

            document.body.appendChild(tooltip);
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
    }

    function nextTourStep() {
        removeTooltip();
        
        tourIndex++;
        
        if (tourIndex >= tourSteps.length) {
            endTour();
        } else {
            setTimeout(() => showTourStep(), 200);
        }
    }

    function removeTooltip() {
        const existing = document.getElementById('tourTooltip');
        if (existing) {
            existing.remove();
        }
    }

    function endTour() {
        isTourActive = false;
        tourIndex = -1;
        removeTooltip();
        markCompleted();
        
        switchTab('market');
        
        setTimeout(() => {
            showCompletionToast();
        }, 500);
    }

    function showCompletionToast() {
        const existing = document.getElementById('completionToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'completionToast';
        toast.className = 'fixed top-20 left-4 right-4 z-50 animate-slide-down';
        toast.innerHTML = `
            <div class="glass rounded-2xl p-4 max-w-md mx-auto">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">🎉</span>
                    <div>
                        <p class="font-bold text-sm">¡Tutorial completado!</p>
                        <p class="text-xs text-slate-400 mt-1">Ya estás listo para invertir. ¡Buena suerte!</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        currentSlide = 0;
        tourIndex = -1;
        isActive = false;
        isTourActive = false;
    }

    return {
        init,
        show,
        next,
        skip,
        nextTourStep,
        endTour,
        isCompleted,
        reset
    };
})();
