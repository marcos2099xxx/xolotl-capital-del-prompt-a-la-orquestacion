// Favorites Module - Sistema de activos favoritos
const Favorites = (() => {
    const STORAGE_KEY = 'xolotl_favorites';
    let favorites = [];

    function init() {
        load();
    }

    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            favorites = stored ? JSON.parse(stored) : [];
        } catch {
            favorites = [];
        }
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.warn('Favorites: No se pudo guardar', e);
        }
    }

    function toggle(assetId) {
        const index = favorites.indexOf(assetId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(assetId);
        }
        save();
        return isFavorite(assetId);
    }

    function isFavorite(assetId) {
        return favorites.includes(assetId);
    }

    function getAll() {
        return [...favorites];
    }

    function getFavoriteAssets() {
        return favorites.map(id => Market.getAsset(id)).filter(Boolean);
    }

    function count() {
        return favorites.length;
    }

    function renderStar(assetId, size = 'text-lg') {
        const isFav = isFavorite(assetId);
        return `<button onclick="event.stopPropagation(); Favorites.toggleAndRender('${assetId}')" class="focus:outline-none transition-transform hover:scale-110" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            <span class="${size} ${isFav ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'}">${isFav ? '★' : '☆'}</span>
        </button>`;
    }

    function toggleAndRender(assetId) {
        toggle(assetId);
        
        const stars = document.querySelectorAll(`[data-fav-id="${assetId}"]`);
        stars.forEach(el => {
            const isFav = isFavorite(assetId);
            el.innerHTML = `<span class="text-lg ${isFav ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'}">${isFav ? '★' : '☆'}</span>`;
        });
        
        if (currentTab === 'market') {
            renderMarket();
        }
        
        Sounds.click();
    }

    function reset() {
        favorites = [];
        save();
    }

    return {
        init,
        toggle,
        isFavorite,
        getAll,
        getFavoriteAssets,
        count,
        renderStar,
        toggleAndRender,
        reset
    };
})();
