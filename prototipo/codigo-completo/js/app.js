// App Main - Orquestador principal de Xolotl Capital
let currentTab = 'market';
let currentAsset = null;
let orderType = 'buy';
let orderQuantity = 1;
let marketUpdateTimer = null;
let feedUpdateTimer = null;
let snapshotTimer = null;

// User Profile State
const UserProfile = {
    STORAGE_KEY: 'xolotl_user_profile',
    data: {
        name: '',
        avatar: '🦅',
        avatarBg: 'gradient-primary',
        theme: 'dark'
    },
    
    load() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.data = { ...this.data, ...JSON.parse(stored) };
            }
        } catch {}
    },
    
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    },
    
    isNewUser() {
        return !this.data.name;
    },
    
    setName(name) {
        this.data.name = name.trim() || 'Inversor';
        this.save();
    },
    
    setAvatar(avatar) {
        this.data.avatar = avatar;
        this.save();
    },
    
    setAvatarBg(bg) {
        this.data.avatarBg = bg;
        this.save();
    },
    
    setTheme(theme) {
        this.data.theme = theme;
        this.save();
        applyTheme(theme);
    }
};

// ==================== INITIALIZATION ====================
window.onerror = function(msg, url, line) {
    console.error(`Error: ${msg} at ${url}:${line}`);
    Logger.logEvent('js_error', { message: msg, url, line });
    return false;
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    Logger.logEvent('promise_error', { reason: String(event.reason) });
});

document.addEventListener('DOMContentLoaded', () => {
    UserProfile.load();
    applyTheme(UserProfile.data.theme);
    showSplash();
});

function showSplash() {
    const progress = document.getElementById('splashProgress');
    let percent = 0;
    
    const interval = setInterval(() => {
        percent += Math.random() * 15 + 5;
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            setTimeout(initApp, 300);
        }
        progress.style.width = percent + '%';
    }, 100);
}

function initApp() {
    Logger.init();
    Market.init();
    Portfolio.init();
    Gamification.init();
    AISocratic.init();
    Social.init();
    History.init();
    Charts.init();
    Animations.init();
    Sounds.init();
    Missions.init();
    Notifications.init();
    Favorites.init();

    document.getElementById('splashScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    if (UserProfile.isNewUser()) {
        showNamePrompt();
    } else {
        Onboarding.init();
        
        const depositAmount = Portfolio.checkWeeklyDeposit();
        if (depositAmount > 0) {
            setTimeout(() => showDepositNotification(depositAmount), 1000);
        }
        
        checkStreak();
    }
    
    renderMarket();
    renderMissions();
    updateUI();
    startTimers();
    loadNotificationSettings();
}

// ==================== NAME PROMPT ====================
function showNamePrompt() {
    const modal = document.createElement('div');
    modal.id = 'namePromptModal';
    modal.className = 'fixed inset-0 z-[60]';
    modal.innerHTML = `
        <div class="modal-overlay absolute inset-0 bg-dark-950/95"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="glass rounded-2xl p-6 lg:p-8 max-w-md w-full animate-bounce-in">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-3">🦅</div>
                    <h2 class="text-2xl font-bold text-gradient">¡Bienvenido a Xolotl Capital!</h2>
                    <p class="text-slate-400 text-sm mt-2">¿Cómo te llamas, inversor?</p>
                </div>
                
                <div class="mb-6">
                    <input type="text" id="userNameInput" placeholder="Tu nombre..." maxlength="20"
                        class="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg font-bold text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                        onkeypress="if(event.key === 'Enter') confirmName()">
                </div>
                
                <button onclick="confirmName()" class="w-full gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    ¡Comenzar a Invertir!
                </button>
                
                <p class="text-xs text-slate-500 text-center mt-3">Podrás cambiar tu nombre después en tu perfil</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        document.getElementById('userNameInput').focus();
    }, 500);
}

function confirmName() {
    const input = document.getElementById('userNameInput');
    const name = input.value.trim();
    
    if (!name) {
        input.classList.add('ring-2', 'ring-red-500');
        input.placeholder = 'Por favor ingresa tu nombre';
        setTimeout(() => input.classList.remove('ring-2', 'ring-red-500'), 2000);
        return;
    }
    
    UserProfile.setName(name);
    
    const modal = document.getElementById('namePromptModal');
    if (modal) {
        modal.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => {
            modal.remove();
            Onboarding.init();
            checkStreak();
            updateUI();
        }, 300);
    }
}

// ==================== THEME ====================
function applyTheme(theme) {
    document.documentElement.classList.remove('light', 'dark');
    if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.body.style.background = '#f1f5f9';
        document.body.style.color = '#1e293b';
    } else {
        document.documentElement.classList.add('dark');
        document.body.style.background = '#0f172a';
        document.body.style.color = '#e2e8f0';
    }
}

function toggleTheme() {
    const newTheme = UserProfile.data.theme === 'dark' ? 'light' : 'dark';
    UserProfile.setTheme(newTheme);
    updateUI();
}

// ==================== STREAK ====================
function checkStreak() {
    const status = Gamification.checkStreakStatus();
    
    if (status.checkedInToday) {
        return;
    }
    
    if (status.streakBroken && status.streak > 0) {
        setTimeout(() => {
            showAIToast('😢 Racha perdida', `Pasaron ${status.daysMissed || 1} días. ¡Empieza una nueva racha hoy!`);
        }, 1500);
    }
    
    setTimeout(() => showStreakModal(), 1000);
}

function showStreakModal() {
    const status = Gamification.checkStreakStatus();
    if (!status.canCheckin) return;
    
    const result = Gamification.doDailyCheckin();
    if (!result.success) return;
    
    const modal = document.getElementById('streakModal');
    const messageEl = document.getElementById('streakMessage');
    const bonusEl = document.getElementById('streakBonus');
    const dotsContainer = document.getElementById('streakDots');
    
    if (result.streakBroken) {
        messageEl.textContent = `¡Nueva racha! Día 1`;
    } else {
        messageEl.textContent = `¡Día ${result.streak} de racha!`;
    }
    
    bonusEl.textContent = `+${result.bonusXP} XP`;
    
    dotsContainer.innerHTML = '';
    const dotsToShow = Math.min(result.streak, 7);
    for (let i = 0; i < dotsToShow; i++) {
        const dot = document.createElement('div');
        dot.className = 'w-3 h-3 rounded-full bg-orange-400 animate-bounce-in';
        dot.style.animationDelay = (i * 0.1) + 's';
        dotsContainer.appendChild(dot);
    }
    if (result.streak > 7) {
        const more = document.createElement('span');
        more.className = 'text-xs text-slate-400 ml-1';
        more.textContent = `+${result.streak - 7}`;
        dotsContainer.appendChild(more);
    }
    
    if (result.isNewRecord && result.streak > 1) {
        bonusEl.innerHTML = `+${result.bonusXP} XP <span class="text-xs text-amber-400">¡Nuevo récord!</span>`;
    }
    
    modal.classList.remove('hidden');
    
    // Play sounds and animations
    Sounds.streak();
    Animations.streakFire();
    Notifications.notifyStreak(result.streak);
    
    updateUI();
}

function closeStreakModal() {
    document.getElementById('streakModal').classList.add('hidden');
}

function startTimers() {
    marketUpdateTimer = setInterval(updateMarketUI, 5000);
    feedUpdateTimer = setInterval(() => {
        if (Math.random() < 0.3) {
            Social.generateNewPost();
            if (currentTab === 'community') renderCommunity();
        }
    }, 30000);
    snapshotTimer = setInterval(() => {
        Portfolio.recordSnapshot();
    }, 60000);
    
    Portfolio.recordSnapshot();
}

// ==================== NAVIGATION ====================
function switchTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    
    // Mobile bottom nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-white', 'bg-dark-800');
        btn.classList.add('text-slate-500');
    });
    const activeBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
    if (activeBtn) {
        activeBtn.classList.add('text-white', 'bg-dark-800');
        activeBtn.classList.remove('text-slate-500');
    }
    
    // Desktop sidebar nav
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('bg-dark-800', 'text-white');
        btn.classList.add('text-slate-400');
    });
    const activeSidebarBtn = document.querySelector(`.sidebar-btn[data-tab="${tab}"]`);
    if (activeSidebarBtn) {
        activeSidebarBtn.classList.add('bg-dark-800', 'text-white');
        activeSidebarBtn.classList.remove('text-slate-400');
    }
    
    // Update desktop tab title
    const tabTitles = {
        'market': '📊 Mercado',
        'portfolio': '💼 Mi Portafolio',
        'community': '👥 Comunidad',
        'profile': '👤 Mi Perfil'
    };
    const desktopTitle = document.getElementById('desktopTabTitle');
    if (desktopTitle) desktopTitle.textContent = tabTitles[tab] || 'Mercado';
    
    Logger.logNavigation(tab);
    Sounds.click();
    
    switch (tab) {
        case 'market': renderMarket(); renderMissions(); break;
        case 'portfolio': renderPortfolio(); break;
        case 'community': renderCommunity(); break;
        case 'profile': renderProfile(); break;
    }
}

// ==================== MARKET RENDERING ====================
function renderMarket(filter = 'all') {
    let assets;
    if (filter === 'favorites') {
        assets = Favorites.getFavoriteAssets();
    } else if (filter === 'all') {
        assets = Market.getAllAssets();
    } else {
        assets = Market.getAssetsByType(filter);
    }
    
    const container = document.getElementById('assetsList');
    
    if (assets.length === 0 && filter === 'favorites') {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-500">
                <p class="text-4xl mb-3">⭐</p>
                <p class="text-sm font-semibold">No tienes favoritos</p>
                <p class="text-xs mt-1">Toca la estrella en cualquier activo para agregarlo</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = assets.map(asset => {
        const changeClass = asset.change >= 0 ? 'text-green-400' : 'text-red-400';
        const changeSign = asset.change >= 0 ? '+' : '';
        const isFav = Favorites.isFavorite(asset.id);
        
        return `
            <div onclick="openAssetModal('${asset.id}')" class="glass-light rounded-xl p-3 cursor-pointer hover:bg-slate-700/50 transition-colors">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl">${asset.icon}</div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-sm">${asset.ticker}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-dark-800 text-slate-400">${asset.type.toUpperCase()}</span>
                            <button onclick="event.stopPropagation(); Favorites.toggleAndRender('${asset.id}')" data-fav-id="${asset.id}" class="focus:outline-none transition-transform hover:scale-110">
                                <span class="text-lg ${isFav ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'}">${isFav ? '★' : '☆'}</span>
                            </button>
                        </div>
                        <p class="text-xs text-slate-400 truncate">${asset.name}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-sm">${Market.formatPrice(asset.currentPrice)}</p>
                        <p class="text-xs ${changeClass}">${changeSign}${asset.changePercent.toFixed(2)}%</p>
                    </div>
                </div>
                <div id="miniChart-${asset.id}" class="h-8 flex items-end gap-px mt-2 px-1"></div>
            </div>
        `;
    }).join('');
    
    assets.forEach(asset => renderMiniChart(asset.id));
}

function renderMiniChart(assetId) {
    const container = document.getElementById('miniChart-' + assetId);
    if (!container) return;
    
    const data = Market.getChartData(assetId, 15);
    if (data.length === 0) return;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    container.innerHTML = data.map((price, i) => {
        const height = ((price - min) / range) * 100;
        const isLast = i === data.length - 1;
        const color = data[i] >= data[Math.max(0, i-1)] ? 'bg-green-400' : 'bg-red-400';
        return `<div class="flex-1 ${isLast ? color : 'bg-slate-600'} rounded-t-sm transition-all duration-300" style="height:${Math.max(10, height)}%"></div>`;
    }).join('');
}

function updateMarketUI() {
    if (currentTab === 'market') {
        const assets = Market.getAllAssets();
        assets.forEach(asset => {
            const priceEl = document.querySelector(`#assetsList [onclick="openAssetModal('${asset.id}')"] .text-right p:first-child`);
            const changeEl = document.querySelector(`#assetsList [onclick="openAssetModal('${asset.id}')"] .text-right p:last-child`);
            const cardEl = document.querySelector(`#assetsList [onclick="openAssetModal('${asset.id}')"]`);
            
            if (priceEl) {
                const oldPrice = parseFloat(priceEl.textContent.replace(/[$,]/g, ''));
                const newPrice = asset.currentPrice;
                
                if (oldPrice && oldPrice !== newPrice) {
                    priceEl.textContent = Market.formatPrice(newPrice);
                    
                    if (cardEl) {
                        cardEl.classList.remove('price-flash-up', 'price-flash-down');
                        void cardEl.offsetWidth;
                        cardEl.classList.add(newPrice > oldPrice ? 'price-flash-up' : 'price-flash-down');
                    }
                } else {
                    priceEl.textContent = Market.formatPrice(newPrice);
                }
            }
            
            if (changeEl) {
                const changeClass = asset.change >= 0 ? 'text-green-400' : 'text-red-400';
                const changeSign = asset.change >= 0 ? '+' : '';
                changeEl.className = `text-xs ${changeClass}`;
                changeEl.textContent = `${changeSign}${asset.changePercent.toFixed(2)}%`;
            }
            
            renderMiniChart(asset.id);
        });
    }
    
    updateHeaderStats();
}

function filterAssets(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-primary-600', 'text-white');
        btn.classList.add('bg-dark-800', 'text-slate-400');
    });
    event.target.classList.add('active', 'bg-primary-600', 'text-white');
    event.target.classList.remove('bg-dark-800', 'text-slate-400');
    
    renderMarket(type);
}

document.getElementById('searchAsset').addEventListener('input', (e) => {
    const query = e.target.value;
    const assets = query ? Market.searchAssets(query) : Market.getAllAssets();
    
    const container = document.getElementById('assetsList');
    if (assets.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-500"><p>No se encontraron activos</p></div>';
    } else {
        renderMarketList(assets);
    }
});

function renderMarketList(assets) {
    const container = document.getElementById('assetsList');
    container.innerHTML = assets.map(asset => {
        const changeClass = asset.change >= 0 ? 'text-green-400' : 'text-red-400';
        const changeSign = asset.change >= 0 ? '+' : '';
        
        return `
            <div onclick="openAssetModal('${asset.id}')" class="glass-light rounded-xl p-3 cursor-pointer hover:bg-slate-700/50 transition-colors">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl">${asset.icon}</div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-sm">${asset.ticker}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-dark-800 text-slate-400">${asset.type.toUpperCase()}</span>
                        </div>
                        <p class="text-xs text-slate-400 truncate">${asset.name}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-sm">${Market.formatPrice(asset.currentPrice)}</p>
                        <p class="text-xs ${changeClass}">${changeSign}${asset.changePercent.toFixed(2)}%</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== ORDER MODAL ====================
function openAssetModal(assetId) {
    currentAsset = Market.getAsset(assetId);
    if (!currentAsset) return;
    
    orderType = 'buy';
    orderQuantity = 1;
    
    document.getElementById('orderTitle').textContent = 'Orden de Compra';
    document.getElementById('orderAssetIcon').textContent = currentAsset.icon;
    document.getElementById('orderAssetName').textContent = currentAsset.name;
    document.getElementById('orderAssetTicker').textContent = currentAsset.ticker;
    document.getElementById('orderAssetPrice').textContent = Market.formatPrice(currentAsset.currentPrice);
    
    const changeClass = currentAsset.change >= 0 ? 'text-green-400' : 'text-red-400';
    const changeSign = currentAsset.change >= 0 ? '+' : '';
    document.getElementById('orderAssetChange').className = `text-xs ${changeClass}`;
    document.getElementById('orderAssetChange').textContent = `${changeSign}${currentAsset.changePercent.toFixed(2)}%`;
    
    document.getElementById('buyBtn').className = 'flex-1 py-2 rounded-lg text-sm font-semibold gradient-success text-white';
    document.getElementById('sellBtn').className = 'flex-1 py-2 rounded-lg text-sm font-semibold text-slate-400';
    
    document.getElementById('aiIntervention').classList.add('hidden');
    AISocratic.clearIntervention();
    
    updateOrderSummary();
    renderOrderChart();
    
    document.getElementById('orderModal').classList.remove('hidden');
    Logger.logAssetView(assetId);
    Missions.updateStats('view');
}

function renderOrderChart() {
    const container = document.getElementById('orderChart');
    const data = Market.getChartData(currentAsset.id, 20);
    if (data.length === 0) return;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    container.innerHTML = data.map((price, i) => {
        const height = ((price - min) / range) * 100;
        const isUp = i > 0 ? data[i] >= data[i-1] : true;
        const color = isUp ? 'bg-green-400' : 'bg-red-400';
        return `<div class="flex-1 ${color} rounded-t-sm transition-all duration-300" style="height:${Math.max(15, height)}%"></div>`;
    }).join('');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.add('hidden');
    currentAsset = null;
    AISocratic.clearIntervention();
}

function setOrderType(type) {
    orderType = type;
    
    if (type === 'buy') {
        document.getElementById('buyBtn').className = 'flex-1 py-2 rounded-lg text-sm font-semibold gradient-success text-white';
        document.getElementById('sellBtn').className = 'flex-1 py-2 rounded-lg text-sm font-semibold text-slate-400';
        document.getElementById('orderTitle').textContent = 'Orden de Compra';
        document.getElementById('confirmOrderBtn').textContent = 'Confirmar Compra';
        document.getElementById('confirmOrderBtn').className = 'w-full gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity';
    } else {
        document.getElementById('sellBtn').className = 'flex-1 py-2 rounded-lg text-sm font-semibold gradient-accent text-white';
        document.getElementById('buyBtn').className = 'flex-1 py-2 rounded-lg text-sm font-semibold text-slate-400';
        document.getElementById('orderTitle').textContent = 'Orden de Venta';
        document.getElementById('confirmOrderBtn').textContent = 'Confirmar Venta';
        document.getElementById('confirmOrderBtn').className = 'w-full gradient-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity';
    }
    
    updateOrderSummary();
}

function adjustQty(delta) {
    orderQuantity = Math.max(1, orderQuantity + delta);
    document.getElementById('orderQty').value = orderQuantity;
    updateOrderSummary();
}

document.getElementById('orderQty').addEventListener('input', (e) => {
    orderQuantity = Math.max(1, parseInt(e.target.value) || 1);
    updateOrderSummary();
});

function updateOrderSummary() {
    if (!currentAsset) return;
    
    const total = currentAsset.currentPrice * orderQuantity;
    const cash = Portfolio.getCash();
    const holding = Portfolio.getHolding(currentAsset.id);
    
    document.getElementById('orderPricePerShare').textContent = Market.formatPrice(currentAsset.currentPrice);
    document.getElementById('orderTotal').textContent = Market.formatPrice(total);
    document.getElementById('orderCashAvail').textContent = Market.formatPrice(cash);
    
    const maxQty = orderType === 'buy' 
        ? Math.floor(cash / currentAsset.currentPrice) 
        : (holding ? holding.quantity : 0);
    
    document.getElementById('confirmOrderBtn').disabled = orderType === 'buy' ? total > cash : !holding || holding.quantity < orderQuantity;
}

function confirmOrder() {
    if (!currentAsset) return;
    
    const intervention = orderType === 'buy' 
        ? AISocratic.checkBuyOrder(currentAsset.id, orderQuantity)
        : AISocratic.checkSellOrder(currentAsset.id, orderQuantity);
    
    if (intervention) {
        showAIIntervention(intervention);
        return;
    }
    
    if (orderType === 'sell') {
        const holding = Portfolio.getHolding(currentAsset.id);
        if (holding) {
            const pl = Portfolio.getHoldingPL(currentAsset.id);
            if (pl.pnl < 0) {
                showSellConfirmation(pl);
                return;
            }
        }
    }
    
    executeOrder();
}

function showSellConfirmation(pl) {
    const pnlClass = pl.pnl >= 0 ? 'text-green-400' : 'text-red-400';
    const pnlSign = pl.pnl >= 0 ? '+' : '';
    const icon = pl.pnl >= 0 ? '📈' : '📉';
    const title = pl.pnl >= 0 ? '¿Vender con ganancia?' : '¿Vender con pérdida?';
    
    const modal = document.createElement('div');
    modal.id = 'sellConfirmModal';
    modal.className = 'fixed inset-0 z-[60]';
    modal.innerHTML = `
        <div class="modal-overlay absolute inset-0" onclick="closeSellConfirm(false)"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="glass rounded-2xl p-6 max-w-sm w-full animate-bounce-in">
                <div class="text-center mb-4">
                    <span class="text-4xl">${icon}</span>
                    <h3 class="text-lg font-bold mt-2">${title}</h3>
                </div>
                <div class="bg-dark-800 rounded-xl p-3 mb-4">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-slate-400">Activo</span>
                        <span class="font-bold">${currentAsset.ticker}</span>
                    </div>
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-slate-400">Cantidad</span>
                        <span>${orderQuantity} títulos</span>
                    </div>
                    <div class="flex justify-between text-sm font-bold">
                        <span>P/L estimado</span>
                        <span class="${pnlClass}">${pnlSign}$${Math.abs(pl.pnl).toFixed(2)} (${pnlSign}${pl.pnlPercent.toFixed(2)}%)</span>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button onclick="closeSellConfirm(false)" class="flex-1 bg-dark-800 text-slate-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-dark-700">
                        Cancelar
                    </button>
                    <button onclick="closeSellConfirm(true)" class="flex-1 ${pl.pnl >= 0 ? 'gradient-success' : 'gradient-accent'} text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                        Confirmar venta
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeSellConfirm(confirmed) {
    const modal = document.getElementById('sellConfirmModal');
    if (modal) modal.remove();
    
    if (confirmed) {
        executeOrder();
    }
}

function showAIIntervention(intervention) {
    const container = document.getElementById('aiIntervention');
    container.classList.remove('hidden');
    document.getElementById('aiPrompt').textContent = intervention.prompt;
    document.getElementById('aiResponse').value = '';
    document.getElementById('aiResponse').focus();
}

function submitAIResponse(withJustification) {
    if (!withJustification) {
        closeOrderModal();
        return;
    }
    
    const response = document.getElementById('aiResponse').value;
    const analysis = AISocratic.analyzeResponse(response);
    
    if (!analysis.valid) {
        showAIToast('Reflexión necesaria', analysis.message);
        return;
    }
    
    const intervention = AISocratic.getPendingIntervention();
    Logger.logAIIntervention(intervention.rule, intervention.prompt, response, 'proceeded');
    
    if (analysis.xpBonus > 0) {
        Gamification.addXP(analysis.xpBonus, 'justified_trade');
    }
    
    if (analysis.quality === 'high') {
        showAIToast('¡Excelente análisis!', analysis.message);
    } else if (analysis.quality === 'medium') {
        showAIToast('Buena reflexión', analysis.message);
    }
    
    AISocratic.clearIntervention();
    executeOrder(response);
}

function executeOrder(aiResponse = null) {
    if (!currentAsset) return;
    
    const aiData = aiResponse ? { rule: 'manual', prompt: '', response: aiResponse } : null;
    
    let result;
    if (orderType === 'buy') {
        result = Portfolio.buyAsset(currentAsset.id, orderQuantity, aiData);
    } else {
        result = Portfolio.sellAsset(currentAsset.id, orderQuantity, aiData);
    }
    
    if (result.success) {
        // Play sound and animation
        if (orderType === 'buy') {
            Sounds.buy();
            Animations.buySuccess();
            Missions.updateStats('buy');
        } else {
            if (result.pnl > 0) {
                Sounds.sellWin();
                Animations.sellWin(result.pnl);
            } else {
                Sounds.sellLoss();
                Animations.sellLoss(result.pnl || 0);
            }
            Missions.updateStats('sell', { pnl: result.pnl });
        }
        
        // Track justified response
        if (aiResponse) {
            const analysis = AISocratic.analyzeResponse(aiResponse);
            if (analysis.type === 'technical') {
                Gamification.addXP(XP_REWARDS.justified, 'justified');
                Missions.updateStats('justify');
            }
        }
        
        const xpSource = orderType === 'buy' ? 'buy_trade' : 'sell_trade';
        const xpAmount = orderType === 'buy' ? XP_REWARDS.buy : XP_REWARDS.sell;
        const xpResult = Gamification.addXP(xpAmount, xpSource);
        
        Animations.xpGain(xpAmount);
        Sounds.xpGain();
        
        // Check for level up
        if (xpResult.leveledUp) {
            setTimeout(() => {
                Animations.levelUp();
                Sounds.levelUp();
                Notifications.notifyLevelUp(Gamification.getLevel());
            }, 1000);
        }
        
        // Check achievements
        const portfolioStats = Portfolio.getTradeStats();
        const gamStats = Gamification.getStats();
        const newAchievements = Gamification.checkAchievements({
            ...portfolioStats,
            ...gamStats,
            uniqueAssets: Object.keys(Portfolio.getHoldings()).length,
            maxProfit: Portfolio.getTotalPL() > 0 ? Portfolio.getTotalPL() : 0
        });
        
        if (newAchievements.length > 0) {
            newAchievements.forEach((achievement, i) => {
                setTimeout(() => {
                    showAchievementPopup(achievement);
                    Animations.achievementUnlocked();
                    Sounds.achievement();
                    Notifications.notifyAchievement(achievement);
                }, 1500 + (i * 500));
            });
        }
        
        // Check mission completions
        const newMissions = Missions.checkMissionCompletion();
        if (newMissions.length > 0) {
            newMissions.forEach((mission, i) => {
                setTimeout(() => {
                    Sounds.missionComplete();
                    Notifications.notifyMissionComplete(mission);
                    showAIToast('🎯 ¡Misión completada!', `${mission.desc} → +${mission.reward} XP`);
                    renderMissions();
                }, 2000 + (i * 500));
            });
        }
        
        if (result.pnl !== undefined && result.pnl > 0) {
            setTimeout(() => {
                showAIToast('¡Operación exitosa!', `Ganaste ${Market.formatPrice(result.pnl)} en esta operación.`);
            }, 500);
        }
        
        closeOrderModal();
        updateUI();
        
        if (currentTab === 'portfolio') renderPortfolio();
        if (currentTab === 'market') renderMissions();
    } else {
        Sounds.error();
        showAIToast('Error', result.error);
    }
}

// ==================== PORTFOLIO RENDERING ====================
function renderPortfolio() {
    updatePortfolioSummary();
    renderHoldings();
    renderDiversification();
    renderHistoryPanel();
}

function renderHistoryPanel() {
    const container = document.getElementById('historyPanel');
    if (container) {
        container.innerHTML = History.renderHistoryPanel();
    }
}

// ==================== MISSIONS RENDERING ====================
function renderMissions() {
    const counts = Missions.getCompletedCount();
    const badge = document.getElementById('missionsBadge');
    
    if (badge) {
        const total = counts.daily + counts.weekly;
        if (total > 0) {
            badge.textContent = total;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function showMissionsModal() {
    const modal = document.getElementById('missionsModal');
    const content = document.getElementById('missionsModalContent');
    
    if (content) {
        content.innerHTML = Missions.renderMissionsPanel();
    }
    
    modal.classList.remove('hidden');
    Sounds.click();
}

function closeMissionsModal() {
    document.getElementById('missionsModal').classList.add('hidden');
}

function updatePortfolioSummary() {
    document.getElementById('cashBalance').textContent = Market.formatPrice(Portfolio.getCash());
    document.getElementById('holdingsValue').textContent = Market.formatPrice(Portfolio.getHoldingsValue());
    
    const totalPL = Portfolio.getTotalPL();
    const plClass = totalPL >= 0 ? 'text-green-400' : 'text-red-400';
    const plSign = totalPL >= 0 ? '+' : '';
    document.getElementById('totalPL').className = `text-lg font-bold ${plClass}`;
    document.getElementById('totalPL').textContent = `${plSign}${Market.formatPrice(totalPL)}`;
    
    const returnPercent = Portfolio.getTotalPLPercent();
    const retClass = returnPercent >= 0 ? 'text-green-400' : 'text-red-400';
    const retSign = returnPercent >= 0 ? '+' : '';
    document.getElementById('totalReturn').className = `text-lg font-bold ${retClass}`;
    document.getElementById('totalReturn').textContent = `${retSign}${returnPercent.toFixed(2)}%`;
    
    const history = Portfolio.getPortfolioHistory();
    if (history.length >= 2) {
        Charts.createPortfolioChart('portfolioChart', history);
    }
}

function renderHoldings() {
    const holdings = Portfolio.getHoldings();
    const container = document.getElementById('holdingsList');
    
    if (Object.keys(holdings).length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-500">
                <p class="text-3xl mb-2">📭</p>
                <p class="text-sm">No tienes posiciones abiertas</p>
                <p class="text-xs">¡Compra tu primer activo en el Mercado!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = Object.entries(holdings).map(([assetId, holding]) => {
        const asset = Market.getAsset(assetId);
        if (!asset) return '';
        
        const pl = Portfolio.getHoldingPL(assetId);
        const plClass = pl.pnl >= 0 ? 'text-green-400' : 'text-red-400';
        const plSign = pl.pnl >= 0 ? '+' : '';
        const value = asset.currentPrice * holding.quantity;
        
        return `
            <div class="glass-light rounded-xl p-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl">${holding.icon}</div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-sm">${holding.ticker}</span>
                            <span class="text-xs text-slate-400">${holding.quantity} títulos</span>
                        </div>
                        <p class="text-xs text-slate-400">Promedio: ${Market.formatPrice(holding.avgPrice)}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-sm">${Market.formatPrice(value)}</p>
                        <p class="text-xs ${plClass}">${plSign}${Market.formatPrice(pl.pnl)} (${plSign}${pl.pnlPercent.toFixed(2)}%)</p>
                    </div>
                </div>
                <div class="flex gap-2 mt-2">
                    <button onclick="openAssetModal('${assetId}')" class="flex-1 bg-dark-800 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-dark-700">Ver</button>
                    <button onclick="quickSell('${assetId}')" class="flex-1 bg-red-900/30 text-red-400 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-900/50">Vender</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderDiversification() {
    const div = Portfolio.getDiversification();
    document.getElementById('diversificationScore').textContent = `${div.score}%`;
    document.getElementById('diversificationBar').style.width = `${div.score}%`;
    document.getElementById('diversificationTip').textContent = div.tip;
}

function quickSell(assetId) {
    const holding = Portfolio.getHolding(assetId);
    if (holding) {
        openAssetModal(assetId);
        setTimeout(() => setOrderType('sell'), 100);
    }
}

// ==================== COMMUNITY RENDERING ====================
function renderCommunity() {
    renderLeagueCard();
    renderLeaderboard();
    renderFeed();
}

function renderLeagueCard() {
    const league = Gamification.getLeague();
    const rank = Social.getPlayerRank();
    
    document.getElementById('userLeague').textContent = `${league.icon} ${league.name}`;
    document.getElementById('userRank').textContent = `#${rank}`;
    document.getElementById('leagueProgress').style.width = `${league.progress}%`;
    
    if (league.nextLeague) {
        document.getElementById('leagueProgressText').textContent = `${Gamification.formatXP(Gamification.getStats().xp)} / ${Gamification.formatXP(league.nextLeague.xpMin)} XP para subir de liga`;
    } else {
        document.getElementById('leagueProgressText').textContent = '¡Estás en la liga más alta!';
    }
}

function renderLeaderboard() {
    const leaderboard = Social.getLeaderboard();
    const container = document.getElementById('leaderboard');
    
    container.innerHTML = leaderboard.slice(0, 10).map((entry, index) => {
        const isPlayer = entry.isPlayer;
        const bgClass = isPlayer ? 'bg-primary-900/30 border border-primary-600/30' : 'bg-dark-800';
        const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
        
        return `
            <div class="${bgClass} rounded-xl p-3 flex items-center gap-3">
                <span class="text-lg font-bold w-8 text-center">${rankIcon}</span>
                <span class="text-xl">${entry.avatar}</span>
                <div class="flex-1">
                    <p class="text-sm font-semibold ${isPlayer ? 'text-primary-400' : ''}">${entry.name}</p>
                    <p class="text-[10px] text-slate-500">Nivel ${entry.level} • ${entry.league}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold text-yellow-400">${Gamification.formatXP(entry.xp)} XP</p>
                    <p class="text-[10px] text-slate-500">🔥 ${entry.streak}</p>
                </div>
            </div>
        `;
    }).join('');
}

function renderFeed() {
    const posts = Social.getPosts(15);
    const container = document.getElementById('communityFeed');
    
    container.innerHTML = posts.map(post => {
        const timeAgo = Social.getTimeAgo(post.timestamp);
        const changeClass = post.priceChange >= 0 ? 'text-green-400' : 'text-red-400';
        const actionClass = post.action === 'compró' ? 'text-green-400' : 'text-red-400';
        const likeClass = post.liked ? 'text-red-400' : 'text-slate-500';
        
        return `
            <div class="glass-light rounded-xl p-3">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">${post.userAvatar}</span>
                    <div>
                        <p class="text-sm font-semibold">${post.userName}</p>
                        <p class="text-[10px] text-slate-500">Nivel ${post.userLevel} • ${post.userLeague} • ${timeAgo}</p>
                    </div>
                </div>
                <p class="text-sm mb-2">
                    <span class="${actionClass} font-semibold">${post.action}</span>
                    <span class="font-semibold">${post.assetTicker}</span>
                    <span class="text-xs ${changeClass}">(${post.priceChange >= 0 ? '+' : ''}${post.priceChange.toFixed(2)}%)</span>
                </p>
                <p class="text-sm text-slate-300 mb-3">${post.message}</p>
                <div class="flex items-center gap-4">
                    <button onclick="likePost('${post.id}')" class="flex items-center gap-1 ${likeClass} hover:text-red-400 transition-colors">
                        <span>${post.liked ? '❤️' : '🤍'}</span>
                        <span class="text-xs">${post.likes}</span>
                    </button>
                    <span class="text-xs text-slate-500">💬 ${post.comments}</span>
                </div>
            </div>
        `;
    }).join('');
}

function likePost(postId) {
    Social.toggleLike(postId);
    renderFeed();
}

// ==================== PROFILE RENDERING ====================
function renderProfile() {
    const gamStats = Gamification.getStats();
    const level = Gamification.getLevel();
    const portfolioStats = Portfolio.getTradeStats();
    
    document.getElementById('profileName').textContent = UserProfile.data.name || 'Inversor';
    document.getElementById('profileLevel').textContent = `Nivel ${level.level} • ${level.name}`;
    document.getElementById('profileXP').textContent = Gamification.formatXP(gamStats.xp);
    document.getElementById('profileStreak').textContent = gamStats.streak;
    document.getElementById('profileTrades').textContent = portfolioStats.totalTrades;
    
    // Update avatar
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        avatarContainer.className = `w-20 h-20 lg:w-24 lg:h-24 ${UserProfile.data.avatarBg} rounded-full mx-auto flex items-center justify-center mb-3 avatar-container`;
        avatarContainer.querySelector('span').textContent = UserProfile.data.avatar;
    }
    
    renderAchievements();
    renderStats(portfolioStats, gamStats);
}

function renderAchievements() {
    const achievements = Gamification.getAchievements();
    const container = document.getElementById('achievements');
    
    container.innerHTML = achievements.map(a => {
        const bgClass = a.unlocked ? 'bg-yellow-900/30 border border-yellow-600/30' : 'bg-dark-800 opacity-50';
        const iconClass = a.unlocked ? '' : 'grayscale';
        
        return `
            <div class="${bgClass} rounded-xl p-3 text-center" title="${a.name}: ${a.desc}">
                <span class="text-2xl ${iconClass}">${a.icon}</span>
                <p class="text-[8px] text-slate-400 mt-1 truncate">${a.name}</p>
            </div>
        `;
    }).join('');
}

function renderStats(portfolioStats, gamStats) {
    document.getElementById('statTotalTrades').textContent = portfolioStats.totalTrades;
    document.getElementById('statJustified').textContent = `${portfolioStats.justificationRate}%`;
    
    const bestTrade = portfolioStats.bestTrade;
    document.getElementById('statBestTrade').textContent = bestTrade > 0 ? `+${Market.formatPrice(bestTrade)}` : '--';
    
    const worstTrade = portfolioStats.worstTrade;
    document.getElementById('statWorstTrade').textContent = worstTrade < 0 ? Market.formatPrice(worstTrade) : '--';
    
    document.getElementById('statAvgHold').textContent = portfolioStats.avgHoldTime > 0 
        ? Portfolio.formatHoldTime(portfolioStats.avgHoldTime) 
        : '--';
}

// ==================== UI UPDATES ====================
function updateUI() {
    updateHeaderStats();
    checkMonthlyReset();
}

function updateHeaderStats() {
    const totalCapital = Portfolio.getTotalCapital();
    document.getElementById('totalCapital').textContent = Market.formatPrice(totalCapital);
    
    const sidebarCapital = document.getElementById('sidebarCapital');
    if (sidebarCapital) sidebarCapital.textContent = Market.formatPrice(totalCapital);
    
    const totalPL = Portfolio.getTotalPL();
    const plClass = totalPL >= 0 ? 'text-green-400' : 'text-red-400';
    const plSign = totalPL >= 0 ? '+' : '';
    document.getElementById('todayPL').className = `text-lg font-bold ${plClass}`;
    document.getElementById('todayPL').textContent = `${plSign}${Market.formatPrice(totalPL)}`;
    
    const sidebarPL = document.getElementById('sidebarPL');
    if (sidebarPL) {
        sidebarPL.className = `text-sm font-bold ${plClass} mt-1`;
        sidebarPL.textContent = `P/L: ${plSign}${Market.formatPrice(totalPL)}`;
    }
    
    const gamStats = Gamification.getStats();
    document.getElementById('streakCount').textContent = gamStats.streak;
    document.getElementById('totalXP').textContent = Gamification.formatXP(gamStats.xp);
    
    const sidebarStreakCount = document.getElementById('sidebarStreakCount');
    if (sidebarStreakCount) sidebarStreakCount.textContent = gamStats.streak;
    const sidebarXP = document.getElementById('sidebarXP');
    if (sidebarXP) sidebarXP.textContent = Gamification.formatXP(gamStats.xp);
    
    const level = Gamification.getLevel();
    document.getElementById('userLevel').textContent = level.name;
    
    const sidebarLevelText = document.getElementById('sidebarLevelText');
    if (sidebarLevelText) sidebarLevelText.textContent = level.name;
    
    // Update theme toggle icon if exists
    const themeIcon = document.getElementById('themeToggleIcon');
    if (themeIcon) themeIcon.textContent = UserProfile.data.theme === 'dark' ? '☀️' : '🌙';
}

function checkMonthlyReset() {
    if (Portfolio.checkMonthlyReset()) {
        showMonthlyModal();
    }
}

function showMonthlyModal() {
    const report = Portfolio.executeMonthlyReset();
    const league = Gamification.getLeague();
    
    document.getElementById('monthlyCapital').textContent = Market.formatPrice(report.endCapital);
    
    const retClass = report.returnPercent >= 0 ? 'text-green-400' : 'text-red-400';
    const retSign = report.returnPercent >= 0 ? '+' : '';
    document.getElementById('monthlyReturn').className = `font-bold ${retClass}`;
    document.getElementById('monthlyReturn').textContent = `${retSign}${report.returnPercent}%`;
    
    document.getElementById('monthlyTrades').textContent = report.trades;
    document.getElementById('monthlyJustified').textContent = `${report.justifiedRate}%`;
    
    document.getElementById('monthlyLeagueChange').classList.remove('hidden');
    document.getElementById('monthlyLeagueText').textContent = `${league.icon} ${league.name}`;
    
    document.getElementById('monthlyModal').classList.remove('hidden');
}

function closeMonthlyModal() {
    document.getElementById('monthlyModal').classList.add('hidden');
    Social.reset();
    updateUI();
}

// ==================== POPUPS & TOASTS ====================
function showXPPopup(amount) {
    const popup = document.getElementById('xpPopup');
    document.getElementById('xpAmount').textContent = `+${amount} XP`;
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 1500);
}

function showAchievementPopup(achievement) {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementIcon').textContent = achievement.icon;
    document.getElementById('achievementTitle').textContent = `¡${achievement.name}!`;
    document.getElementById('achievementDesc').textContent = achievement.desc;
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 3000);
}

function showAIToast(title, message) {
    const toast = document.getElementById('aiToast');
    document.getElementById('aiToastTitle').textContent = title;
    document.getElementById('aiToastMsg').textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        hideAIToast();
    }, 5000);
}

function hideAIToast() {
    document.getElementById('aiToast').classList.add('hidden');
}

// ==================== DEPOSIT NOTIFICATION ====================
function showDepositNotification(amount) {
    Animations.confetti(['#10b981', '#059669', '#34d399', '#6ee7b7', '#eab308'], 50);
    Sounds.deposit();
    Notifications.notifyDeposit(amount);
    
    const notif = document.getElementById('depositNotif');
    if (notif) {
        notif.querySelector('.text-green-400.font-bold').textContent = `+$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
        notif.classList.remove('hidden');
        setTimeout(() => notif.classList.add('hidden'), 5000);
    }
    
    Logger.logEvent('weekly_deposit', { amount });
}

// ==================== EXPORT & RESET ====================
function exportLogs() {
    const data = Logger.exportJSON();
    showAIToast('Datos exportados', `Se exportaron ${data.logs.length} registros. Revisa tu carpeta de descargas.`);
}

function resetSimulation() {
    if (confirm('¿Estás seguro de reiniciar la simulación? Se perderán todos los datos.')) {
        Logger.logSessionEnd();
        
        Market.reset();
        Portfolio.reset();
        Gamification.reset();
        AISocratic.reset();
        Social.reset();
        History.reset();
        Missions.reset();
        Logger.clearLogs();
        Logger.init();
        
        updateUI();
        renderMissions();
        switchTab('market');
        
        Sounds.notification();
        showAIToast('Simulación reiniciada', 'Comienzas de nuevo con $10,000 MXN virtuales.');
    }
}

// ==================== PROFILE EDITING ====================
function showEditProfileModal() {
    const avatars = ['🦅', '👨‍💼', '👩‍💼', '🧑‍💼', '😎', '🤑', '📈', '💎', '🦁', '🐯', '🦊', '🐺', '🦈', '🐉', '👑', '⭐'];
    const backgrounds = [
        { id: 'gradient-primary', label: 'Azul', class: 'gradient-primary' },
        { id: 'gradient-accent', label: 'Naranja', class: 'gradient-accent' },
        { id: 'gradient-success', label: 'Verde', class: 'gradient-success' },
        { id: 'bg-purple-600', label: 'Púrpura', class: 'bg-purple-600' },
        { id: 'bg-pink-600', label: 'Rosa', class: 'bg-pink-600' },
        { id: 'bg-amber-600', label: 'Dorado', class: 'bg-amber-600' },
        { id: 'bg-cyan-600', label: 'Cian', class: 'bg-cyan-600' },
        { id: 'bg-red-600', label: 'Rojo', class: 'bg-red-600' }
    ];

    const modal = document.createElement('div');
    modal.id = 'editProfileModal';
    modal.className = 'fixed inset-0 z-50';
    modal.innerHTML = `
        <div class="modal-overlay absolute inset-0" onclick="closeEditProfile()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="glass rounded-2xl p-6 max-w-md w-full animate-bounce-in max-h-[85vh] overflow-y-auto scrollbar-hide">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold">✏️ Editar Perfil</h3>
                    <button onclick="closeEditProfile()" class="text-slate-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <!-- Current Preview -->
                <div class="text-center mb-6">
                    <div id="previewAvatarBg" class="w-24 h-24 ${UserProfile.data.avatarBg} rounded-full mx-auto flex items-center justify-center mb-3 ring-4 ring-slate-700">
                        <span id="previewAvatar" class="text-4xl">${UserProfile.data.avatar}</span>
                    </div>
                    <p id="previewName" class="font-bold text-lg">${UserProfile.data.name || 'Inversor'}</p>
                </div>
                
                <!-- Name Input -->
                <div class="mb-4">
                    <label class="text-sm text-slate-400 mb-1 block">Nombre</label>
                    <input type="text" id="editNameInput" value="${UserProfile.data.name}" maxlength="20" 
                        class="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                        oninput="document.getElementById('previewName').textContent = this.value || 'Inversor'">
                </div>
                
                <!-- Avatar Selection -->
                <div class="mb-4">
                    <label class="text-sm text-slate-400 mb-2 block">Avatar</label>
                    <div class="grid grid-cols-8 gap-2">
                        ${avatars.map(a => `
                            <button onclick="selectAvatar('${a}')" class="avatar-option w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl hover:bg-dark-700 transition-colors ${UserProfile.data.avatar === a ? 'ring-2 ring-primary-500 bg-dark-700' : ''}" data-avatar="${a}">
                                ${a}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Background Selection -->
                <div class="mb-6">
                    <label class="text-sm text-slate-400 mb-2 block">Fondo del avatar</label>
                    <div class="grid grid-cols-4 gap-2">
                        ${backgrounds.map(bg => `
                            <button onclick="selectAvatarBg('${bg.id}')" class="bg-option h-12 rounded-xl flex items-center justify-center text-white text-xs font-semibold hover:opacity-80 transition-opacity ${bg.class} ${UserProfile.data.avatarBg === bg.id ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-900' : ''}" data-bg="${bg.id}">
                                ${bg.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Theme Toggle -->
                <div class="mb-6">
                    <label class="text-sm text-slate-400 mb-2 block">Tema de la aplicación</label>
                    <div class="flex bg-dark-800 rounded-xl p-1">
                        <button onclick="selectTheme('dark')" id="darkThemeBtn" class="flex-1 py-2 rounded-lg text-sm font-semibold ${UserProfile.data.theme === 'dark' ? 'gradient-primary text-white' : 'text-slate-400'}">
                            🌙 Oscuro
                        </button>
                        <button onclick="selectTheme('light')" id="lightThemeBtn" class="flex-1 py-2 rounded-lg text-sm font-semibold ${UserProfile.data.theme === 'light' ? 'gradient-primary text-white' : 'text-slate-400'}">
                            ☀️ Claro
                        </button>
                    </div>
                </div>
                
                <!-- Save Button -->
                <button onclick="saveProfile()" class="w-full gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    Guardar Cambios
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectAvatar(avatar) {
    UserProfile.data.avatar = avatar;
    document.getElementById('previewAvatar').textContent = avatar;
    
    document.querySelectorAll('.avatar-option').forEach(el => {
        el.classList.toggle('ring-2', el.dataset.avatar === avatar);
        el.classList.toggle('ring-primary-500', el.dataset.avatar === avatar);
        el.classList.toggle('bg-dark-700', el.dataset.avatar === avatar);
    });
}

function selectAvatarBg(bgId) {
    UserProfile.data.avatarBg = bgId;
    document.getElementById('previewAvatarBg').className = `w-24 h-24 ${bgId} rounded-full mx-auto flex items-center justify-center mb-3 ring-4 ring-slate-700`;
    
    document.querySelectorAll('.bg-option').forEach(el => {
        el.classList.toggle('ring-2', el.dataset.bg === bgId);
        el.classList.toggle('ring-white', el.dataset.bg === bgId);
        el.classList.toggle('ring-offset-2', el.dataset.bg === bgId);
        el.classList.toggle('ring-offset-dark-900', el.dataset.bg === bgId);
    });
}

function selectTheme(theme) {
    UserProfile.data.theme = theme;
    
    document.getElementById('darkThemeBtn').className = `flex-1 py-2 rounded-lg text-sm font-semibold ${theme === 'dark' ? 'gradient-primary text-white' : 'text-slate-400'}`;
    document.getElementById('lightThemeBtn').className = `flex-1 py-2 rounded-lg text-sm font-semibold ${theme === 'light' ? 'gradient-primary text-white' : 'text-slate-400'}`;
    
    applyTheme(theme);
}

function saveProfile() {
    const name = document.getElementById('editNameInput').value.trim();
    UserProfile.setName(name || 'Inversor');
    UserProfile.save();
    
    closeEditProfile();
    updateUI();
    renderProfile();
    
    showAIToast('Perfil actualizado', 'Tus cambios han sido guardados.');
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.remove();
}

// ==================== NOTIFICATION SETTINGS ====================
function loadNotificationSettings() {
    const settings = Notifications.getSettings();
    
    const streakCheck = document.getElementById('notifStreak');
    const depositCheck = document.getElementById('notifDeposit');
    const missionCheck = document.getElementById('notifMission');
    const soundCheck = document.getElementById('soundToggle');
    
    if (streakCheck) streakCheck.checked = settings.streakReminder;
    if (depositCheck) depositCheck.checked = settings.depositNotify;
    if (missionCheck) missionCheck.checked = settings.missionNotify;
    if (soundCheck) soundCheck.checked = settings.soundEnabled !== false;
    
    // Add event listeners
    if (streakCheck) streakCheck.addEventListener('change', (e) => {
        Notifications.updateSettings({ streakReminder: e.target.checked });
    });
    if (depositCheck) depositCheck.addEventListener('change', (e) => {
        Notifications.updateSettings({ depositNotify: e.target.checked });
    });
    if (missionCheck) missionCheck.addEventListener('change', (e) => {
        Notifications.updateSettings({ missionNotify: e.target.checked });
    });
    if (soundCheck) soundCheck.addEventListener('change', (e) => {
        Sounds.setEnabled(e.target.checked);
        Animations.setEnabled(e.target.checked);
        Notifications.updateSettings({ soundEnabled: e.target.checked });
    });
}

async function requestNotificationPermission() {
    const granted = await Notifications.requestPermission();
    if (granted) {
        showAIToast('🔔 Notificaciones activadas', 'Recibirás recordatorios de racha y depósitos.');
        Sounds.notification();
    } else {
        showAIToast('⚠️ Permiso denegado', 'Activa las notificaciones en la configuración de tu navegador.');
    }
}

// ==================== CLEANUP ====================
window.addEventListener('beforeunload', () => {
    Logger.logSessionEnd();
    if (marketUpdateTimer) clearInterval(marketUpdateTimer);
    if (feedUpdateTimer) clearInterval(feedUpdateTimer);
    if (snapshotTimer) clearInterval(snapshotTimer);
    Market.destroy();
    Notifications.stop();
});
