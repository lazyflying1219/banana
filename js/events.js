import { elements, openModal, closeModal, switchTab, loadPage, updateGalleryDisplay, closeLightbox, showNextImage, showPrevImage, renderUploadPreviews, toggleTheme, updateDetailView, renderPaginatedGrid } from './ui.js';
import { getState, setState } from './state.js';
import { generateImage, testApi } from './api.js';
import { toggleFavorite, loadFavorites, loadHistory, deleteFromHistory, clearAllHistory, clearAllFavorites, exportData, getStorage } from './storage.js';

export function initializeEventListeners() {
    // --- 页眉按钮 ---
    elements.settingsBtn.addEventListener('click', () => openModal(elements.settingsModal));
    elements.favoritesBtn.addEventListener('click', () => { loadFavorites(); openModal(elements.favoritesModal); });
    elements.historyBtn.addEventListener('click', () => { loadHistory(); openModal(elements.historyModal); });
    elements.themeBtn.addEventListener('click', toggleTheme);

    // --- 模态框关闭 ---
    [elements.settingsModal, elements.favoritesModal, elements.historyModal, elements.historyDetailModal].forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });
    elements.closeModalBtn.addEventListener('click', () => closeModal(elements.settingsModal));
    elements.closeFavoritesModalBtn.addEventListener('click', () => closeModal(elements.favoritesModal));
    elements.closeHistoryModalBtn.addEventListener('click', () => closeModal(elements.historyModal));
    elements.closeHistoryDetailModalBtn.addEventListener('click', () => closeModal(elements.historyDetailModal));

    // --- 主操作区 ---
    elements.tabTextToImage.addEventListener('click', () => switchTab(elements.tabTextToImage, elements.textToImagePanel));
    elements.tabImageToImage.addEventListener('click', () => switchTab(elements.tabImageToImage, elements.imageToImagePanel));
    elements.generateBtn.addEventListener('click', generateImage);

    // --- 灵感画廊 ---
    elements.carouselPrev.addEventListener('click', () => {
        if (getState('currentPage') > 0) {
            setState('currentPage', getState('currentPage') - 1);
            loadPage(getState('currentPage'));
        }
    });
    elements.carouselNext.addEventListener('click', () => {
        if (getState('currentPage') < Math.ceil(getState('allExamples').length / 15) - 1) {
            setState('currentPage', getState('currentPage') + 1);
            loadPage(getState('currentPage'));
        }
    });
    elements.selectTemplateBtn.addEventListener('click', () => {
        const example = getState('currentExamples')[getState('currentIndexOnPage')];
        if (example) {
            const targetTextArea = elements.textToImagePanel.classList.contains('active') ? elements.promptInputText : elements.promptInputImage;
            targetTextArea.value = example.prompt || '';
            targetTextArea.focus();
        }
    });
    elements.favoriteTemplateBtn.addEventListener('click', () => {
        const example = getState('currentExamples')[getState('currentIndexOnPage')];
        if (example) toggleFavorite({ ...example, id: example.id || example.title }, 'template');
    });

    // --- 灯箱 ---
    elements.lightboxClose.addEventListener('click', closeLightbox);
    elements.lightboxPrev.addEventListener('click', showPrevImage);
    elements.lightboxNext.addEventListener('click', showNextImage);
    document.addEventListener('keydown', (e) => {
        if (!elements.lightboxModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });

    // --- 结果操作 ---
    document.getElementById('image-actions').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const action = target.id;
        const image = getState('currentGeneratedImage');
        if (!image) return;

        if (action === 'favorite-result-btn') toggleFavorite(image, 'result');
        if (action === 'download-result-btn') exportData([image], `nano-banana-${Date.now()}.png`);
        if (action === 'send-to-img2img-btn') {
            // Implement send to img2img functionality
        }
    });

    // --- 文件上传 ---
    elements.fileUploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.fileUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); elements.fileUploadArea.classList.add('dragging'); });
    elements.fileUploadArea.addEventListener('dragleave', () => elements.fileUploadArea.classList.remove('dragging'));
    elements.fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.fileUploadArea.classList.remove('dragging');
        handleFiles(e.dataTransfer.files);
    });
    elements.fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    document.querySelector('.upload-thumbs').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-thumb')) {
            const indexToRemove = parseInt(e.target.dataset.index, 10);
            const uploadedFiles = getState('uploadedFiles');
            URL.revokeObjectURL(uploadedFiles[indexToRemove].dataUrl);
            uploadedFiles.splice(indexToRemove, 1);
            setState('uploadedFiles', uploadedFiles);
            renderUploadPreviews();
        }
    });

    function handleFiles(files) {
        const uploadedFiles = getState('uploadedFiles');
        [...files].forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedFiles.push({ file, dataUrl: e.target.result });
                setState('uploadedFiles', uploadedFiles);
                renderUploadPreviews();
            };
            reader.readAsDataURL(file);
        });
    }

    // --- 设置 ---
    document.getElementById('save-settings-btn').addEventListener('click', () => {
        if (elements.modelNameInput) {
            localStorage.setItem('modelName', elements.modelNameInput.value);
        }
        closeModal(elements.settingsModal);
    });
    document.getElementById('test-api-btn').addEventListener('click', testApi);
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (elements.modelNameInput) {
                elements.modelNameInput.value = btn.dataset.model;
            }
        });
    });

    // --- 历史/收藏 分页和操作 ---
    setupModalActions('history', loadHistory, clearAllHistory);
    setupModalActions('favorites', loadFavorites, clearAllFavorites);

    function setupModalActions(type, loader, clearer) {
        document.getElementById(`${type}-prev-page`).addEventListener('click', () => {
            let page = getState(`${type}Page`);
            if (page > 1) {
                setState(`${type}Page`, page - 1);
                renderPaginatedGrid(type);
            }
        });
        document.getElementById(`${type}-next-page`).addEventListener('click', () => {
            let page = getState(`${type}Page`);
            let items = getState(`current${type.charAt(0).toUpperCase() + type.slice(1)}Items`);
            if (page < Math.ceil(items.length / 8)) {
                setState(`${type}Page`, page + 1);
                renderPaginatedGrid(type);
            }
        });
        document.getElementById(`${type}-grid`).addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('clear-all-btn')) clearer();
            if (target.classList.contains('delete-item-btn')) {
                const gridItem = target.closest('.grid-item');
                const p = gridItem.querySelector('p');
                const prompt = p ? p.title : '';
                const items = getState(`current${type.charAt(0).toUpperCase() + type.slice(1)}Items`);
                const itemToDelete = items.find(item => item.prompt === prompt);
                if (itemToDelete) {
                    if (type === 'history') {
                        deleteFromHistory(itemToDelete.id).then(loader);
                    } else {
                        let favs = getStorage('favorites');
                        favs = favs.filter(fav => fav.id !== itemToDelete.id);
                        setStorage('favorites', favs);
                        loader();
                    }
                }
            }
            if (target.closest('.grid-item img')) {
                 const gridItem = target.closest('.grid-item');
                 const p = gridItem.querySelector('p');
                 const prompt = p ? p.title : '';
                 const items = getState(`current${type.charAt(0).toUpperCase() + type.slice(1)}Items`);
                 const itemIndex = items.findIndex(item => item.prompt === prompt);
                 if (itemIndex > -1) updateDetailView(itemIndex, type);
            }
        });
        document.getElementById(`export-${type}-btn`).addEventListener('click', () => {
            const data = getStorage(type);
            exportData(data, `nano-banana-${type}-${new Date().toISOString().split('T')[0]}.json`);
        });
    }

    // --- 详情页导航 ---
    document.getElementById('detail-prev-item').addEventListener('click', () => {
        if (getState('currentItemInDetailView') && getState('currentDetailIndex') > 0) {
            updateDetailView(getState('currentDetailIndex') - 1, getState('currentItemInDetailView').sourceType);
        }
    });
    document.getElementById('detail-next-item').addEventListener('click', () => {
        const type = getState('currentItemInDetailView').sourceType;
        const items = getState(`current${type.charAt(0).toUpperCase() + type.slice(1)}Items`);
        if (getState('currentItemInDetailView') && getState('currentDetailIndex') < items.length - 1) {
            updateDetailView(getState('currentDetailIndex') + 1, type);
        }
    });

}