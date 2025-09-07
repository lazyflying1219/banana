import { setState } from './state.js';
import { renderPaginatedGrid, updateFavoriteIcon } from './ui.js';

// --- LocalStorage ---
export const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
export const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- 收藏夹 ---
export function toggleFavorite(item, type) {
    let favorites = getStorage('favorites');
    const itemId = item.id || item.title || item.src;
    if (!itemId) return;

    const existingIndex = favorites.findIndex(fav => fav.id === itemId);
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
    } else {
        const favoriteItem = {
            ...item,
            type: type,
            id: itemId,
            timestamp: Date.now()
        };
        favorites.unshift(favoriteItem);
    }
    setStorage('favorites', favorites);
}

export function loadFavorites() {
    setState('currentFavoritesItems', getStorage('favorites'));
    setState('favoritesPage', 1);
    renderPaginatedGrid('favorites');
}

export function clearAllFavorites() {
    if (!confirm('确定要清空所有收藏吗？')) return;
    setStorage('favorites', []);
    loadFavorites();
}

// --- IndexedDB ---
const DB_NAME = 'ImageStudioDB';
const DB_VERSION = 2;
const STORE_NAME = 'history';
let db;

function openDB() {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = e => reject(e.target.error);
        request.onupgradeneeded = e => {
            const tempDb = e.target.result;
            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                tempDb.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = e => {
            db = e.target.result;
            resolve(db);
        };
    });
}

export async function addToHistory(item) {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const historyItem = {
        ...item,
        id: item.id || `gen_${Date.now()}`,
        timestamp: Date.now()
    };
    return new Promise((resolve, reject) => {
        const request = store.add(historyItem);
        request.onsuccess = () => resolve(request.result);
        request.onerror = e => reject(e.target.error);
    });
}

export async function loadHistory() {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const items = [];
    return new Promise((resolve, reject) => {
        const request = store.openCursor(null, 'prev');
        request.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                setState('currentHistoryItems', items);
                setState('historyPage', 1);
                renderPaginatedGrid('history');
                resolve(items);
            }
        };
        request.onerror = e => reject(e.target.error);
    });
}

export async function deleteFromHistory(id) {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = e => reject(e.target.error);
    });
}

export async function clearAllHistory() {
    if (!confirm('确定要清空所有历史记录吗？')) return;
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
            loadHistory();
            resolve();
        };
        request.onerror = e => reject(e.target.error);
    });
}

// --- 导出 ---
export function exportData(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}