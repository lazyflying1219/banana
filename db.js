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
    console.log('Attempting to add to history DB:', item);
    
    try {
        console.log('Opening IndexedDB...');
        const db = await openDB();
        console.log('IndexedDB opened successfully');
        
        console.log('Creating transaction...');
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        transaction.oncomplete = () => console.log('History transaction completed.');
        transaction.onerror = (event) => console.error('History transaction error:', event.target.error);
        
        console.log('Getting object store...');
        const store = transaction.objectStore(STORE_NAME);
        
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