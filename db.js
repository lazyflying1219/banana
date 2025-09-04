const DB_NAME = 'ImageStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'history';

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
            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                tempDb.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
    });
}

async function addToHistoryDB(item) {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Add a timestamp for sorting
    item.timestamp = Date.now();

    return new Promise((resolve, reject) => {
        const request = store.add(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function getHistoryDB(count = 50) {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
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
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

async function clearHistoryDB() {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

// --- 图片代理函数 ---
function getProxiedImageUrl(originalUrl) {
    // 如果没有URL，直接返回
    if (!originalUrl) return originalUrl;
    
    // 如果是data URL，直接返回
    if (originalUrl.startsWith('data:')) return originalUrl;
    
    // 如果是相对路径，直接返回
    if (originalUrl.startsWith('/') && !originalUrl.startsWith('//')) return originalUrl;
    
    // 对于所有外部HTTP/HTTPS URL，都使用代理
    if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://') || originalUrl.startsWith('//')){
        console.log('Using proxy for URL:', originalUrl);
        return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    }
    
    return originalUrl;
}

function createThumbnail(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // 允许跨域加载图片
        
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
        
        // 在设置src之前，先通过代理获取URL
        img.src = getProxiedImageUrl(imageUrl);
    });
}