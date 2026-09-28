// History Module - Historial de operaciones con filtros y búsqueda
const History = (() => {
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'date-desc';

    function init() {
        // Module initialization
    }

    function getFilteredTrades() {
        let trades = Portfolio.getTrades();
        
        if (currentFilter === 'buy') {
            trades = trades.filter(t => t.action === 'buy');
        } else if (currentFilter === 'sell') {
            trades = trades.filter(t => t.action === 'sell');
        } else if (currentFilter === 'profitable') {
            trades = trades.filter(t => t.action === 'sell' && t.pnl > 0);
        } else if (currentFilter === 'losing') {
            trades = trades.filter(t => t.action === 'sell' && t.pnl < 0);
        } else if (currentFilter === 'justified') {
            trades = trades.filter(t => t.aiIntervention && t.aiIntervention.response);
        }
        
        if (currentSearch) {
            const query = currentSearch.toLowerCase();
            trades = trades.filter(t => 
                t.ticker.toLowerCase().includes(query) || 
                t.name.toLowerCase().includes(query)
            );
        }
        
        switch (currentSort) {
            case 'date-asc':
                trades.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'date-desc':
                trades.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'amount-asc':
                trades.sort((a, b) => a.total - b.total);
                break;
            case 'amount-desc':
                trades.sort((a, b) => b.total - a.total);
                break;
            case 'pnl-desc':
                trades = trades.filter(t => t.pnl !== undefined);
                trades.sort((a, b) => (b.pnl || 0) - (a.pnl || 0));
                break;
        }
        
        return trades;
    }

    function setFilter(filter) {
        currentFilter = filter;
    }

    function setSearch(query) {
        currentSearch = query;
    }

    function setSort(sort) {
        currentSort = sort;
    }

    function renderHistoryPanel() {
        const trades = getFilteredTrades();
        const allTrades = Portfolio.getTrades();
        
        const stats = {
            total: allTrades.length,
            buys: allTrades.filter(t => t.action === 'buy').length,
            sells: allTrades.filter(t => t.action === 'sell').length,
            profitable: allTrades.filter(t => t.action === 'sell' && t.pnl > 0).length,
            losing: allTrades.filter(t => t.action === 'sell' && t.pnl < 0).length
        };

        return `
            <div class="space-y-4">
                <!-- Stats Summary -->
                <div class="grid grid-cols-5 gap-2">
                    <button onclick="History.applyFilter('all')" class="filter-stat glass-light rounded-xl p-2 text-center ${currentFilter === 'all' ? 'ring-2 ring-primary-500' : ''}">
                        <p class="text-lg font-bold">${stats.total}</p>
                        <p class="text-[9px] text-slate-500">Total</p>
                    </button>
                    <button onclick="History.applyFilter('buy')" class="filter-stat glass-light rounded-xl p-2 text-center ${currentFilter === 'buy' ? 'ring-2 ring-green-500' : ''}">
                        <p class="text-lg font-bold text-green-400">${stats.buys}</p>
                        <p class="text-[9px] text-slate-500">Compras</p>
                    </button>
                    <button onclick="History.applyFilter('sell')" class="filter-stat glass-light rounded-xl p-2 text-center ${currentFilter === 'sell' ? 'ring-2 ring-red-500' : ''}">
                        <p class="text-lg font-bold text-red-400">${stats.sells}</p>
                        <p class="text-[9px] text-slate-500">Ventas</p>
                    </button>
                    <button onclick="History.applyFilter('profitable')" class="filter-stat glass-light rounded-xl p-2 text-center ${currentFilter === 'profitable' ? 'ring-2 ring-emerald-500' : ''}">
                        <p class="text-lg font-bold text-emerald-400">${stats.profitable}</p>
                        <p class="text-[9px] text-slate-500">Ganadas</p>
                    </button>
                    <button onclick="History.applyFilter('justified')" class="filter-stat glass-light rounded-xl p-2 text-center ${currentFilter === 'justified' ? 'ring-2 ring-amber-500' : ''}">
                        <p class="text-lg font-bold text-amber-400">${allTrades.filter(t => t.aiIntervention && t.aiIntervention.response).length}</p>
                        <p class="text-[9px] text-slate-500">Justificadas</p>
                    </button>
                </div>
                
                <!-- Search & Sort -->
                <div class="flex gap-2">
                    <div class="relative flex-1">
                        <input type="text" id="historySearch" placeholder="Buscar por ticker o nombre..." oninput="History.search(this.value)" class="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2 pl-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <select id="historySort" onchange="History.changeSort(this.value)" class="bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500">
                        <option value="date-desc">Más recientes</option>
                        <option value="date-asc">Más antiguos</option>
                        <option value="amount-desc">Mayor monto</option>
                        <option value="amount-asc">Menor monto</option>
                        <option value="pnl-desc">Mejor P/L</option>
                    </select>
                </div>
                
                <!-- Trades List -->
                <div id="tradesList" class="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                    ${renderTradesList(trades)}
                </div>
            </div>
        `;
    }

    function renderTradesList(trades) {
        if (trades.length === 0) {
            return `
                <div class="text-center py-8 text-slate-500">
                    <p class="text-3xl mb-2">📋</p>
                    <p class="text-sm">No hay operaciones</p>
                    <p class="text-xs">${currentFilter !== 'all' ? 'Intenta con otro filtro' : '¡Ejecuta tu primera orden!'}</p>
                </div>
            `;
        }

        return trades.map(trade => {
            const isBuy = trade.action === 'buy';
            const actionIcon = isBuy ? '🟢' : '🔴';
            const actionText = isBuy ? 'Compra' : 'Venta';
            const actionClass = isBuy ? 'text-green-400' : 'text-red-400';
            const date = new Date(trade.timestamp);
            const timeStr = date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) + ' ' + date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            
            let pnlHtml = '';
            if (trade.pnl !== undefined) {
                const pnlClass = trade.pnl >= 0 ? 'text-green-400' : 'text-red-400';
                const pnlSign = trade.pnl >= 0 ? '+' : '';
                pnlHtml = `<span class="${pnlClass} text-xs font-bold">${pnlSign}$${trade.pnl.toFixed(2)}</span>`;
            }

            let justifiedBadge = '';
            if (trade.aiIntervention && trade.aiIntervention.response) {
                justifiedBadge = '<span class="text-[9px] bg-amber-900/30 text-amber-400 px-1.5 py-0.5 rounded-full">🧠 Justificada</span>';
            }

            return `
                <div class="glass-light rounded-xl p-3 cursor-pointer hover:bg-slate-700/50 transition-colors" onclick="History.showTradeDetail('${trade.id}')">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center">
                            ${actionIcon}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-sm">${trade.ticker}</span>
                                <span class="${actionClass} text-xs">${actionText}</span>
                                ${justifiedBadge}
                            </div>
                            <p class="text-xs text-slate-500 truncate">${trade.name} • ${trade.quantity} títulos</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-bold">$${trade.total.toFixed(2)}</p>
                            ${pnlHtml}
                            <p class="text-[10px] text-slate-600">${timeStr}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function applyFilter(filter) {
        currentFilter = filter;
        refreshList();
    }

    function search(query) {
        currentSearch = query;
        refreshList();
    }

    function changeSort(sort) {
        currentSort = sort;
        refreshList();
    }

    function refreshList() {
        const trades = getFilteredTrades();
        const list = document.getElementById('tradesList');
        if (list) {
            list.innerHTML = renderTradesList(trades);
        }
        
        document.querySelectorAll('.filter-stat').forEach(el => {
            el.classList.remove('ring-2', 'ring-primary-500', 'ring-green-500', 'ring-red-500', 'ring-emerald-500', 'ring-amber-500');
        });
    }

    function showTradeDetail(tradeId) {
        const trades = Portfolio.getTrades();
        const trade = trades.find(t => t.id === tradeId);
        if (!trade) return;

        const date = new Date(trade.timestamp);
        const dateStr = date.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const isBuy = trade.action === 'buy';

        const modal = document.createElement('div');
        modal.id = 'tradeDetailModal';
        modal.className = 'fixed inset-0 z-50';
        modal.innerHTML = `
            <div class="modal-overlay absolute inset-0" onclick="History.closeDetail()"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="glass rounded-2xl p-6 max-w-sm w-full animate-bounce-in">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold">Detalle de Operación</h3>
                        <button onclick="History.closeDetail()" class="text-slate-400 hover:text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <div class="text-center mb-4">
                        <span class="text-4xl">${isBuy ? '🟢' : '🔴'}</span>
                        <p class="font-bold text-xl mt-2">${isBuy ? 'Compra' : 'Venta'} de ${trade.ticker}</p>
                        <p class="text-sm text-slate-400">${trade.name}</p>
                    </div>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Fecha</span>
                            <span>${dateStr}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Hora</span>
                            <span>${timeStr}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Cantidad</span>
                            <span>${trade.quantity} títulos</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Precio unitario</span>
                            <span>$${trade.price.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between text-sm font-bold">
                            <span>Total</span>
                            <span>$${trade.total.toFixed(2)}</span>
                        </div>
                        ${trade.pnl !== undefined ? `
                        <div class="flex justify-between text-sm font-bold border-t border-slate-700 pt-2">
                            <span>P/L</span>
                            <span class="${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}">
                                ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)} (${trade.pnlPercent >= 0 ? '+' : ''}${trade.pnlPercent.toFixed(2)}%)
                            </span>
                        </div>
                        ` : ''}
                        ${trade.holdTime ? `
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Tiempo de retención</span>
                            <span>${Portfolio.formatHoldTime(trade.holdTime)}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${trade.aiIntervention ? `
                    <div class="bg-amber-900/20 border border-amber-600/30 rounded-xl p-3">
                        <p class="text-xs font-semibold text-amber-400 mb-1">🤖 Intervención IA</p>
                        <p class="text-xs text-slate-300 mb-2">${trade.aiIntervention.prompt || 'Sin prompt'}</p>
                        ${trade.aiIntervention.response ? `
                        <p class="text-xs text-white bg-dark-800 rounded-lg p-2">
                            <span class="text-slate-500">Tu respuesta:</span><br>
                            "${trade.aiIntervention.response}"
                        </p>
                        ` : '<p class="text-xs text-slate-500">Sin justificación</p>'}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function closeDetail() {
        const modal = document.getElementById('tradeDetailModal');
        if (modal) modal.remove();
    }

    function reset() {
        currentFilter = 'all';
        currentSearch = '';
        currentSort = 'date-desc';
    }

    return {
        init,
        getFilteredTrades,
        renderHistoryPanel,
        applyFilter,
        search,
        changeSort,
        showTradeDetail,
        closeDetail,
        reset
    };
})();
