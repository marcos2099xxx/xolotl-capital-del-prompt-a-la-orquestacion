// Social Module - Feed comunitario y leaderboard simulado
const Social = (() => {
    const STORAGE_KEY = 'xolotl_social';
    
    let posts = [];
    let leaderboard = [];

    function init() {
        loadState();
        if (posts.length === 0) {
            generateInitialPosts();
        }
        updateLeaderboard();
    }

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const saved = JSON.parse(stored);
                posts = saved.posts || [];
                leaderboard = saved.leaderboard || [];
            }
        } catch {
            posts = [];
            leaderboard = [];
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts, leaderboard }));
        } catch (e) {
            console.warn('Social: No se pudo guardar estado', e);
        }
    }

    function generateInitialPosts() {
        const postTemplates = [
            { action: 'compró', asset: 'AMXB', message: 'América Móvil sigue fuerte. ¡Largo plazo! 📱' },
            { action: 'vendió', asset: 'CEMEXCPO', message: 'Tomé ganancias en CEMEX. +12% en 2 semanas 🏗️' },
            { action: 'compró', asset: 'NAFTRAC', message: 'Diversificando con el NAFTRAC. Menos riesgo 📊' },
            { action: 'compró', asset: 'FEMSAUBD', message: 'FEMSA es sólida. OXXO no para de crecer 🍺' },
            { action: 'vendió', asset: 'WALMEX', message: 'Walmart subió mucho, vendí antes de la corrección 🛒' },
            { action: 'compró', asset: 'FUNO 11', message: 'FIBRAs para ingresos pasivos. ¡Las rentas no paran! 🏢' },
            { action: 'compró', asset: 'GFNORTE', message: 'Banorte subiendo con las tasas de interés 🏦' },
            { action: 'vendió', asset: 'BIMBOA', message: 'Bimbo dio buenos resultados este trimestre 🍞' },
            { action: 'compró', asset: 'IVVPESO', message: 'Exposición al S&P 500 sin cambiar de broker 🇺🇸' },
            { action: 'compró', asset: 'GMEXICOB', message: 'Cobre al alza. Grupo México se beneficia ⛏️' },
            { action: 'compró', asset: 'GLD', message: 'Oro como refugio en tiempos de incertidumbre 🥇' },
            { action: 'vendió', asset: 'TLEVISACPO', message: 'Televisa... debí haber investigado más 📺' }
        ];

        const now = Date.now();
        posts = postTemplates.map((template, index) => {
            const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
            const asset = ASSETS_DATA.find(a => a.ticker === template.asset);
            const priceChange = (Math.random() - 0.4) * 10;
            
            return {
                id: 'post_' + index,
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                userLevel: user.level,
                userLeague: user.league,
                action: template.action,
                assetTicker: template.asset,
                assetName: asset ? asset.name : template.asset,
                assetIcon: asset ? asset.icon : '📊',
                message: template.message,
                priceChange: parseFloat(priceChange.toFixed(2)),
                likes: Math.floor(Math.random() * 50) + 5,
                comments: Math.floor(Math.random() * 10),
                timestamp: now - (index * 3600000 * Math.random() * 24),
                liked: false
            };
        });

        posts.sort((a, b) => b.timestamp - a.timestamp);
        saveState();
    }

    function generateNewPost() {
        const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
        const asset = ASSETS_DATA[Math.floor(Math.random() * ASSETS_DATA.length)];
        const isBuy = Math.random() > 0.3;
        
        const messages = isBuy ? [
            `${asset.name} se ve fuerte. ¡Entrando! ${asset.icon}`,
            `Analizando ${asset.ticker}... buena oportunidad de compra ${asset.icon}`,
            `Diversificando con ${asset.name}. Largo plazo ${asset.icon}`,
            `${asset.ticker} en soporte. Comprando la caída ${asset.icon}`,
            `Excelentes fundamentos en ${asset.name}. ¡Adelante! ${asset.icon}`
        ] : [
            `Vendiendo ${asset.ticker}. Tomé ganancias ${asset.icon}`,
            `${asset.name} llegó a mi precio objetivo. Saliendo ${asset.icon}`,
            `Rebalanceando: vendiendo algo de ${asset.ticker} ${asset.icon}`,
            `${asset.ticker} se puso interesante pero mejor aseguro ${asset.icon}`
        ];

        const priceChange = (Math.random() - 0.4) * 10;

        const post = {
            id: 'post_' + Date.now() + Math.random().toString(36).substr(2, 4),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            userLevel: user.level,
            userLeague: user.league,
            action: isBuy ? 'compró' : 'vendió',
            assetTicker: asset.ticker,
            assetName: asset.name,
            assetIcon: asset.icon,
            message: messages[Math.floor(Math.random() * messages.length)],
            priceChange: parseFloat(priceChange.toFixed(2)),
            likes: Math.floor(Math.random() * 20),
            comments: 0,
            timestamp: Date.now(),
            liked: false
        };

        posts.unshift(post);
        if (posts.length > 50) {
            posts = posts.slice(0, 50);
        }

        saveState();
        return post;
    }

    function toggleLike(postId) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            saveState();
            Logger.logFeedInteraction(post.liked ? 'like' : 'unlike', postId);
            return post;
        }
        return null;
    }

    function viewPost(postId) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            Logger.logFeedInteraction('view', postId);
            
            if (post.action === 'compró') {
                AISocratic.setRecentFeedView({
                    userName: post.userName,
                    assetTicker: post.assetTicker
                });
            }
        }
        return post;
    }

    function getPosts(limit = 20) {
        return posts.slice(0, limit);
    }

    function updateLeaderboard() {
        const gamStats = Gamification.getStats();
        
        const playerEntry = {
            id: 'player',
            name: 'Tú',
            avatar: '🦅',
            level: gamStats.level,
            league: Gamification.getLeague().name,
            xp: gamStats.xp,
            streak: gamStats.streak,
            isPlayer: true
        };

        const simulatedEntries = SIMULATED_USERS.map(user => {
            const leagueXp = {
                'Bronce': Math.floor(Math.random() * 500),
                'Plata': 500 + Math.floor(Math.random() * 1000),
                'Oro': 1500 + Math.floor(Math.random() * 2000),
                'Platino': 3500 + Math.floor(Math.random() * 3500),
                'Diamante': 7000 + Math.floor(Math.random() * 5000)
            };
            
            return {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                level: user.level,
                league: user.league,
                xp: leagueXp[user.league] || 0,
                streak: Math.floor(Math.random() * 30),
                isPlayer: false
            };
        });

        leaderboard = [playerEntry, ...simulatedEntries]
            .sort((a, b) => b.xp - a.xp)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        saveState();
    }

    function getLeaderboard() {
        updateLeaderboard();
        return leaderboard;
    }

    function getPlayerRank() {
        const player = leaderboard.find(e => e.isPlayer);
        return player ? player.rank : leaderboard.length;
    }

    function getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'ahora';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd';
        return Math.floor(diff / 604800000) + 'sem';
    }

    function reset() {
        posts = [];
        leaderboard = [];
        generateInitialPosts();
        updateLeaderboard();
    }

    return {
        init,
        generateNewPost,
        toggleLike,
        viewPost,
        getPosts,
        updateLeaderboard,
        getLeaderboard,
        getPlayerRank,
        getTimeAgo,
        reset
    };
})();
