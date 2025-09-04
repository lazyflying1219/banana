document.addEventListener('DOMContentLoaded', () => {
    // --- 元素获取 ---
    const tabTextToImage = document.getElementById('tab-text-to-image');
    const tabImageToImage = document.getElementById('tab-image-to-image');
    const textToImagePanel = document.getElementById('text-to-image-panel');
    const imageToImagePanel = document.getElementById('image-to-image-panel');
    const promptInputText = document.getElementById('prompt-input-text');
    const promptInputImage = document.getElementById('prompt-input-image');
    const generateBtn = document.querySelector('.generate-button');

    const settingsBtn = document.getElementById('settings-btn');
    const favoritesBtn = document.getElementById('favorites-btn');
    const historyBtn = document.getElementById('history-btn');

    const imageDisplay = document.getElementById('image-display');
    const imageActions = document.getElementById('image-actions');
    const favoriteResultBtn = document.getElementById('favorite-result-btn');
    const themeBtn = document.getElementById('theme-btn');
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');

    const promptDisplayArea = document.getElementById('prompt-display-area');
    const thumbnailTrack = document.getElementById('thumbnail-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const galleryPromptTitle = document.getElementById('gallery-prompt-title');
    const galleryPromptAuthor = document.getElementById('gallery-prompt-author');
    const selectTemplateBtn = document.getElementById('select-template-btn');
    const favoriteTemplateBtn = document.getElementById('favorite-template-btn');

    const settingsModal = document.getElementById('settings-modal');
    const favoritesModal = document.getElementById('favorites-modal');
    const historyModal = document.getElementById('history-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const closeFavoritesModalBtn = document.getElementById('close-favorites-modal-btn');
    const closeHistoryModalBtn = document.getElementById('close-history-modal-btn');
    const favoritesGrid = document.getElementById('favorites-grid');
    const historyGrid = document.getElementById('history-grid');

    const historyDetailModal = document.getElementById('history-detail-modal');
    const closeHistoryDetailModalBtn = document.getElementById('close-history-detail-modal-btn');
    const downloadHistoryDetailBtn = document.getElementById('download-history-detail-btn');
    const favoriteHistoryDetailBtn = document.getElementById('favorite-history-detail-btn');
    const historyDetailImage = document.getElementById('history-detail-image');
    const historyDetailPrompt = document.getElementById('history-detail-prompt');

    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('image-input');
    const modelNameInput = document.getElementById('model-name');

    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
 
     // --- 单一预览器 ---
     const galleryPreviewer = document.createElement('div');
    galleryPreviewer.className = 'thumbnail-previewer';
    document.body.appendChild(galleryPreviewer);
    let previewInterval = null;

    // --- 状态变量 ---
    let allExamples = [];
    let currentExamples = [];
    let currentIndexOnPage = 0;
    let currentPage = 0;
    const itemsPerPage = 15;
    let currentGeneratedImage = null;
    let uploadedFiles = []; // { file: File, dataUrl:string }
    let currentLightboxIndex = 0;

    // --- (REMOVED) Scroll event handler is no longer needed ---

    // --- 通用函数 ---
    // getStorage/setStorage are now only used for 'favorites'. History uses IndexedDB.
    const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // --- 页签切换 ---
    function switchTab(activeTab, activePanel) {
        [tabTextToImage, tabImageToImage].forEach(tab => tab.classList.remove('active'));
        [textToImagePanel, imageToImagePanel].forEach(panel => panel.classList.remove('active'));
        activeTab.classList.add('active');
        activePanel.classList.add('active');
        const activeType = activeTab.id === 'tab-text-to-image' ? 'text_to_image' : 'image_to_image';
        allExamples = promptExamples[activeType] || [];
        currentPage = 0;
        loadPage(currentPage);
    }

    // --- 模态框处理 ---
    const openModal = (modal) => modal.classList.remove('hidden');
    const closeModal = (modal) => modal.classList.add('hidden');
    settingsBtn.addEventListener('click', () => openModal(settingsModal));
    closeModalBtn.addEventListener('click', () => closeModal(settingsModal));
    favoritesBtn.addEventListener('click', () => { loadFavorites(); openModal(favoritesModal); });
    closeFavoritesModalBtn.addEventListener('click', () => closeModal(favoritesModal));
    historyBtn.addEventListener('click', () => { loadHistory(); openModal(historyModal); });
    closeHistoryModalBtn.addEventListener('click', () => closeModal(historyModal));
    [settingsModal, favoritesModal, historyModal, historyDetailModal].forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });
    closeHistoryDetailModalBtn.addEventListener('click', () => closeModal(historyDetailModal));

    // --- 图片代理函数 ---
    function getProxiedImageUrl(originalUrl) {
        // 检查是否为GitHub raw URL
        if (originalUrl && originalUrl.includes('raw.githubusercontent.com')) {
            return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
        }
        return originalUrl;
    }

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
                observer.unobserve(img); // Unobserve after loading
            }
        });
    }, { rootMargin: '0px 0px 200px 0px' }); // Start loading when image is 200px away from viewport bottom

    // --- 灵感画廊 (性能优化版) ---
    function updateGalleryDisplay(indexOnPage) {
        const example = currentExamples[indexOnPage];
        if (!example) return;
        promptDisplayArea.textContent = example.prompt;
        galleryPromptTitle.textContent = example.title;
        galleryPromptAuthor.textContent = `by ${example.author || 'N/A'}`;
        document.querySelectorAll('.thumbnail-item').forEach((item, i) => item.classList.toggle('active', i === indexOnPage));
        currentIndexOnPage = indexOnPage;
        updateTemplateFavoriteIcon();
    }

    // 清理函数
    function cleanupPreviewInterval() {
        if (previewInterval) {
            clearInterval(previewInterval);
            previewInterval = null;
        }
    }

    function cleanupGalleryPreviewer() {
        cleanupPreviewInterval();
        galleryPreviewer.classList.remove('visible');
        // 清空预览器内容，释放图片内存
        galleryPreviewer.innerHTML = '';
    }

    function loadPage(page) {
        // 清理之前的预览器状态
        cleanupGalleryPreviewer();
        
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        currentExamples = allExamples.slice(start, end);
        
        // 清空现有缩略图并移除事件监听器
        const existingItems = thumbnailTrack.querySelectorAll('.thumbnail-item');
        existingItems.forEach(item => {
            // 移除所有事件监听器
            item.replaceWith(item.cloneNode(true));
        });
        thumbnailTrack.innerHTML = '';

        if (currentExamples.length === 0) {
            promptDisplayArea.textContent = '该分类下暂无灵感...';
            galleryPromptTitle.textContent = '空空如也';
            galleryPromptAuthor.textContent = '';
            return;
        }

        // 使用文档片段提高性能
        const fragment = document.createDocumentFragment();

        currentExamples.forEach((example, index) => {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'thumbnail-item';
            thumbItem.dataset.id = example.id || example.title;

            // 智能处理缩略图：区分图片URL和HTML图标
            if (example.thumbnail.startsWith('http') || example.thumbnail.startsWith('data:image')) {
                const img = document.createElement('img');
                img.alt = example.title;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNlYWVhZWEiLz48L3N2Zz4='; // Placeholder
                img.dataset.src = getProxiedImageUrl(example.thumbnail);
                img.onerror = function() {
                    if (this.src.startsWith('http')) { // Only log error for real URLs
                        console.warn(`缩略图加载失败: ${this.dataset.src}`);
                    }
                };
                thumbItem.appendChild(img);
            } else {
                // 如果不是URL，则直接渲染HTML内容
                thumbItem.innerHTML = example.thumbnail;
                thumbItem.style.display = 'flex';
                thumbItem.style.alignItems = 'center';
                thumbItem.style.justifyContent = 'center';
                thumbItem.style.fontSize = '2em'; // Adjust icon size if needed
                thumbItem.style.backgroundColor = 'var(--bg-color)';
            }

            // 点击事件
            thumbItem.addEventListener('click', () => openLightbox(index));
 
             // 预览器事件 - 仅在桌面端 (>1024px) 启用
             if (window.matchMedia('(min-width: 1025px) and (hover: hover)').matches) {
                thumbItem.addEventListener('mouseenter', (e) => {
                    cleanupPreviewInterval();
                    
                    const imagesToShow = [...(example.inputImages || []), ...(example.outputImages || [])].filter(Boolean);
                    if (imagesToShow.length === 0) imagesToShow.push(example.thumbnail);
                    
                    // 使用代理URL
                    const proxiedImages = imagesToShow.map(url => getProxiedImageUrl(url));

                    // 限制预览图片数量，避免内存过度使用
                    const maxPreviewImages = 3;
                    const limitedImages = proxiedImages.slice(0, maxPreviewImages);

                    galleryPreviewer.innerHTML = '';
                    limitedImages.forEach(src => {
                        const previewImg = document.createElement('img');
                        previewImg.loading = 'lazy';
                        previewImg.onerror = function() {
                            console.warn(`预览图加载失败: ${this.src}`);
                            this.remove(); // 移除失败的图片
                        };
                        previewImg.src = src;
                        galleryPreviewer.appendChild(previewImg);
                    });

                    const rect = e.currentTarget.getBoundingClientRect();
                    const previewerHeight = galleryPreviewer.offsetHeight;
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const spaceAbove = rect.top;

                    let topPosition = window.scrollY + rect.top;

                    // 如果下方空间不足，但上方空间足够，则向上显示
                    if (spaceBelow < previewerHeight && spaceAbove > previewerHeight) {
                        topPosition = window.scrollY + rect.bottom - previewerHeight;
                    }

                    galleryPreviewer.style.left = `${rect.right + 15}px`;
                    galleryPreviewer.style.top = `${topPosition}px`;
                    galleryPreviewer.classList.add('visible');

                    const previewImages = galleryPreviewer.querySelectorAll('img');
                    if (previewImages.length > 0) {
                        let currentPreviewIndex = 0;
                        previewImages[currentPreviewIndex].classList.add('active-preview');

                        if (previewImages.length > 1) {
                            previewInterval = setInterval(() => {
                                if (previewImages[currentPreviewIndex]) {
                                    previewImages[currentPreviewIndex].classList.remove('active-preview');
                                }
                                currentPreviewIndex = (currentPreviewIndex + 1) % previewImages.length;
                                if (previewImages[currentPreviewIndex]) {
                                    previewImages[currentPreviewIndex].classList.add('active-preview');
                                }
                            }, 1500);
                        }
                    }
                });
                thumbItem.addEventListener('mouseleave', () => {
                    cleanupGalleryPreviewer();
                });
             }

            fragment.appendChild(thumbItem);
        });

        thumbnailTrack.appendChild(fragment);
        
        // 观察所有新创建的图片以进行懒加载
        const imagesToLoad = thumbnailTrack.querySelectorAll('img[data-src]');
        imagesToLoad.forEach(img => {
            lazyLoadObserver.observe(img);
        });

        updateGalleryDisplay(0);
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        carouselPrev.disabled = currentPage === 0;
        carouselNext.disabled = currentPage >= Math.ceil(allExamples.length / itemsPerPage) - 1;
    }
    carouselPrev.addEventListener('click', () => { if (currentPage > 0) { currentPage--; loadPage(currentPage); } });
    carouselNext.addEventListener('click', () => { if (currentPage < Math.ceil(allExamples.length / itemsPerPage) - 1) { currentPage++; loadPage(currentPage); } });

    selectTemplateBtn.addEventListener('click', () => {
        const example = currentExamples[currentIndexOnPage];
        if (!example) return;
        const targetTextArea = textToImagePanel.classList.contains('active') ? promptInputText : promptInputImage;
        targetTextArea.value = example.prompt;
        targetTextArea.focus();
    });

    // --- 灯箱 (Lightbox) 功能 ---
    function updateLightboxImage(index) {
        if (!currentExamples[index]) return;
        const example = currentExamples[index];
        const highResImage = (example.outputImages && example.outputImages) || example.thumbnail;
        lightboxImage.src = getProxiedImageUrl(highResImage);
        lightboxImage.alt = example.title;
        currentLightboxIndex = index;

        // 更新导航按钮状态
        lightboxPrev.style.display = index > 0 ? 'flex' : 'none';
        lightboxNext.style.display = index < currentExamples.length - 1 ? 'flex' : 'none';
    }

    function openLightbox(index) {
        updateGalleryDisplay(index); // Keep the main UI updated as well
        updateLightboxImage(index);
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    function closeLightbox() {
        lightboxModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        if (currentLightboxIndex < currentExamples.length - 1) {
            updateLightboxImage(currentLightboxIndex + 1);
        }
    }

    function showPrevImage() {
        if (currentLightboxIndex > 0) {
            updateLightboxImage(currentLightboxIndex - 1);
        }
    }

    function handleKeydown(e) {
        if (!lightboxModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    }
 
     // --- 图片生成与展示 (无跳动优化) ---
     async function displayImage(imageData) {
         imageDisplay.innerHTML = ''; // Clear previous content
        let currentImg = document.createElement('img');
        
        currentImg.onerror = function() {
            console.error('生成结果图片加载失败:', this.src);
            imageDisplay.innerHTML = '<p>图片加载失败，请重试</p>';
            imageActions.classList.add('hidden');
        };
        currentImg.src = imageData.src;
        currentImg.alt = imageData.prompt || 'Generated Image';
        
        currentImg.style.opacity = 0;
        imageDisplay.appendChild(currentImg);

        // 为生成的图片添加点击放大功能
        currentImg.addEventListener('click', () => {
            lightboxImage.src = currentImg.src;
            lightboxImage.alt = currentImg.alt;
            
            // 单张图片时隐藏导航
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
            
            lightboxModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
        
        currentImg.onload = () => {
            setTimeout(() => { currentImg.style.opacity = 1; }, 50);
        };
        if (currentImg.complete) {
            setTimeout(() => { currentImg.style.opacity = 1; }, 50);
        }

        imageActions.classList.remove('hidden');
        currentGeneratedImage = { ...imageData };
        if (!currentGeneratedImage.id) {
            currentGeneratedImage.id = `gen_${Date.now()}`;
        }
        updateResultFavoriteIcon();
        
        // 调用addToHistory时，总假定是新生成的图片
        await addToHistory(currentGeneratedImage);
    }

    async function generateImage() {
        // 直接使用后端API，不依赖前端设置
        const apiUrl = '/api/generate';
        const modelName = modelNameInput ? modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview';
        const prompt = textToImagePanel.classList.contains('active') ? promptInputText.value : promptInputImage.value;
        const images = uploadedFiles.map(f => f.dataUrl);

        // 验证输入
        if (!prompt.trim()) {
            alert('请输入提示词');
            return;
        }

        generateBtn.textContent = '生成中...';
        generateBtn.disabled = true;
        imageDisplay.innerHTML = '<div class="loading-spinner"><p>正在为您生成图片...</p><div class="spinner"></div></div>';
        imageActions.classList.add('hidden');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model: modelName, images }),
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
                }
                throw errorData; 
            }

            const result = await response.json();
            
            if (result.src) {
                displayImage({ src: result.src, prompt: prompt, model: modelName });
            } else {
                throw new Error('API 返回数据中未找到图片');
            }

        } catch (error) {
            console.error('API 生成失败:', error);
            
            // 详细的错误信息用于调试
            let errorDetails = {
                message: error.message || '未知错误',
                stack: error.stack || '无堆栈信息',
                name: error.name || '未知错误类型',
                error: error.error || null,
                details: error.details || null,
                rawResponse: error.rawResponse || null,
                responseText: error.responseText || null
            };
            
            // 如果是网络错误，添加更多信息
            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorDetails.networkError = true;
                errorDetails.suggestion = '请检查网络连接和API地址';
            }
            
            let displayMessage = error.error || error.message || '生成失败，请重试';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.textAlign = 'left';
            
            const errorP = document.createElement('p');
            errorP.textContent = `❌ ${displayMessage}`;
            
            // 添加详细调试信息
            const debugInfo = document.createElement('details');
            debugInfo.style.marginTop = '15px';
            debugInfo.innerHTML = `
                <summary style="cursor: pointer; color: var(--accent-color); margin-bottom: 10px;">🔍 调试信息 (点击展开)</summary>
                <pre style="background: rgba(120,120,128,0.1); padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap;">${JSON.stringify(errorDetails, null, 2)}</pre>
            `;
            
            const retryBtn = document.createElement('button');
            retryBtn.className = 'retry-btn';
            retryBtn.textContent = '重试';
            retryBtn.addEventListener('click', generateImage);
            
            errorDiv.appendChild(errorP);
            errorDiv.appendChild(debugInfo);
            errorDiv.appendChild(retryBtn);
            imageDisplay.innerHTML = '';
            imageDisplay.appendChild(errorDiv);
        
        } finally {
            generateBtn.textContent = '生成';
            generateBtn.disabled = false;
        }
    }
    generateBtn.addEventListener('click', generateImage);

    // --- 收藏功能 (模板与结果) ---
    function toggleFavorite(item, type) {
        let favorites = getStorage('favorites');
        const itemId = item.id || item.title || item.src; 
        if (!itemId) {
            console.warn('无法收藏，因为项目没有有效ID:', item);
            return;
        }
        
        const existingIndex = favorites.findIndex(fav => fav.id === itemId);
        if (existingIndex > -1) {
            // 取消收藏
            favorites.splice(existingIndex, 1);
        } else {
            // 添加收藏，包含时间戳
            const favoriteItem = { 
                ...item, 
                type, 
                id: itemId,
                timestamp: Date.now(),
                favoriteDate: new Date().toLocaleDateString()
            };
            favorites.unshift(favoriteItem);
        }
        
        // 限制收藏数量
        if (favorites.length > 200) {
            favorites = favorites.slice(0, 200);
        }
        
        setStorage('favorites', favorites);
        if (type === 'template') {
            updateTemplateFavoriteIcon();
        } else if (type === 'result') {
            updateResultFavoriteIcon();
        }
        // No need to update detail view icon here, it's handled on open
    }

    function updateAndBindFavoriteButton(button, item, type) {
        if (!button || !item) return;

        const itemId = item.id || item.title || item.src;
        const favorites = getStorage('favorites');
        const isFavorited = favorites.some(fav => fav.id === itemId);
        button.classList.toggle('favorited', isFavorited);

        // Clone and replace to remove old event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', () => {
            toggleFavorite({ ...item, id: itemId }, type);
             // Re-update the button state after click
            updateAndBindFavoriteButton(newButton, item, type);
        });
        
        // return the new button if needed
        return newButton;
    }

    function updateTemplateFavoriteIcon() {
        const example = currentExamples[currentIndexOnPage];
        if (example) {
            favoriteTemplateBtn = updateAndBindFavoriteButton(favoriteTemplateBtn, example, 'template');
        }
    }

    function updateResultFavoriteIcon() {
        if (currentGeneratedImage) {
            favoriteResultBtn = updateAndBindFavoriteButton(favoriteResultBtn, currentGeneratedImage, 'result');
        }
    }

    function loadFavorites() {
        renderGrid(favoritesGrid, getStorage('favorites'), '暂无收藏', 'favorites');
    }
    if (favoriteTemplateBtn) {
        favoriteTemplateBtn.addEventListener('click', () => {
            const example = currentExamples[currentIndexOnPage];
            if (example) toggleFavorite({ ...example, id: example.id || example.title, thumbnail: example.thumbnail }, 'template');
        });
    }
    if (favoriteResultBtn) {
        favoriteResultBtn.addEventListener('click', () => {
            if (currentGeneratedImage) toggleFavorite(currentGeneratedImage, 'result');
        });
    }

    // --- 下载功能 ---
    const downloadResultBtn = document.getElementById('download-result-btn');
    if (downloadResultBtn) {
        downloadResultBtn.addEventListener('click', () => {
            if (currentGeneratedImage && currentGeneratedImage.src) {
                const link = document.createElement('a');
                link.href = currentGeneratedImage.src;
                link.download = `nano-banana-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }

    // --- 历史记录 (IndexedDB版本) ---
    async function addToHistory(imageData) {
        try {
            console.log("Creating thumbnail for history...");
            const thumbnail = await createThumbnail(imageData.src);
            
            const historyItem = {
                prompt: imageData.prompt,
                model: imageData.model,
                src: imageData.src, // 保存原始Base64
                thumbnail: thumbnail, // 保存缩略图
                timestamp: Date.now()
            };

            await addToHistoryDB(historyItem);
            console.log("Successfully added to history DB.");

        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    }

    async function loadHistory() {
        try {
            const historyItems = await getHistoryDB();
            renderGrid(historyGrid, historyItems, '暂无历史记录', 'history');
        } catch (error) {
            console.error('Failed to load history:', error);
            historyGrid.innerHTML = '<p>无法加载历史记录。</p>';
        }
    }

    // --- 通用网格渲染 ---
    // 删除收藏或历史记录项
    async function deleteItem(itemId, type) {
        if (!confirm('确定要删除这个项目吗？')) return;
        
        if (type === 'favorites') {
            let items = getStorage('favorites');
            items = items.filter(item => item.id !== itemId);
            setStorage('favorites', items);
            loadFavorites();
        } else {
            await deleteFromHistoryDB(itemId);
            loadHistory(); // 重新加载
        }
    }

    // 清空所有历史记录
    async function clearAllHistory() {
        if (!confirm('确定要清空所有历史记录吗？此操作不可恢复。')) return;
        await clearHistoryDB();
        loadHistory();
    }

    // 清空所有收藏
    function clearAllFavorites() {
        if (!confirm('确定要清空所有收藏吗？此操作不可恢复。')) return;
        
        setStorage('favorites', []);
        loadFavorites();
    }

    function renderGrid(gridElement, items, emptyText, type) {
        // 清理现有事件监听器
        const existingItems = gridElement.querySelectorAll('.grid-item');
        existingItems.forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });
        
        gridElement.innerHTML = '';
        
        // 添加操作按钮区域
        if (items && items.length > 0) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'grid-actions';
            actionsDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 10px; background: rgba(120, 120, 128, 0.1); border-radius: 8px;';
            
            const info = document.createElement('span');
            info.style.color = 'var(--text-color-secondary)';
            info.textContent = `共 ${items.length} 项`;
            
            const clearBtn = document.createElement('button');
            clearBtn.className = 'clear-all-btn';
            clearBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85em; cursor: pointer;';
            clearBtn.textContent = type === 'favorites' ? '清空收藏' : '清空历史';
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (type === 'favorites') {
                    clearAllFavorites();
                } else {
                    clearAllHistory();
                }
            });
            
            actionsDiv.appendChild(info);
            actionsDiv.appendChild(clearBtn);
            gridElement.appendChild(actionsDiv);
        }
        
        if (!items || items.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'text-align: center; color: var(--text-color-secondary); padding: 40px;';
            emptyDiv.innerHTML = `
                <div style="font-size: 3em; margin-bottom: 10px;">${type === 'favorites' ? '💝' : '📝'}</div>
                <p>${emptyText}</p>
            `;
            gridElement.appendChild(emptyDiv);
            return;
        }
        
        // 使用文档片段提高性能
        const fragment = document.createDocumentFragment();
        
        // 限制显示数量，避免内存过度使用
        const maxItems = 100;
        const limitedItems = items.slice(0, maxItems);
        
        limitedItems.forEach((item, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.style.position = 'relative';
            
            const img = document.createElement('img');
            // 历史记录优先使用缩略图，收藏夹使用旧逻辑
            const imgSrc = type === 'history' ? item.thumbnail : (item.thumbnail || item.src || '');
            img.src = getProxiedImageUrl(imgSrc);
            img.alt = 'Image';
            img.loading = 'lazy';
            
            const p = document.createElement('p');
            p.title = item.prompt || '';
            p.textContent = item.prompt || '';
            
            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-item-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(220, 53, 69, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                font-size: 16px;
                line-height: 1;
                cursor: pointer;
                display: none;
                z-index: 10;
            `;
            
            // 鼠标悬停显示删除按钮
            gridItem.addEventListener('mouseenter', () => {
                deleteBtn.style.display = 'block';
            });
            
            gridItem.addEventListener('mouseleave', () => {
                deleteBtn.style.display = 'none';
            });
            
            // 删除事件
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // 注意：历史记录的ID是自增的，收藏夹的ID是别的
                const itemId = type === 'history' ? item.id : (item.id || item.title || item.src);
                deleteItem(itemId, type);
            });
            
            // 点击图片查看
            img.addEventListener('click', () => {
                // 统一使用新的详情模态框
                const fullSrc = type === 'history' ? item.src : (item.src || item.thumbnail);
                const itemToView = { ...item, src: fullSrc, thumbnail: item.thumbnail || fullSrc };
                
                historyDetailImage.src = getProxiedImageUrl(fullSrc);
                historyDetailPrompt.textContent = item.prompt;
                
                // 更新并绑定收藏按钮
                updateAndBindFavoriteButton(favoriteHistoryDetailBtn, itemToView, 'detail');
                
                // 设置下载按钮功能
                downloadHistoryDetailBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = fullSrc;
                    link.download = `nano-banana-${type}-${item.id || Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };

                openModal(historyDetailModal);
            });
            
            // 添加时间信息（如果有）
            if (item.timestamp || item.id) {
                const timeInfo = document.createElement('div');
                timeInfo.style.cssText = 'font-size: 0.75em; color: var(--text-color-secondary); padding: 5px 10px;';
                const date = item.timestamp ? new Date(item.timestamp) : new Date(item.id);
                timeInfo.textContent = date.toLocaleString();
                gridItem.appendChild(timeInfo);
            }
            
            gridItem.appendChild(img);
            gridItem.appendChild(p);
            gridItem.appendChild(deleteBtn);
            fragment.appendChild(gridItem);
        });
        
        gridElement.appendChild(fragment);
        
        // 如果有更多项目，显示提示
        if (items.length > maxItems) {
            const moreInfo = document.createElement('p');
            moreInfo.style.textAlign = 'center';
            moreInfo.style.color = 'var(--text-color-secondary)';
            moreInfo.textContent = `显示了前 ${maxItems} 项，共 ${items.length} 项`;
            gridElement.appendChild(moreInfo);
        }
    }

    // --- 文件上传 (支持多图) ---
    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadArea.classList.add('dragging'); });
    fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('dragging'));
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragging');
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFiles(e.target.files);
        fileInput.value = '';
    });

    function handleFiles(files) {
        const maxFiles = 5;
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (uploadedFiles.length + files.length > maxFiles) {
            alert(`最多只能上传 ${maxFiles} 张图片`);
            return;
        }
        
        [...files].forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert(`文件 "${file.name}" 不是图片格式`);
                return;
            }
            
            if (file.size > maxSize) {
                alert(`文件 "${file.name}" 太大，请选择小于 10MB 的图片`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedFiles.push({ file, dataUrl: e.target.result });
                renderUploadPreviews();
            };
            reader.onerror = () => {
                alert(`读取文件 "${file.name}" 失败`);
            };
            reader.readAsDataURL(file);
        });
    }

    function renderUploadPreviews() {
        const initialText = fileUploadArea.querySelector('p');
        if (initialText) initialText.style.display = 'none';
        
        let thumbsContainer = fileUploadArea.querySelector('.upload-thumbs');
        if (!thumbsContainer) {
            thumbsContainer = document.createElement('div');
            thumbsContainer.className = 'upload-thumbs';
            fileUploadArea.appendChild(thumbsContainer);
        }
        
        // 清理现有的事件监听器
        const existingButtons = thumbsContainer.querySelectorAll('.remove-thumb');
        existingButtons.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        thumbsContainer.innerHTML = '';
        
        // 使用文档片段提高性能
        const fragment = document.createDocumentFragment();
        
        uploadedFiles.forEach((item, index) => {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'upload-thumb-item';
            
            const img = document.createElement('img');
            img.src = item.dataUrl;
            img.alt = 'preview';
            img.loading = 'lazy';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-thumb';
            removeBtn.textContent = '×';
            removeBtn.dataset.index = index;
            
            // 使用事件委托避免重复绑定
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const indexToRemove = parseInt(e.target.dataset.index, 10);
                
                // 释放dataUrl内存
                if (uploadedFiles[indexToRemove]) {
                    URL.revokeObjectURL(uploadedFiles[indexToRemove].dataUrl);
                    uploadedFiles.splice(indexToRemove, 1);
                }
                
                renderUploadPreviews();
                if (uploadedFiles.length === 0 && initialText) {
                    initialText.style.display = 'block';
                }
            });
            
            thumbItem.appendChild(img);
            thumbItem.appendChild(removeBtn);
            fragment.appendChild(thumbItem);
        });
        
        thumbsContainer.appendChild(fragment);
    }

    // --- 主题切换 ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            document.documentElement.removeAttribute('data-theme');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    themeBtn.addEventListener('click', toggleTheme);

    // --- 预设配置 ---
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const model = btn.dataset.model;
            if (modelNameInput) {
                modelNameInput.value = model;
            }
        });
    });

    // --- API 测试功能 ---
    const testApiBtn = document.getElementById('test-api-btn');
    const apiTestResult = document.getElementById('api-test-result');
    
    if (testApiBtn && apiTestResult) {
        testApiBtn.addEventListener('click', async () => {
            const originalText = testApiBtn.textContent;
            testApiBtn.textContent = '测试中...';
            testApiBtn.disabled = true;
            apiTestResult.innerHTML = '<div style="color: #007aff;">🔄 正在测试API连接...</div>';
            
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        prompt: '测试图片生成：一只可爱的小猫', 
                        model: modelNameInput ? modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview'
                    }),
                });
                
                const result = await response.json();
                
                if (response.ok && result.src) {
                    apiTestResult.innerHTML = '<div style="color: #28a745;">✅ API连接成功！图片生成正常</div>';
                } else {
                    apiTestResult.innerHTML = `
                        <div style="color: #dc3545;">❌ API测试失败</div>
                        <details style="margin-top: 10px;">
                            <summary style="cursor: pointer;">查看详细错误</summary>
                            <pre style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; font-size: 11px; margin-top: 5px; overflow-x: auto;">${JSON.stringify(result, null, 2)}</pre>
                        </details>
                    `;
                }
            } catch (error) {
                apiTestResult.innerHTML = `
                    <div style="color: #dc3545;">❌ 网络错误: ${error.message}</div>
                    <div style="margin-top: 5px; font-size: 0.8em;">请检查API地址是否正确</div>
                `;
            }
            
            testApiBtn.textContent = originalText;
            testApiBtn.disabled = false;
        });
    }

    // --- 设置保存 ---
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            // 只保存模型名称（虽然现在是只读的）
            if (modelNameInput) {
                localStorage.setItem('modelName', modelNameInput.value);
            }
            closeModal(settingsModal);
            
            // 显示保存成功提示
            const originalText = saveSettingsBtn.textContent;
            saveSettingsBtn.textContent = '已保存';
            saveSettingsBtn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                saveSettingsBtn.textContent = originalText;
                saveSettingsBtn.style.backgroundColor = '';
            }, 1500);
        });
    }

    // --- 初始化 ---
    const initialize = () => {
        tabTextToImage.addEventListener('click', () => switchTab(tabTextToImage, textToImagePanel));
        tabImageToImage.addEventListener('click', () => switchTab(tabImageToImage, imageToImagePanel));

        // 从localStorage加载设置
        const savedModelName = localStorage.getItem('modelName');
        
        if (modelNameInput) modelNameInput.value = savedModelName || 'vertexpic-gemini-2.5-flash-image-preview';

        // 初始化主题
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

        switchTab(tabTextToImage, textToImagePanel);

        // Adjust body padding to prevent content from being hidden by the fixed header
        const header = document.querySelector('header');
        if (header) {
            const headerHeight = header.offsetHeight;
            document.body.style.paddingTop = `${headerHeight + 25}px`; // Add extra space
        }

        // 灯箱事件监听
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
        document.addEventListener('keydown', handleKeydown);
    };

    // --- 导出功能 ---
    function exportData(data, filename) {
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

    // 导出收藏
    const exportFavoritesBtn = document.getElementById('export-favorites-btn');
    if (exportFavoritesBtn) {
        exportFavoritesBtn.addEventListener('click', () => {
            const favorites = getStorage('favorites');
            const filename = `nano-banana-favorites-${new Date().toISOString().split('T')[0]}.json`;
            exportData(favorites, filename);
        });
    }

    // 导出历史记录
    const exportHistoryBtn = document.getElementById('export-history-btn');
    if (exportHistoryBtn) {
        exportHistoryBtn.addEventListener('click', () => {
            const history = getStorage('history');
            const filename = `nano-banana-history-${new Date().toISOString().split('T')[0]}.json`;
            exportData(history, filename);
        });
    }

    // --- 页面卸载清理 ---
    window.addEventListener('beforeunload', () => {
        cleanupGalleryPreviewer();
        
        // 清理上传文件的dataUrl
        uploadedFiles.forEach(file => {
            if (file.dataUrl && file.dataUrl.startsWith('blob:')) {
                URL.revokeObjectURL(file.dataUrl);
            }
        });
        
        // 清空数组
        uploadedFiles.length = 0;
        currentExamples.length = 0;
        allExamples.length = 0;
    });

    // --- 页面可见性变化时清理 ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cleanupGalleryPreviewer();
        }
    });

    initialize();
});