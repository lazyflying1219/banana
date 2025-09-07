import { getState, setState, ASPECT_RATIOS, ITEMS_PER_PAGE_GALLERY, ITEMS_PER_PAGE_MODAL } from './state.js';
import { getProxiedImageUrl } from './api.js';
import { getStorage } from './storage.js';

// --- 元素获取 ---
export const elements = {
    tabTextToImage: document.getElementById('tab-text-to-image'),
    tabImageToImage: document.getElementById('tab-image-to-image'),
    textToImagePanel: document.getElementById('text-to-image-panel'),
    imageToImagePanel: document.getElementById('image-to-image-panel'),
    promptInputText: document.getElementById('prompt-input-text'),
    promptInputImage: document.getElementById('prompt-input-image'),
    generateBtn: document.querySelector('.generate-button'),
    settingsBtn: document.getElementById('settings-btn'),
    favoritesBtn: document.getElementById('favorites-btn'),
    historyBtn: document.getElementById('history-btn'),
    imageDisplay: document.getElementById('image-display'),
    imageActions: document.getElementById('image-actions'),
    favoriteResultBtn: document.getElementById('favorite-result-btn'),
    themeBtn: document.getElementById('theme-btn'),
    sunIcon: document.querySelector('.theme-icon-sun'),
    moonIcon: document.querySelector('.theme-icon-moon'),
    promptDisplayArea: document.getElementById('prompt-display-area'),
    thumbnailTrack: document.getElementById('thumbnail-track'),
    carouselPrev: document.getElementById('carousel-prev'),
    carouselNext: document.getElementById('carousel-next'),
    galleryPromptTitle: document.getElementById('gallery-prompt-title'),
    galleryPromptAuthor: document.getElementById('gallery-prompt-author'),
    selectTemplateBtn: document.getElementById('select-template-btn'),
    favoriteTemplateBtn: document.getElementById('favorite-template-btn'),
    settingsModal: document.getElementById('settings-modal'),
    favoritesModal: document.getElementById('favorites-modal'),
    historyModal: document.getElementById('history-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    closeFavoritesModalBtn: document.getElementById('close-favorites-modal-btn'),
    closeHistoryModalBtn: document.getElementById('close-history-modal-btn'),
    favoritesGrid: document.getElementById('favorites-grid'),
    historyGrid: document.getElementById('history-grid'),
    historyDetailModal: document.getElementById('history-detail-modal'),
    closeHistoryDetailModalBtn: document.getElementById('close-history-detail-modal-btn'),
    downloadHistoryDetailBtn: document.getElementById('download-history-detail-btn'),
    favoriteHistoryDetailBtn: document.getElementById('favorite-history-detail-btn'),
    historyDetailImage: document.getElementById('history-detail-image'),
    historyDetailPrompt: document.getElementById('history-detail-prompt'),
    fileUploadArea: document.querySelector('.file-upload-area'),
    fileInput: document.getElementById('image-input'),
    modelNameInput: document.getElementById('model-name'),
    lightboxModal: document.getElementById('lightbox-modal'),
    lightboxImage: document.getElementById('lightbox-image'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxPrev: document.getElementById('lightbox-prev'),
    lightboxNext: document.getElementById('lightbox-next'),
    galleryPreviewer: document.createElement('div'),
};

document.body.appendChild(elements.galleryPreviewer);
elements.galleryPreviewer.className = 'thumbnail-previewer';
let previewInterval = null;


// --- 懒加载观察器 ---
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
            observer.unobserve(img);
        }
    });
}, { rootMargin: '0px 0px 200px 0px' });


// --- 模态框 ---
export const openModal = (modal) => modal.classList.remove('hidden');
export const closeModal = (modal) => modal.classList.add('hidden');

// --- 页签切换 ---
export function switchTab(activeTab, activePanel) {
    [elements.tabTextToImage, elements.tabImageToImage].forEach(tab => tab.classList.remove('active'));
    [elements.textToImagePanel, elements.imageToImagePanel].forEach(panel => panel.classList.remove('active'));
    activeTab.classList.add('active');
    activePanel.classList.add('active');
    const activeType = activeTab.id === 'tab-text-to-image' ? 'text_to_image' : 'image_to_image';
    setState('allExamples', promptExamples[activeType] || []);
    setState('currentPage', 0);
    loadPage(0);
}

// --- 比例选择器 ---
export function initRatioSelector() {
    const ratioContainer = document.getElementById('ratio-buttons-container');
    if (!ratioContainer) return;
    ratioContainer.innerHTML = '';
    Object.entries(ASPECT_RATIOS).forEach(([ratio, config]) => {
        const button = document.createElement('button');
        button.className = 'ratio-button';
        button.dataset.ratio = ratio;
        const label = document.createElement('div');
        label.className = 'ratio-label';
        label.textContent = config.label;
        const description = document.createElement('div');
        description.className = 'ratio-description';
        description.textContent = config.description;
        button.appendChild(label);
        button.appendChild(description);
        if (ratio === getState('selectedRatio')) {
            button.classList.add('selected');
        }
        button.addEventListener('click', () => handleRatioSelection(ratio, button));
        ratioContainer.appendChild(button);
    });
}

export function handleRatioSelection(ratio, buttonElement) {
    document.querySelectorAll('.ratio-button').forEach(btn => btn.classList.remove('selected'));
    buttonElement.classList.add('selected');
    setState('selectedRatio', ratio);
    preloadBaseImage(ratio);
}

function preloadBaseImage(ratio) {
    const config = ASPECT_RATIOS[ratio];
    if (config && config.baseImage) {
        const img = new Image();
        img.src = config.baseImage;
    }
}

// --- 灵感画廊 ---
function cleanupPreviewInterval() {
    if (previewInterval) {
        clearInterval(previewInterval);
        previewInterval = null;
    }
}

function cleanupGalleryPreviewer() {
    cleanupPreviewInterval();
    elements.galleryPreviewer.classList.remove('visible');
    elements.galleryPreviewer.innerHTML = '';
}

export function loadPage(page) {
    cleanupGalleryPreviewer();
    const start = page * ITEMS_PER_PAGE_GALLERY;
    const end = start + ITEMS_PER_PAGE_GALLERY;
    setState('currentExamples', getState('allExamples').slice(start, end));
    
    elements.thumbnailTrack.innerHTML = '';
    if (getState('currentExamples').length === 0) {
        elements.promptDisplayArea.textContent = '该分类下暂无灵感...';
        elements.galleryPromptTitle.textContent = '空空如也';
        elements.galleryPromptAuthor.textContent = '';
        return;
    }

    const fragment = document.createDocumentFragment();
    getState('currentExamples').forEach((example, index) => {
        const thumbItem = document.createElement('div');
        thumbItem.className = 'thumbnail-item';
        thumbItem.dataset.id = example.id || example.title;

        if (example.thumbnail && (example.thumbnail.startsWith('http') || example.thumbnail.startsWith('data:image') || example.thumbnail.startsWith('/'))) {
            const img = document.createElement('img');
            img.alt = example.title;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNlYWVhZWEiLz48L3N2Zz4='; // Placeholder
            img.dataset.src = getProxiedImageUrl(example.thumbnail);
            thumbItem.appendChild(img);
        } else if (example.thumbnail) {
            thumbItem.innerHTML = example.thumbnail;
        } else {
            thumbItem.innerHTML = '🖼️';
        }

        thumbItem.addEventListener('click', () => openLightbox(index));

        if (window.matchMedia('(min-width: 1025px) and (hover: hover)').matches) {
            thumbItem.addEventListener('mouseenter', (e) => {
                cleanupPreviewInterval();
                const imagesToShow = [...(example.inputImages || []), ...(example.outputImages || [])].filter(Boolean);
                if (imagesToShow.length === 0) imagesToShow.push(example.thumbnail);
                const proxiedImages = imagesToShow.map(url => getProxiedImageUrl(url));
                const limitedImages = proxiedImages.slice(0, 3);
                elements.galleryPreviewer.innerHTML = '';
                limitedImages.forEach(src => {
                    const previewImg = document.createElement('img');
                    previewImg.loading = 'lazy';
                    previewImg.src = src;
                    elements.galleryPreviewer.appendChild(previewImg);
                });
                const rect = e.currentTarget.getBoundingClientRect();
                elements.galleryPreviewer.style.left = `${rect.right + 15}px`;
                elements.galleryPreviewer.style.top = `${window.scrollY + rect.top}px`;
                elements.galleryPreviewer.classList.add('visible');
            });
            thumbItem.addEventListener('mouseleave', cleanupGalleryPreviewer);
        }
        fragment.appendChild(thumbItem);
    });

    elements.thumbnailTrack.appendChild(fragment);
    elements.thumbnailTrack.querySelectorAll('img[data-src]').forEach(img => lazyLoadObserver.observe(img));
    updateGalleryDisplay(0);
    updatePaginationButtons();
}

export function updateGalleryDisplay(indexOnPage) {
    const example = getState('currentExamples')[indexOnPage];
    if (!example) return;
    elements.promptDisplayArea.textContent = example.prompt;
    elements.galleryPromptTitle.textContent = example.title;
    elements.galleryPromptAuthor.textContent = `by ${example.author || 'N/A'}`;
    document.querySelectorAll('.thumbnail-item').forEach((item, i) => item.classList.toggle('active', i === indexOnPage));
    setState('currentIndexOnPage', indexOnPage);
    updateTemplateFavoriteIcon();
}

export function updatePaginationButtons() {
    elements.carouselPrev.disabled = getState('currentPage') === 0;
    elements.carouselNext.disabled = getState('currentPage') >= Math.ceil(getState('allExamples').length / ITEMS_PER_PAGE_GALLERY) - 1;
}

// --- 灯箱 (Lightbox) ---
export function openLightbox(index) {
    updateGalleryDisplay(index);
    updateLightboxImage(index);
    elements.lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
    elements.lightboxModal.classList.add('hidden');
    document.body.style.overflow = '';
}

export function showNextImage() {
    if (getState('currentLightboxIndex') < getState('currentExamples').length - 1) {
        updateLightboxImage(getState('currentLightboxIndex') + 1);
    }
}

export function showPrevImage() {
    if (getState('currentLightboxIndex') > 0) {
        updateLightboxImage(getState('currentLightboxIndex') - 1);
    }
}

function updateLightboxImage(index) {
    const example = getState('currentExamples')[index];
    if (!example) return;
    const highResImage = (example.outputImages && example.outputImages) || example.thumbnail;
    elements.lightboxImage.src = getProxiedImageUrl(highResImage);
    elements.lightboxImage.alt = example.title;
    setState('currentLightboxIndex', index);
    elements.lightboxPrev.style.display = index > 0 ? 'flex' : 'none';
    elements.lightboxNext.style.display = index < getState('currentExamples').length - 1 ? 'flex' : 'none';
}

// --- 图片生成与展示 ---
export function displayImage(imageData) {
    elements.imageDisplay.innerHTML = '';
    let currentImg = document.createElement('img');
    currentImg.src = imageData.src;
    currentImg.alt = imageData.prompt || 'Generated Image';
    currentImg.style.opacity = 0;
    elements.imageDisplay.appendChild(currentImg);
    currentImg.addEventListener('click', () => {
        setState('currentLightboxIndex', -1);
        elements.lightboxImage.src = currentImg.src;
        elements.lightboxImage.alt = currentImg.alt;
        elements.lightboxPrev.style.display = 'none';
        elements.lightboxNext.style.display = 'none';
        elements.lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    currentImg.onload = () => {
        setTimeout(() => { currentImg.style.opacity = 1; }, 50);
    };
    elements.imageActions.classList.remove('hidden');
    setState('currentGeneratedImage', { ...imageData, id: imageData.id || `gen_${Date.now()}`, timestamp: Date.now() });
    updateResultFavoriteIcon();
}

export function showGenerationError(error, finalRetryCount) {
    let displayMessage = error.error || error.message || '生成失败，请重试';
    if (finalRetryCount > 0) {
        displayMessage += ` (已自动重试 ${finalRetryCount} 次)`;
    }
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<p>❌ ${displayMessage}</p><button class="retry-btn">手动重试</button>`;
    elements.imageDisplay.innerHTML = '';
    elements.imageDisplay.appendChild(errorDiv);
}

// --- 收藏图标更新 ---
export function updateFavoriteIcon(button, item) {
    if (!button || !item) return;
    const itemId = item.id || item.title || item.src;
    const favorites = getStorage('favorites');
    const isFavorited = favorites.some(fav => fav.id === itemId);
    button.classList.toggle('favorited', isFavorited);
}

export function updateTemplateFavoriteIcon() {
    const example = getState('currentExamples')[getState('currentIndexOnPage')];
    if (example) updateFavoriteIcon(elements.favoriteTemplateBtn, example);
}

export function updateResultFavoriteIcon() {
    if (getState('currentGeneratedImage')) updateFavoriteIcon(elements.favoriteResultBtn, getState('currentGeneratedImage'));
}


// --- 渲染 ---
export function renderGrid(gridElement, items, emptyText, type, totalItems) {
    gridElement.innerHTML = '';
    if (items && items.length > 0) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'grid-actions';
        actionsDiv.innerHTML = `<span>共 ${totalItems} 项</span><button class="clear-all-btn">${type === 'favorites' ? '清空收藏' : '清空历史'}</button>`;
        gridElement.appendChild(actionsDiv);
    }
    if (!items || items.length === 0) {
        gridElement.innerHTML = `<div style="text-align: center; color: var(--text-color-secondary); padding: 40px;"><p>${emptyText}</p></div>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        const imgSrc = type === 'history' ? item.thumbnail : (item.thumbnail || item.src || '');
        gridItem.innerHTML = `<img src="${getProxiedImageUrl(imgSrc)}" alt="Image" loading="lazy"><p title="${item.prompt || ''}">${item.prompt || ''}</p><button class="delete-item-btn">×</button>`;
        fragment.appendChild(gridItem);
    });
    gridElement.appendChild(fragment);
}

export function renderPaginatedGrid(type) {
    const isHistory = type === 'history';
    const items = isHistory ? getState('currentHistoryItems') : getState('currentFavoritesItems');
    const page = isHistory ? getState('historyPage') : getState('favoritesPage');
    const grid = isHistory ? elements.historyGrid : elements.favoritesGrid;
    const emptyText = isHistory ? '暂无历史记录' : '暂无收藏';
    const start = (page - 1) * ITEMS_PER_PAGE_MODAL;
    const end = start + ITEMS_PER_PAGE_MODAL;
    const paginatedItems = items.slice(start, end);
    renderGrid(grid, paginatedItems, emptyText, type, items.length);
    updatePaginationControls(type);
}

export function updatePaginationControls(type) {
    const isHistory = type === 'history';
    const items = isHistory ? getState('currentHistoryItems') : getState('currentFavoritesItems');
    const page = isHistory ? getState('historyPage') : getState('favoritesPage');
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE_MODAL);
    const prevBtn = document.getElementById(`${type}-prev-page`);
    const nextBtn = document.getElementById(`${type}-next-page`);
    const pageInfo = document.getElementById(`${type}-page-info`);
    if (pageInfo) pageInfo.textContent = `第 ${totalPages > 0 ? page : 1} / ${totalPages > 0 ? totalPages : 1} 页`;
    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= totalPages;
}

export function updateDetailView(index, type) {
    const items = type === 'history' ? getState('currentHistoryItems') : getState('currentFavoritesItems');
    if (index < 0 || index >= items.length) {
        closeModal(elements.historyDetailModal);
        return;
    }
    const item = items[index];
    const detailItem = {
        ...item,
        src: item.src || item.thumbnail,
        id: item.id || item.title || item.src,
        sourceType: type
    };
    setState('currentItemInDetailView', detailItem);
    setState('currentDetailIndex', index);
    elements.historyDetailImage.src = getProxiedImageUrl(detailItem.src);
    elements.historyDetailPrompt.textContent = item.prompt;
    document.getElementById('history-detail-title').textContent = type === 'favorites' ? '收藏详情' : '历史记录详情';
    document.getElementById('detail-prev-item').disabled = index === 0;
    document.getElementById('detail-next-item').disabled = index === items.length - 1;
    updateFavoriteIcon(elements.favoriteHistoryDetailBtn, detailItem);
    openModal(elements.historyDetailModal);
}

// --- 文件上传 ---
export function renderUploadPreviews() {
    const initialText = elements.fileUploadArea.querySelector('p');
    if (initialText) initialText.style.display = 'none';
    let thumbsContainer = elements.fileUploadArea.querySelector('.upload-thumbs');
    if (!thumbsContainer) {
        thumbsContainer = document.createElement('div');
        thumbsContainer.className = 'upload-thumbs';
        elements.fileUploadArea.appendChild(thumbsContainer);
    }
    thumbsContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    getState('uploadedFiles').forEach((item, index) => {
        const thumbItem = document.createElement('div');
        thumbItem.className = 'upload-thumb-item';
        thumbItem.innerHTML = `<img src="${item.dataUrl}" alt="preview" loading="lazy"><button class="remove-thumb" data-index="${index}">×</button>`;
        fragment.appendChild(thumbItem);
    });
    thumbsContainer.appendChild(fragment);
}


// --- 主题 ---
export function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.sunIcon.style.display = 'none';
        elements.moonIcon.style.display = 'block';
    } else {
        document.documentElement.removeAttribute('data-theme');
        elements.sunIcon.style.display = 'block';
        elements.moonIcon.style.display = 'none';
    }
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

// --- 通知 ---
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}