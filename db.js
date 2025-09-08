const DB_NAME = 'ImageStudioDB';
const DB_VERSION = 3; // 增加版本号以支持新的存储结构
const HISTORY_STORE_NAME = 'history';
const FAVORITES_STORE_NAME = 'favorites';
const IMAGE_CACHE_STORE_NAME = 'image_cache';

let db;

// 确保函数在全局作用域中可用
window.openDB = openDB;
window.addToHistoryDB = addToHistoryDB;
window.getHistoryDB = getHistoryDB;
window.deleteFromHistoryDB = deleteFromHistoryDB;
window.clearHistoryDB = clearHistoryDB;
window.addToFavoritesDB = addToFavoritesDB;
window.getFavoritesDB = getFavoritesDB;
window.deleteFromFavoritesDB = deleteFromFavoritesDB;
window.clearFavoritesDB = clearFavoritesDB;
window.createThumbnail = createThumbnail;

function openDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject('Database error');
        };

        request.onupgradeneeded = (event) => {
            const tempDb = event.target.result;
            
            // 创建历史记录存储（如果不存在）
            if (!tempDb.objectStoreNames.contains(HISTORY_STORE_NAME)) {
                tempDb.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'id' });
            }
            
            // 创建收藏存储（如果不存在）
            if (!tempDb.objectStoreNames.contains(FAVORITES_STORE_NAME)) {
                tempDb.createObjectStore(FAVORITES_STORE_NAME, { keyPath: 'id' });
            }
            
            // 创建图片缓存存储（如果不存在）
            if (!tempDb.objectStoreNames.contains(IMAGE_CACHE_STORE_NAME)) {
                tempDb.createObjectStore(IMAGE_CACHE_STORE_NAME, { keyPath: 'url' });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
    });
}

async function addToHistoryDB(item) {
    console.log('Attempting to add to history DB:', item);
    
    try {
        console.log('Opening IndexedDB...');
        const db = await openDB();
        console.log('IndexedDB opened successfully');
        
        console.log('Creating transaction...');
        const transaction = db.transaction(HISTORY_STORE_NAME, 'readwrite');
        transaction.oncomplete = () => console.log('History transaction completed.');
        transaction.onerror = (event) => console.error('History transaction error:', event.target.error);
        
        console.log('Getting object store...');
        const store = transaction.objectStore(HISTORY_STORE_NAME);
        
        // Add a timestamp for sorting
        item.timestamp = Date.now();
        console.log('Item with timestamp prepared for DB:', item);

        return new Promise((resolve, reject) => {
            console.log('Adding item to store...');
            const request = store.add(item);
            request.onsuccess = () => {
                console.log('Item added to history DB successfully with ID:', request.result);
                resolve(request.result);
            };
            request.onerror = (event) => {
                console.error('Failed to add item to history DB:', event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Error in addToHistoryDB:', error);
        throw error;
    }
}

async function getHistoryDB(count = 50) {
    const db = await openDB();
    const transaction = db.transaction(HISTORY_STORE_NAME, 'readonly');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    const items = [];

    return new Promise((resolve, reject) => {
        // Open a cursor to iterate over the items in reverse order (newest first)
        const request = store.openCursor(null, 'prev');
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && items.length < count) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                resolve(items);
            }
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function deleteFromHistoryDB(id) {
    const db = await openDB();
    const transaction = db.transaction(HISTORY_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

async function clearHistoryDB() {
    const db = await openDB();
    const transaction = db.transaction(HISTORY_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

// 收藏功能的IndexedDB操作
async function addToFavoritesDB(item) {
    console.log('Attempting to add to favorites DB:', item);
    
    try {
        console.log('Opening IndexedDB...');
        const db = await openDB();
        console.log('IndexedDB opened successfully');
        
        console.log('Creating transaction...');
        const transaction = db.transaction(FAVORITES_STORE_NAME, 'readwrite');
        transaction.oncomplete = () => console.log('Favorites transaction completed.');
        transaction.onerror = (event) => console.error('Favorites transaction error:', event.target.error);
        
        console.log('Getting object store...');
        const store = transaction.objectStore(FAVORITES_STORE_NAME);
        
        // Add a timestamp for sorting
        item.timestamp = Date.now();
        console.log('Item with timestamp prepared for DB:', item);

        return new Promise((resolve, reject) => {
            console.log('Adding item to store...');
            const request = store.add(item);
            request.onsuccess = () => {
                console.log('Item added to favorites DB successfully with ID:', request.result);
                resolve(request.result);
            };
            request.onerror = (event) => {
                console.error('Failed to add item to favorites DB:', event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Error in addToFavoritesDB:', error);
        throw error;
    }
}

async function getFavoritesDB(count = 50) {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE_NAME, 'readonly');
    const store = transaction.objectStore(FAVORITES_STORE_NAME);
    const items = [];

    return new Promise((resolve, reject) => {
        // Open a cursor to iterate over the items in reverse order (newest first)
        const request = store.openCursor(null, 'prev');
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && items.length < count) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                resolve(items);
            }
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function deleteFromFavoritesDB(id) {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

async function clearFavoritesDB() {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

function createThumbnail(base64Image) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const MAX_WIDTH = 200;
            const MAX_HEIGHT = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Use WebP for better compression if available, otherwise JPEG
            const thumbnailDataUrl = canvas.toDataURL('image/webp', 0.8);
            resolve(thumbnailDataUrl);
        };
        img.onerror = (err) => {
            console.error("Failed to load image for thumbnail creation.", err);
            reject(err);
        };
        img.src = base64Image;
    });
}

// 图片缓存功能
async function cacheImage(url, dataUrl) {
    try {
        const db = await openDB();
        const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
        
        const cacheItem = {
            url: url,
            dataUrl: dataUrl,
            timestamp: Date.now(),
            // 设置缓存过期时间为7天
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        
        return new Promise((resolve, reject) => {
            const request = store.put(cacheItem);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    } catch (error) {
        console.error('Error caching image:', error);
        throw error;
    }
}

async function getCachedImage(url) {
    try {
        const db = await openDB();
        const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readonly');
        const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
        
        return new Promise((resolve, reject) => {
            const request = store.get(url);
            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    // 检查缓存是否过期
                    if (result.expires > Date.now()) {
                        resolve(result.dataUrl);
                    } else {
                        // 缓存已过期，删除它
                        deleteCachedImage(url).then(() => resolve(null)).catch(reject);
                    }
                } else {
                    resolve(null);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    } catch (error) {
        console.error('Error getting cached image:', error);
        throw error;
    }
}

async function deleteCachedImage(url) {
    try {
        const db = await openDB();
        const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
        
        return new Promise((resolve, reject) => {
            const request = store.delete(url);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    } catch (error) {
        console.error('Error deleting cached image:', error);
        throw error;
    }
}

async function clearExpiredImageCache() {
    try {
        const db = await openDB();
        const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
        const currentTime = Date.now();
        
        return new Promise((resolve, reject) => {
            const request = store.openCursor();
            const deletedUrls = [];
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.expires <= currentTime) {
                        // 缓存已过期，删除它
                        deletedUrls.push(cursor.value.url);
                        cursor.delete();
                    }
                    cursor.continue();
                } else {
                    console.log(`Cleared ${deletedUrls.length} expired image cache entries`);
                    resolve(deletedUrls);
                }
            };
            
            request.onerror = (event) => reject(event.target.error);
        });
    } catch (error) {
        console.error('Error clearing expired image cache:', error);
        throw error;
    }
}

async function clearAllImageCache() {
    try {
        const db = await openDB();
        const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
        
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    } catch (error) {
        console.error('Error clearing all image cache:', error);
        throw error;
    }
}

// 导出图片缓存函数
window.cacheImage = cacheImage;
window.getCachedImage = getCachedImage;
window.deleteCachedImage = deleteCachedImage;
window.clearExpiredImageCache = clearExpiredImageCache;
window.clearAllImageCache = clearAllImageCache;