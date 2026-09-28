// Charts Module - Gráficas mejoradas con Chart.js
const Charts = (() => {
    const chartInstances = {};
    const chartColors = {
        primary: '#3b82f6',
        primaryLight: 'rgba(59, 130, 246, 0.2)',
        success: '#10b981',
        successLight: 'rgba(16, 185, 129, 0.2)',
        danger: '#ef4444',
        dangerLight: 'rgba(239, 68, 68, 0.2)',
        warning: '#f59e0b',
        purple: '#8b5cf6',
        slate: '#64748b'
    };
    
    let chartJsAvailable = false;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#e2e8f0',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(148, 163, 184, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return '$' + context.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 });
                    }
                }
            }
        },
        scales: {
            x: {
                display: false,
                grid: { display: false }
            },
            y: {
                display: false,
                grid: { display: false }
            }
        }
    };

    function init() {
        chartJsAvailable = typeof Chart !== 'undefined';
        if (chartJsAvailable) {
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = '#94a3b8';
        } else {
            console.warn('Charts: Chart.js no disponible, usando fallback CSS');
        }
    }

    function destroyChart(id) {
        if (chartInstances[id]) {
            chartInstances[id].destroy();
            delete chartInstances[id];
        }
    }

    function createCSSFallback(canvasId, data, isPositive) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const parent = canvas.parentElement;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        const color = isPositive ? '#10b981' : '#ef4444';
        const bars = data.map((val, i) => {
            const height = ((val - min) / range) * 100;
            return `<div class="flex-1 rounded-t-sm transition-all" style="height:${Math.max(10, height)}%; background:${color}; opacity:${0.5 + (i/data.length) * 0.5}"></div>`;
        }).join('');
        
        canvas.style.display = 'none';
        let fallback = parent.querySelector('.chart-fallback');
        if (!fallback) {
            fallback = document.createElement('div');
            fallback.className = 'chart-fallback flex items-end gap-px w-full';
            fallback.style.height = '100%';
            parent.appendChild(fallback);
        }
        fallback.innerHTML = bars;
    }

    function createPortfolioChart(canvasId, history) {
        destroyChart(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas || history.length < 2) return;

        const data = history.map(h => h.capital);
        const isPositive = data[data.length - 1] >= data[0];

        if (!chartJsAvailable) {
            createCSSFallback(canvasId, data, isPositive);
            return;
        }

        const ctx = canvas.getContext('2d');
        const labels = history.map((_, i) => i);

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, isPositive ? chartColors.successLight : chartColors.dangerLight);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data,
                    borderColor: isPositive ? chartColors.success : chartColors.danger,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: isPositive ? chartColors.success : chartColors.danger
                }]
            },
            options: {
                ...defaultOptions,
                plugins: {
                    ...defaultOptions.plugins,
                    tooltip: {
                        ...defaultOptions.plugins.tooltip,
                        callbacks: {
                            title: (items) => 'Punto ' + (items[0].dataIndex + 1),
                            label: (context) => 'Capital: $' + context.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 })
                        }
                    }
                }
            }
        });
    }

    function createAssetChart(canvasId, prices, assetName) {
        destroyChart(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas || prices.length < 2) return;

        const ctx = canvas.getContext('2d');
        const labels = prices.map((_, i) => i);
        const isPositive = prices[prices.length - 1] >= prices[0];

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data: prices,
                    borderColor: isPositive ? chartColors.success : chartColors.danger,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: isPositive ? chartColors.success : chartColors.danger
                }]
            },
            options: {
                ...defaultOptions,
                plugins: {
                    ...defaultOptions.plugins,
                    tooltip: {
                        ...defaultOptions.plugins.tooltip,
                        callbacks: {
                            title: () => assetName || '',
                            label: (context) => '$' + context.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 })
                        }
                    }
                }
            }
        });
    }

    function createDistributionChart(canvasId, holdings) {
        destroyChart(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas || Object.keys(holdings).length === 0) return;

        const ctx = canvas.getContext('2d');
        const labels = [];
        const data = [];
        const colors = [
            chartColors.primary, chartColors.success, chartColors.warning,
            chartColors.purple, chartColors.danger, chartColors.slate,
            '#06b6d4', '#ec4899', '#14b8a6', '#f97316'
        ];

        Object.entries(holdings).forEach(([assetId, holding]) => {
            const asset = Market.getAsset(assetId);
            if (asset) {
                labels.push(holding.ticker);
                data.push(asset.currentPrice * holding.quantity);
            }
        });

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors.slice(0, data.length),
                    borderColor: '#0f172a',
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            padding: 12,
                            usePointStyle: true,
                            pointStyleWidth: 8
                        }
                    },
                    tooltip: {
                        ...defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: $${context.parsed.toLocaleString('es-MX', { minimumFractionDigits: 2 })} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function createPnLBarChart(canvasId, trades) {
        destroyChart(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const sellTrades = trades.filter(t => t.action === 'sell' && t.pnl !== undefined).slice(-10);
        if (sellTrades.length === 0) return;

        const ctx = canvas.getContext('2d');
        const labels = sellTrades.map(t => t.ticker);
        const data = sellTrades.map(t => t.pnl);
        const bgColors = data.map(v => v >= 0 ? chartColors.success : chartColors.danger);

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: bgColors,
                    borderRadius: 4,
                    maxBarThickness: 40
                }]
            },
            options: {
                ...defaultOptions,
                plugins: {
                    ...defaultOptions.plugins,
                    tooltip: {
                        ...defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const sign = context.parsed.y >= 0 ? '+' : '';
                                return `P/L: ${sign}$${context.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
                            }
                        }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function createXPProgressChart(canvasId) {
        destroyChart(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const level = Gamification.getLevel();
        const progress = level.progress;

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [progress, 100 - progress],
                    backgroundColor: [chartColors.primary, 'rgba(30, 41, 59, 0.5)'],
                    borderWidth: 0,
                    hoverOffset: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    function updateCharts() {
        const portfolioHistory = Portfolio.getPortfolioHistory();
        if (portfolioHistory.length >= 2) {
            createPortfolioChart('portfolioChart', portfolioHistory);
        }

        const trades = Portfolio.getTrades();
        if (trades.length > 0) {
            createPnLBarChart('pnlChart', trades);
        }

        const holdings = Portfolio.getHoldings();
        if (Object.keys(holdings).length > 0) {
            createDistributionChart('distributionChart', holdings);
        }
    }

    function destroyAll() {
        Object.keys(chartInstances).forEach(id => destroyChart(id));
    }

    return {
        init,
        createPortfolioChart,
        createAssetChart,
        createDistributionChart,
        createPnLBarChart,
        createXPProgressChart,
        updateCharts,
        destroyChart,
        destroyAll
    };
})();
