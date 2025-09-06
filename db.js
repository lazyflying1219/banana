const DB_NAME = 'ImageStudioDB';
const DB_VERSION = 2; // 升级版本以触发 onupgradeneeded
const HISTORY_STORE_NAME = 'history';
const IMAGE_CACHE_STORE_NAME = 'imageCache'; // 新增图片缓存库

let db;

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
            // 创建历史记录库
            if (!tempDb.objectStoreNames.contains(HISTORY_STORE_NAME)) {
                tempDb.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
            // 创建图片缓存库
            if (!tempDb.objectStoreNames.contains(IMAGE_CACHE_STORE_NAME)) {
                tempDb.createObjectStore(IMAGE_CACHE_STORE_NAME, { keyPath: 'url' });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            cleanupImageCache(); // 打开数据库时，清理一次旧缓存
            resolve(db);
        };
    });
}

// --- Image Cache Functions ---

async function saveImageToCache(url, blob) {
    try {
        const db = await openDB();
        const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
        return new Promise((resolve, reject) => {
            const cacheEntry = {
                url: url,
                data: blob,
                timestamp: Date.now()
            };
            const request = store.put(cacheEntry);
            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error("Failed to save to cache:", event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error("Error accessing DB for caching:", error);
    }
}

async function getImageFromCache(url) {
    const db = await openDB();
    const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readonly');
    const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.get(url);
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.data); // 返回缓存的Blob数据
            } else {
                resolve(null); // 未找到
            }
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

async function cleanupImageCache(maxAgeDays = 30) {
    try {
        const db = await openDB();
        const transaction = db.transaction(IMAGE_CACHE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(IMAGE_CACHE_STORE_NAME);
        const maxAge = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.timestamp < maxAge) {
                    cursor.delete();
                }
                cursor.continue();
            } else {
                console.log("Image cache cleanup complete.");
            }
        };
        request.onerror = (event) => {
            console.error("Error during cache cleanup:", event.target.error);
        };
    } catch (error) {
        console.error("Could not start cache cleanup:", error);
    }
}


// --- History Functions ---

async function addToHistoryDB(item) {
    const db = await openDB();
    const transaction = db.transaction(HISTORY_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    
    item.timestamp = Date.now();

    return new Promise((resolve, reject) => {
        const request = store.add(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function getHistoryDB(count = 50) {
    const db = await openDB();
    const transaction = db.transaction(HISTORY_STORE_NAME, 'readonly');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    const items = [];

    return new Promise((resolve, reject) => {
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