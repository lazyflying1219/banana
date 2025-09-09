document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('!!! DOMContentLoaded event fired, starting script execution...');
        
        // --- 元素获取 ---
        const tabTextToImage = document.getElementById('tab-text-to-image');
        const tabImageToImage = document.getElementById('tab-image-to-image');
        const tabImageEdit = document.getElementById('tab-image-edit');
        const textToImagePanel = document.getElementById('text-to-image-panel');
        const imageToImagePanel = document.getElementById('image-to-image-panel');
        const imageEditPanel = document.getElementById('image-edit-panel');
        const promptInputText = document.getElementById('prompt-input-text');
        const promptInputImage = document.getElementById('prompt-input-image');
        const generateBtnText = document.getElementById('generate-btn-text');
        const generateBtnImage = document.getElementById('generate-btn-image');
        const generateBtnEdit = document.getElementById('generate-btn-edit');

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
    let currentItemInDetailView = null; // 用于详情视图的状态管理
    let selectedRatio = '16:9'; // 默认选中的比例
    
    // --- 图编辑功能状态变量 ---
    let editCanvas = null;
    let editCtx = null;
    window.isDrawing = false; // 将 isDrawing 设为全局变量，确保所有函数都能访问
    window.currentTool = 'rectangle'; // 将 currentTool 设为全局变量
    window.currentColor = '#ff0000'; // 将 currentColor 设为全局变量
    let editImage = null;
    window.editImageUploaded = false; // 将 editImageUploaded 设为全局变量
    let annotations = [];
    let currentAnnotation = null;
    let textInputModal = null;
    window.referenceImages = []; // 将 referenceImages 设为全局变量，存储参考图片
    let editImageDisplayInfo = null; // 存储图片在画布上的显示信息
    window.editUploadedFiles = []; // 将 editUploadedFiles 设为全局变量，图编辑专用的上传文件数组

    // --- 比例数据结构 ---
    const ASPECT_RATIOS = {
        '1:1': { label: '1:1', description: '正方形', baseImage: null }, // 1:1不使用底图
        '16:9': { label: '16:9', description: '宽屏', baseImage: '16_9.png' },
        '9:16': { label: '9:16', description: '竖屏', baseImage: '9_16.png' },
        '4:3': { label: '4:3', description: '标准', baseImage: '4_3.png' },
        '3:4': { label: '3:4', description: '竖版标准', baseImage: '3_4.png' },
        '3:2': { label: '3:2', description: '相机', baseImage: '3_2.png' },
        '2:3': { label: '2:3', description: '竖版相机', baseImage: '2_3.png' }
    };

    // --- (REMOVED) Scroll event handler is no longer needed ---

    // --- 通用函数 ---
    // getStorage/setStorage are now only used for 'favorites'. History uses IndexedDB.
    const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // --- 页签切换 ---
    function switchTab(activeTab, activePanel) {
        [tabTextToImage, tabImageToImage, tabImageEdit].forEach(tab => tab.classList.remove('active'));
        [textToImagePanel, imageToImagePanel, imageEditPanel].forEach(panel => panel.classList.remove('active'));
        activeTab.classList.add('active');
        activePanel.classList.add('active');
        const activeType = activeTab.id === 'tab-text-to-image' ? 'text_to_image' :
                          activeTab.id === 'tab-image-to-image' ? 'image_to_image' : 'image_edit';
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
    async function getProxiedImageUrlWithCache(originalUrl) {
        // 如果没有URL，直接返回
        if (!originalUrl) return originalUrl;
        
        // 如果是data URL，直接返回
        if (originalUrl.startsWith('data:')) return originalUrl;
        
        // 如果是相对路径，直接返回
        if (originalUrl.startsWith('/') && !originalUrl.startsWith('//')) return originalUrl;
        
        // 如果是blob URL，直接返回
        if (originalUrl.startsWith('blob:')) return originalUrl;
        
        // 对于所有外部HTTP/HTTPS URL，先检查缓存
        if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://') || originalUrl.startsWith('//')){
            try {
                // 尝试从缓存获取图片
                const cachedImage = await getCachedImage(originalUrl);
                if (cachedImage) {
                    console.log('Using cached image for URL:', originalUrl);
                    return cachedImage;
                }
                
                // 缓存中没有，使用代理
                console.log('Using proxy for URL:', originalUrl);
                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
                
                // 预加载图片并缓存
                const img = new Image();
                img.onload = async () => {
                    try {
                        // 将图片转换为data URL并缓存
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        // 根据图片类型选择合适的格式和质量
                        let mimeType = 'image/jpeg';
                        let quality = 0.8;
                        
                        // 如果图片有透明通道，使用PNG格式
                        if (img.src.includes('.png') || img.src.includes('.webp')) {
                            mimeType = 'image/png';
                            quality = 1.0;
                        }
                        
                        const dataUrl = canvas.toDataURL(mimeType, quality);
                        await cacheImage(originalUrl, dataUrl);
                        console.log('Image cached successfully:', originalUrl);
                    } catch (error) {
                        console.error('Failed to cache image:', error);
                    }
                };
                
                img.onerror = () => {
                    console.error('Failed to load image for caching:', originalUrl);
                };
                
                img.src = proxyUrl;
                return proxyUrl;
            } catch (error) {
                console.error('Error in image caching process:', error);
                return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
            }
        }
        
        return originalUrl;
    }
    
    // 保持原有的同步版本用于不需要缓存的地方
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
        
        // 如果是blob URL，直接返回
        if (originalUrl.startsWith('blob:')) return originalUrl;
        
        return originalUrl;
    }

    // --- 比例选择器功能 ---
    function initRatioSelector() {
        const ratioContainer = document.getElementById('ratio-buttons-container');
        if (!ratioContainer) return;

        // 清空现有内容
        ratioContainer.innerHTML = '';

        // 创建比例按钮
        Object.entries(ASPECT_RATIOS).forEach(([ratio, config]) => {
            const button = document.createElement('button');
            button.className = 'ratio-button';
            button.dataset.ratio = ratio;
            
            // 设置按钮内容
            const label = document.createElement('div');
            label.className = 'ratio-label';
            label.textContent = config.label;
            
            const description = document.createElement('div');
            description.className = 'ratio-description';
            description.textContent = config.description;
            
            button.appendChild(label);
            button.appendChild(description);
            
            // 设置默认选中状态
            if (ratio === selectedRatio) {
                button.classList.add('selected');
            }
            
            // 添加点击事件
            button.addEventListener('click', () => handleRatioSelection(ratio, button));
            
            ratioContainer.appendChild(button);
        });
    }

    function handleRatioSelection(ratio, buttonElement) {
        // 移除所有选中状态
        document.querySelectorAll('.ratio-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 添加选中状态
        buttonElement.classList.add('selected');
        
        // 更新选中的比例
        selectedRatio = ratio;
        
        // 可选：预加载对应的底图
        preloadBaseImage(ratio);
        
        console.log(`选择了比例: ${ratio}`);
    }

    function preloadBaseImage(ratio) {
        const config = ASPECT_RATIOS[ratio];
        if (config && config.baseImage) {
            const img = new Image();
            img.src = config.baseImage;
            img.onload = () => {
                console.log(`预加载底图成功: ${config.baseImage}`);
            };
            img.onerror = () => {
                console.warn(`预加载底图失败: ${config.baseImage}`);
            };
        }
    }

    // --- 图编辑功能宽高比选择器 ---
    function initEditRatioSelector() {
        const ratioContainer = document.getElementById('edit-ratio-buttons-container');
        if (!ratioContainer) return;

        // 清空现有内容
        ratioContainer.innerHTML = '';

        // 创建比例按钮
        Object.entries(ASPECT_RATIOS).forEach(([ratio, config]) => {
            const button = document.createElement('button');
            button.className = 'ratio-button';
            button.dataset.ratio = ratio;
            
            // 设置按钮内容
            const label = document.createElement('div');
            label.className = 'ratio-label';
            label.textContent = config.label;
            
            const description = document.createElement('div');
            description.className = 'ratio-description';
            description.textContent = config.description;
            
            button.appendChild(label);
            button.appendChild(description);
            
            // 设置默认选中状态
            if (ratio === selectedRatio) {
                button.classList.add('selected');
            }
            
            // 添加点击事件
            button.addEventListener('click', () => handleEditRatioSelection(ratio, button));
            
            ratioContainer.appendChild(button);
        });
    }

    function handleEditRatioSelection(ratio, buttonElement) {
        // 移除所有选中状态
        document.querySelectorAll('#edit-ratio-buttons-container .ratio-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 添加选中状态
        buttonElement.classList.add('selected');
        
        // 更新选中的比例
        selectedRatio = ratio;
        
        // 可选：预加载对应的底图
        preloadBaseImage(ratio);
        
        console.log(`图编辑功能选择了比例: ${ratio}`);
    }

    // --- 懒加载观察器 ---
    const lazyLoadObserver = new IntersectionObserver(async (entries, observer) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                if (src) {
                    try {
                        // 使用带缓存的图片URL处理
                        const cachedSrc = await getProxiedImageUrlWithCache(src);
                        img.src = cachedSrc;
                        img.removeAttribute('data-src');
                    } catch (error) {
                        console.error('Failed to load cached image:', error);
                        // 如果缓存加载失败，回退到原始URL
                        img.src = getProxiedImageUrl(src);
                        img.removeAttribute('data-src');
                    }
                }
                observer.unobserve(img); // Unobserve after loading
            }
        }
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
            if (example.thumbnail && (example.thumbnail.startsWith('http') || example.thumbnail.startsWith('data:image') || example.thumbnail.startsWith('/'))) {
                const img = document.createElement('img');
                img.alt = example.title;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNlYWVhZWEiLz48L3N2Zz4='; // Placeholder
                img.dataset.src = example.thumbnail; // 暂时保留原始URL，在懒加载时再处理缓存
                img.onerror = function() {
                    if (this.dataset.src && (this.dataset.src.startsWith('http') || this.dataset.src.startsWith('/'))) {
                        console.warn(`缩略图加载失败: ${this.dataset.src}`);
                        // 加载失败时显示默认图标
                        this.style.display = 'none';
                        const iconDiv = document.createElement('div');
                        iconDiv.innerHTML = '🖼️';
                        iconDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 85px; height: 85px; font-size: 2em; background-color: var(--bg-color); border-radius: var(--border-radius-small);';
                        this.parentNode.appendChild(iconDiv);
                    }
                };
                thumbItem.appendChild(img);
            } else if (example.thumbnail) {
                // 如果不是URL，则直接渲染HTML内容（图标等）
                thumbItem.innerHTML = example.thumbnail;
                thumbItem.style.display = 'flex';
                thumbItem.style.alignItems = 'center';
                thumbItem.style.justifyContent = 'center';
                thumbItem.style.fontSize = '2em';
                thumbItem.style.backgroundColor = 'var(--bg-color)';
            } else {
                // 没有缩略图时显示默认图标
                thumbItem.innerHTML = '🖼️';
                thumbItem.style.display = 'flex';
                thumbItem.style.alignItems = 'center';
                thumbItem.style.justifyContent = 'center';
                thumbItem.style.fontSize = '2em';
                thumbItem.style.backgroundColor = 'var(--bg-color)';
            }

            // 点击事件
            thumbItem.addEventListener('click', () => openLightbox(index));
 
             // 预览器事件 - 仅在桌面端 (>1024px) 启用
             if (window.matchMedia('(min-width: 1025px) and (hover: hover)').matches) {
                thumbItem.addEventListener('mouseenter', async (e) => {
                    cleanupPreviewInterval();
                    
                    // 保存当前元素的引用，以便在回调中使用
                    const currentElement = e.currentTarget;
                    
                    const imagesToShow = [...(example.inputImages || []), ...(example.outputImages || [])].filter(Boolean);
                    if (imagesToShow.length === 0) imagesToShow.push(example.thumbnail);
                    
                    // 使用带缓存的代理URL
                    let proxiedImages;
                    try {
                        proxiedImages = await Promise.all(
                            imagesToShow.map(async url => {
                                try {
                                    return await getProxiedImageUrlWithCache(url);
                                } catch (error) {
                                    console.error('Failed to load cached image for preview:', error);
                                    return getProxiedImageUrl(url); // 回退到原始URL
                                }
                            })
                        );
                    } catch (error) {
                        console.error('Failed to load preview images:', error);
                        proxiedImages = imagesToShow.map(url => getProxiedImageUrl(url));
                    }

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


                    const previewImages = galleryPreviewer.querySelectorAll('img');
                    if (previewImages.length > 0) {
                        let currentPreviewIndex = 0;
                        
                        // 确保至少有一张图片加载完成后再显示预览器
                        let imagesLoaded = 0;
                        const checkAllImagesLoaded = () => {
                            imagesLoaded++;
                            if (imagesLoaded === previewImages.length) {
                                // 所有图片加载完成，显示预览器
                                previewImages[0].classList.add('active-preview');

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
                                
                                // 设置预览器位置和显示
                                const rect = currentElement.getBoundingClientRect();
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
                            }
                        };
                        
                        // 为每张图片添加加载事件监听器
                        previewImages.forEach(img => {
                            if (img.complete) {
                                checkAllImagesLoaded();
                            } else {
                                img.onload = checkAllImagesLoaded;
                                img.onerror = () => {
                                    console.warn(`Preview image failed to load: ${img.src}`);
                                    checkAllImagesLoaded(); // 即使加载失败也继续
                                };
                            }
                        });
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
    // 防止重复绑定事件监听器
    if (carouselPrev && !carouselPrev.dataset.listenerAdded) {
        carouselPrev.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                loadPage(currentPage);
            }
        });
        carouselPrev.dataset.listenerAdded = 'true';
    }
    
    if (carouselNext && !carouselNext.dataset.listenerAdded) {
        carouselNext.addEventListener('click', () => {
            if (currentPage < Math.ceil(allExamples.length / itemsPerPage) - 1) {
                currentPage++;
                loadPage(currentPage);
            }
        });
        carouselNext.dataset.listenerAdded = 'true';
    }

    // 防止重复绑定事件监听器
    if (selectTemplateBtn && !selectTemplateBtn.dataset.listenerAdded) {
        selectTemplateBtn.addEventListener('click', () => {
            const example = currentExamples[currentIndexOnPage];
            if (!example) return;
            const targetTextArea = textToImagePanel.classList.contains('active') ? promptInputText : promptInputImage;
            if (targetTextArea) {
                targetTextArea.value = example.prompt || '';
                targetTextArea.focus();
            }
        });
        selectTemplateBtn.dataset.listenerAdded = 'true';
    }

    // --- 灯箱 (Lightbox) 功能 ---
    async function updateLightboxImage(index) {
        if (!currentExamples[index]) return;
        const example = currentExamples[index];
        const highResImage = (example.outputImages && example.outputImages) || example.thumbnail;
        
        try {
            // 使用带缓存的图片URL
            const cachedImage = await getProxiedImageUrlWithCache(highResImage);
            lightboxImage.src = cachedImage;
        } catch (error) {
            console.error('Failed to load cached image for lightbox:', error);
            // 如果缓存加载失败，回退到原始URL
            lightboxImage.src = getProxiedImageUrl(highResImage);
        }
        
        lightboxImage.alt = example.title;
        currentLightboxIndex = index;

        // 更新导航按钮状态
        lightboxPrev.style.display = index > 0 ? 'flex' : 'none';
        lightboxNext.style.display = index < currentExamples.length - 1 ? 'flex' : 'none';
    }

    async function openLightbox(index) {
        updateGalleryDisplay(index); // Keep the main UI updated as well
        await updateLightboxImage(index);
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    function closeLightbox() {
        lightboxModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    async function showNextImage() {
        if (currentLightboxIndex < currentExamples.length - 1) {
            await updateLightboxImage(currentLightboxIndex + 1);
        }
    }

    async function showPrevImage() {
        if (currentLightboxIndex > 0) {
            await updateLightboxImage(currentLightboxIndex - 1);
        }
    }

    function handleKeydown(e) {
        if (!lightboxModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            // 只有在画廊模式下（currentLightboxIndex >= 0）才响应左右键
            if (currentLightboxIndex >= 0) {
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
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
            // 使用lightbox的更新函数，而不是直接操作
            currentLightboxIndex = -1; // 设置为特殊值表示单张图片模式
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
        currentGeneratedImage = {
            ...imageData,
            id: imageData.id || `gen_${Date.now()}`,
            timestamp: Date.now()
        };
        console.log('Current generated image set:', currentGeneratedImage);
        updateResultFavoriteIcon();
        
        // 调用addToHistory时，总假定是新生成的图片
        console.log('!!! displayImage: Attempting to add to history:', currentGeneratedImage);
        console.log('!!! displayImage: About to call addToHistory function...');
        
        addToHistory(currentGeneratedImage).then(() => {
            console.log('!!! displayImage: Successfully added to history:', currentGeneratedImage);
        }).catch(error => {
            console.error('!!! displayImage: CRITICAL - Failed to add to history:', error);
        });
    }

    // --- 新增辅助函数：将图片URL转换为Data URL ---
    async function imageToDataUrl(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`无法获取图片: ${url}, 状态: ${response.status}`);
            }
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("图片转换Data URL失败:", error);
            return null;
        }
    }

    async function generateImage() {
        // 检查当前激活的面板
        if (imageEditPanel && imageEditPanel.classList.contains('active')) {
            // 如果是图编辑面板，调用编辑图片生成函数
            return await generateEditedImage();
        } else {
            // 否则调用普通的图片生成函数
            return await generateImageWithRetry();
        }
    }

    async function generateImageWithRetry(retryCount = 0, isTextResponseError = false) {
        // 根据错误类型设置不同的最大重试次数
        const maxRetries = isTextResponseError ? 2 : 3;
        const apiUrl = '/api/generate';
        const modelName = modelNameInput ? modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview';
        const prompt = textToImagePanel.classList.contains('active') ? promptInputText.value : promptInputImage.value;
        
        // 初始图片列表只包含用户上传的图片
        let images = uploadedFiles.map(f => f.dataUrl);

        // 获取选中的比例配置
        const ratioConfig = ASPECT_RATIOS[selectedRatio];
        const baseImage = ratioConfig ? ratioConfig.baseImage : null;

        // 验证输入
        if (!prompt.trim()) {
            alert('请输入提示词');
            return;
        }

        // 只在第一次尝试时设置UI状态
        if (retryCount === 0) {
            // 根据当前激活的面板更新对应的按钮
            if (imageEditPanel && imageEditPanel.classList.contains('active')) {
                const editGenerateBtn = document.getElementById('generate-btn-edit');
                if (editGenerateBtn) {
                    editGenerateBtn.textContent = '编辑中...';
                    editGenerateBtn.disabled = true;
                }
                imageDisplay.innerHTML = '<div class="loading-spinner"><p>正在编辑图片...</p><div class="spinner"></div></div>';
            } else {
                if (generateBtnText && textToImagePanel.classList.contains('active')) {
                    generateBtnText.textContent = '生成中...';
                    generateBtnText.disabled = true;
                } else if (generateBtnImage && imageToImagePanel.classList.contains('active')) {
                    generateBtnImage.textContent = '生成中...';
                    generateBtnImage.disabled = true;
                }
                imageDisplay.innerHTML = '<div class="loading-spinner"><p>正在为您生成图片...</p><div class="spinner"></div></div>';
            }
            imageActions.classList.add('hidden');
        } else {
            // 重试时更新加载信息
            const loadingText = imageDisplay.querySelector('.loading-spinner p');
            if (loadingText) {
                if (isTextResponseError) {
                    loadingText.textContent = `模型返回了文本而非图片，正在自动重试... (${retryCount}/${maxRetries})`;
                } else {
                    loadingText.textContent = `正在重试生成图片... (${retryCount}/${maxRetries})`;
                }
            }
        }

        try {
            // 构建增强的提示词
            let enhancedPrompt = prompt;
            const hasUserImages = uploadedFiles && uploadedFiles.length > 0;
            const hasAspectRatioImage = baseImage && selectedRatio !== '1:1';

            // 添加图片质量增强词
            const qualityEnhancers = "4K, HDR, high detail, sharp focus";
            
            if (hasAspectRatioImage) {
                let imageInstructions = "你是一位专业的图像生成师。请严格遵循以下指令：\n";
                imageInstructions += `- **重要**: 你接收到的最后一张图片是宽高比参考图（我们称之为"画布"）。它的现有内容必须被完全忽略和清除，只使用它的宽高比（${selectedRatio}）作为最终输出的画框。\n`;

                if (hasUserImages) {
                    const userImageCount = uploadedFiles.length;
                    imageInstructions += `- 你接收到的前 ${userImageCount} 张图片是内容源。你的任务是将这些源图片的内容、风格、元素智能地融合、重绘到空白的"画布"上，并完美地填充至 ${selectedRatio} 的宽高比。\n`;
                } else {
                    imageInstructions += `- 你的任务是根据用户的文本提示词，在空白的"画布"上生成全新的内容，并完美地填充至 ${selectedRatio} 的宽高比。\n`;
                }
                imageInstructions += `- 最终生成的图片必须内容完整，填满整个画布，绝不留下任何边框或空白区域。\n`;
                imageInstructions += `- 确保生成的图片具有高质量：${qualityEnhancers}。\n`;
                enhancedPrompt = `${imageInstructions}\n用户的原始需求是："${prompt}"`;

                // 将底图转换为Data URL并添加到图片列表的末尾
                const baseImageAsDataUrl = await imageToDataUrl(baseImage);
                if (baseImageAsDataUrl) {
                    images.push(baseImageAsDataUrl);
                    console.log(`已成功将底图 ${baseImage} 作为最后一张图片添加到请求中。`);
                } else {
                     console.warn(`无法加载底图 ${baseImage}，将按无底图模式继续。`);
                }

            } else if (selectedRatio) {
                const ratioConfig = ASPECT_RATIOS[selectedRatio];
                if (hasUserImages) {
                     enhancedPrompt = `请基于用户上传的图片，根据以下需求进行修改或重绘，最终输出一张 ${ratioConfig.description}(${selectedRatio}) 的图片。确保图片具有高质量：${qualityEnhancers}。\n\n用户的需求是："${prompt}"`;
                } else {
                    enhancedPrompt = `请根据用户的需求生成一张图片。最终图片的宽高比必须为 ${ratioConfig.description} (${selectedRatio})。请确保内容完整并填满整个画面，不要留有边框。确保图片具有高质量：${qualityEnhancers}。\n\n用户的需求是："${prompt}"`;
                }
            } else {
                // 即使没有指定比例，也添加质量增强词
                enhancedPrompt = `请根据用户的需求生成一张高质量图片。确保图片具有：${qualityEnhancers}。\n\n用户的需求是："${prompt}"`;
            }
            
            // 构建请求体，不再需要单独的 baseImage 和 aspectRatio 字段
            const requestBody = {
                prompt: enhancedPrompt,
                model: modelName,
                images: images,
            };

            // 添加调试日志验证API请求payload
            console.log('API Request Payload (first 100 chars of images):', {
                ...requestBody,
                images: requestBody.images.map(img => img.substring(0, 100) + '...')
            });
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
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
                // 成功生成，重置UI状态
                if (imageEditPanel && imageEditPanel.classList.contains('active')) {
                    const editGenerateBtn = document.getElementById('generate-btn-edit');
                    if (editGenerateBtn) {
                        editGenerateBtn.textContent = '编辑图片';
                        editGenerateBtn.disabled = false;
                    }
                } else {
                    if (generateBtnText && textToImagePanel.classList.contains('active')) {
                        generateBtnText.textContent = '生成';
                        generateBtnText.disabled = false;
                    } else if (generateBtnImage && imageToImagePanel.classList.contains('active')) {
                        generateBtnImage.textContent = '生成';
                        generateBtnImage.disabled = false;
                    }
                }
                displayImage({ src: result.src, prompt: prompt, model: modelName });
                return;
            } else {
                // 检查是否是只有文本返回的情况
                // 检查API返回的错误信息
                if (result.error && result.error === 'API响应中未找到图片数据') {
                    // 检查是否有文本响应
                    if (result.responseText || result.rawResponse?.choices?.[0]?.message?.content) {
                        const textContent = result.responseText || result.rawResponse.choices[0].message.content;
                        if (textContent && textContent.length > 0 && !textContent.includes('data:image')) {
                            // 这是一个文本响应错误
                            if (retryCount === 0) {
                                console.log('Model returned text instead of image, auto-retrying...');
                                // 创建一个特殊的错误对象，标记为文本响应错误
                                const textError = new Error('Model returned text instead of image');
                                textError.isTextResponseError = true;
                                throw textError;
                            } else {
                                // 如果是第二次重试，提示用户更改提示词
                                const textError = new Error('Model returned text instead of image. Please try modifying your prompt to be more specific about the image you want to generate.');
                                textError.isTextResponseError = true;
                                throw textError;
                            }
                        }
                    }
                }
                // 其他情况，抛出普通错误
                throw new Error(result.error || 'API 返回数据中未找到图片');
            }

        } catch (error) {
            console.error(`API 生成失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error);
            
            // 检查是否应该重试
            if (retryCount < maxRetries && shouldRetry(error)) {
                console.log(`准备进行第 ${retryCount + 1} 次重试...`);
                
                // 固定延迟60秒
                const delay = 60000; // 60秒
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // 递归重试，传递错误类型
                return await generateImageWithRetry(retryCount + 1, error.isTextResponseError || false);
            }
            
            // 所有重试都失败了，显示错误信息
            // 保存原始错误数据
            const errorWithData = error;
            if (!error.errorData && error.error) {
                errorWithData.errorData = error.error;
            }
            handleGenerationError(errorWithData, retryCount);
        }
    }

    // 判断是否应该重试的函数
    function shouldRetry(error) {
        // 网络错误应该重试
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return true;
        }
        
        // 服务器错误 (5xx) 应该重试
        if (error.error && typeof error.error === 'string') {
            if (error.error.includes('HTTP 5') ||
                error.error.includes('timeout') ||
                error.error.includes('连接') ||
                error.error.includes('服务器')) {
                return true;
            }
        }
        
        // 临时性错误应该重试
        const retryableErrors = [
            'timeout',
            'network',
            'connection',
            'temporary',
            'rate limit',
            'service unavailable',
            'internal server error'
        ];
        
        const errorMessage = (error.message || error.error || '').toLowerCase();
        return retryableErrors.some(keyword => errorMessage.includes(keyword));
    }

    // 处理生成错误的函数
    function handleGenerationError(error, finalRetryCount) {
        // 根据当前激活的面板更新对应的按钮状态
        if (imageEditPanel && imageEditPanel.classList.contains('active')) {
            const editGenerateBtn = document.getElementById('generate-btn-edit');
            if (editGenerateBtn) {
                editGenerateBtn.textContent = '编辑图片';
                editGenerateBtn.disabled = false;
            }
        } else {
            if (generateBtnText && textToImagePanel.classList.contains('active')) {
                generateBtnText.textContent = '生成';
                generateBtnText.disabled = false;
            } else if (generateBtnImage && imageToImagePanel.classList.contains('active')) {
                generateBtnImage.textContent = '生成';
                generateBtnImage.disabled = false;
            }
        }
        
        // 从错误对象中获取详细信息
        const errorData = error.errorData || error;
        
        // 详细的错误信息用于调试
        let errorDetails = {
            message: error.message || '未知错误',
            stack: error.stack || '无堆栈信息',
            name: error.name || '未知错误类型',
            error: errorData.error || null,
            details: errorData.details || null,
            rawResponse: errorData.rawResponse || null,
            responseText: errorData.responseText || null,
            totalRetries: finalRetryCount,
            isTextResponseError: error.isTextResponseError || false
        };
        
        // 如果是网络错误，添加更多信息
        if (error instanceof TypeError && error.message.includes('fetch')) {
            errorDetails.networkError = true;
            errorDetails.suggestion = '请检查网络连接和API地址';
        }
        
        let displayMessage = error.error || error.message || '生成失败，请重试';
        let showRetryButton = true;
        
        // 检查是否是模型返回文本而非图片的错误
        if (error.isTextResponseError) {
            // 文本响应错误的处理
            const maxTextRetries = 2; // 文本响应最多重试2次
            if (finalRetryCount >= maxTextRetries - 1) {
                // 第二次重试后，提示用户更改提示词
                displayMessage = '模型返回了文本而非图片。请尝试修改提示词，更明确地描述您想要生成的图片内容。';
                showRetryButton = false; // 不显示重试按钮
            } else {
                // 第一次重试，显示自动重试信息
                displayMessage = '模型返回了文本而非图片，正在自动重试...';
            }
        } else {
            // 其他错误的处理
            const maxOtherRetries = 3; // 其他错误最多重试3次
            displayMessage += ` (尝试 ${finalRetryCount + 1}/${maxOtherRetries})`;
        }
        
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
        
        // 只有在需要时才添加重试按钮
        if (showRetryButton) {
            const retryBtn = document.createElement('button');
            retryBtn.className = 'retry-btn';
            retryBtn.textContent = '手动重试';
            retryBtn.addEventListener('click', generateImage);
            errorDiv.appendChild(retryBtn);
        }
        
        errorDiv.appendChild(errorP);
        errorDiv.appendChild(debugInfo);
        imageDisplay.innerHTML = '';
        imageDisplay.appendChild(errorDiv);
    }
    if (generateBtnText) {
        generateBtnText.addEventListener('click', generateImage);
    }
    
    if (generateBtnImage) {
        generateBtnImage.addEventListener('click', generateImage);
    }

    // --- 收藏功能 (模板与结果) ---
    async function toggleFavorite(item, type) {
        const itemId = item.id || item.title || item.src;
        if (!itemId) {
            console.warn('无法收藏，因为项目没有有效ID:', item);
            return;
        }
        
        try {
            // 检查是否已经收藏
            const favorites = await getFavoritesDB();
            const existingIndex = favorites.findIndex(fav => fav.id === itemId);
            
            if (existingIndex > -1) {
                // 取消收藏
                await deleteFromFavoritesDB(itemId);
                console.log('已从收藏中移除:', itemId);
            } else {
                // 添加收藏，包含时间戳
                const favoriteItem = {
                    ...item,
                    type: type === 'detail' ? (item.sourceType || 'history') : type, // 保持原始来源类型
                    id: itemId,
                    timestamp: Date.now(),
                    favoriteDate: new Date().toLocaleDateString()
                };
                
                // 确保收藏项包含必要的图片信息
                if (!favoriteItem.thumbnail && favoriteItem.src) {
                    favoriteItem.thumbnail = favoriteItem.src;
                }
                
                await addToFavoritesDB(favoriteItem);
                console.log('已添加到收藏:', favoriteItem);
                
                // 如果是历史记录项，刷新收藏列表
                if (type === 'detail' || type === 'history') {
                    setTimeout(() => {
                        loadFavorites();
                    }, 300); // 给数据库操作一些时间
                }
            }
            
            if (type === 'template') {
                updateTemplateFavoriteIcon();
            } else if (type === 'result') {
                updateResultFavoriteIcon();
            } else if (type === 'detail') {
                // 更新历史记录详情视图的收藏图标
                const favoriteBtn = document.getElementById('favorite-history-detail-btn');
                if (favoriteBtn) {
                    updateFavoriteIcon(favoriteBtn, item);
                }
            }
        } catch (error) {
            console.error('收藏操作失败:', error);
            // 显示错误提示
            showNotification('收藏操作失败，请重试', 'error');
        }
    }

    async function updateFavoriteIcon(button, item) {
        if (!button || !item) return;
        try {
            const itemId = item.id || item.title || item.src;
            const favorites = await getFavoritesDB();
            const isFavorited = favorites.some(fav => fav.id === itemId);
            button.classList.toggle('favorited', isFavorited);
        } catch (error) {
            console.error('更新收藏图标失败:', error);
        }
    }

    async function updateTemplateFavoriteIcon() {
        const example = currentExamples[currentIndexOnPage];
        const btn = document.getElementById('favorite-template-btn');
        if (example && btn) await updateFavoriteIcon(btn, example);
    }
    
    async function updateResultFavoriteIcon() {
        const btn = document.getElementById('favorite-result-btn');
        if (currentGeneratedImage && btn) await updateFavoriteIcon(btn, currentGeneratedImage);
    }

    async function loadFavorites() {
        try {
            const favorites = await getFavoritesDB();
            renderGrid(favoritesGrid, favorites, '暂无收藏', 'favorites');
        } catch (error) {
            console.error('加载收藏失败:', error);
            favoritesGrid.innerHTML = '<p>无法加载收藏。</p>';
        }
    }

    function setupEventListeners() {
        // 使用事件委托，避免重复绑定问题
        console.log('!!! setupEventListeners has been called.');
        console.log('Setting up event listeners...');
        
        // 重新绑定收藏模板按钮 - 使用更安全的方式
        const templateBtn = document.getElementById('favorite-template-btn');
        if (templateBtn && !templateBtn.dataset.eventBound) {
            templateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Template favorite button clicked');
                const example = currentExamples[currentIndexOnPage];
                if (example) {
                    console.log('Toggling favorite for template:', example);
                    toggleFavorite({ ...example, id: example.id || example.title }, 'template').then(() => {
                        updateTemplateFavoriteIcon();
                    });
                }
            });
            templateBtn.dataset.eventBound = 'true';
        }

        // 重新绑定收藏结果按钮 - 使用更可靠的方式
        const resultBtn = document.getElementById('favorite-result-btn');
        if (resultBtn) {
            // 移除旧的事件监听器
            const newResultBtn = resultBtn.cloneNode(true);
            resultBtn.parentNode.replaceChild(newResultBtn, resultBtn);
            
            newResultBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Result favorite button clicked');
                if (currentGeneratedImage) {
                    console.log('Toggling favorite for result:', currentGeneratedImage);
                    toggleFavorite(currentGeneratedImage, 'result').then(() => {
                        updateResultFavoriteIcon();
                    });
                } else {
                    console.warn('No current generated image to favorite');
                }
            });
        }

        // 绑定发送到图生图按钮 - 生成结果
        const sendToImg2ImgBtn = document.getElementById('send-to-img2img-btn');
        if (sendToImg2ImgBtn && !sendToImg2ImgBtn.dataset.eventBound) {
            sendToImg2ImgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Send to img2img button clicked');
                if (currentGeneratedImage && currentGeneratedImage.src) {
                    sendImageToImg2Img(currentGeneratedImage.src, true);
                }
            });
            sendToImg2ImgBtn.dataset.eventBound = 'true';
        }

        // 绑定下载按钮
        const downloadBtn = document.getElementById('download-result-btn');
        if (downloadBtn && !downloadBtn.dataset.eventBound) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Download button clicked');
                if (currentGeneratedImage && currentGeneratedImage.src) {
                    const link = document.createElement('a');
                    // 确保使用完整的URL，包括协议
                    let imageUrl = currentGeneratedImage.src;
                    if (imageUrl.startsWith('//')) {
                        imageUrl = window.location.protocol + imageUrl;
                    } else if (imageUrl.startsWith('/')) {
                        imageUrl = window.location.origin + imageUrl;
                    }
                    link.href = imageUrl;
                    link.download = `nano-banana-${Date.now()}.png`;
                    link.target = '_blank'; // 在新标签页中打开
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
            downloadBtn.dataset.eventBound = 'true';
        }

        // 重新绑定历史详情收藏按钮
        const favoriteHistoryDetailBtn = document.getElementById('favorite-history-detail-btn');
        if(favoriteHistoryDetailBtn && !favoriteHistoryDetailBtn.dataset.eventBound) {
            favoriteHistoryDetailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('History detail favorite button clicked');
                if (currentItemInDetailView) {
                    console.log('Toggling favorite for history detail:', currentItemInDetailView);
                    toggleFavorite(currentItemInDetailView, 'detail');
                    updateFavoriteIcon(favoriteHistoryDetailBtn, currentItemInDetailView);
                }
            });
            favoriteHistoryDetailBtn.dataset.eventBound = 'true';
        }

        // 绑定发送到图生图按钮 - 历史详情
        const sendHistoryToImg2ImgBtn = document.getElementById('send-history-to-img2img-btn');
        if(sendHistoryToImg2ImgBtn && !sendHistoryToImg2ImgBtn.dataset.eventBound) {
            sendHistoryToImg2ImgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Send history to img2img button clicked');
                if (currentItemInDetailView && currentItemInDetailView.src) {
                    sendImageToImg2Img(currentItemInDetailView.src, true);
                    // 关闭历史详情模态框
                    closeModal(historyDetailModal);
                }
            });
            sendHistoryToImg2ImgBtn.dataset.eventBound = 'true';
        }

        // 绑定历史详情下载按钮
        const downloadHistoryBtn = document.getElementById('download-history-detail-btn');
        if (downloadHistoryBtn && !downloadHistoryBtn.dataset.eventBound) {
            downloadHistoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Download history detail button clicked');
                if (currentItemInDetailView && currentItemInDetailView.src) {
                    const link = document.createElement('a');
                    // 确保使用完整的URL，包括协议
                    let imageUrl = currentItemInDetailView.src;
                    if (imageUrl.startsWith('//')) {
                        imageUrl = window.location.protocol + imageUrl;
                    } else if (imageUrl.startsWith('/')) {
                        imageUrl = window.location.origin + imageUrl;
                    }
                    link.href = imageUrl;
                    link.download = `nano-banana-history-${currentItemInDetailView.id}.png`;
                    link.target = '_blank'; // 在新标签页中打开
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
            downloadHistoryBtn.dataset.eventBound = 'true';
        }
    }

    // 发送图片到图生图功能
    function sendImageToImg2Img(imageSrc, isMultiple = true) {
        console.log('Sending image to img2img:', imageSrc);
        
        // 切换到图生图标签
        const tabImageToImage = document.getElementById('tab-image-to-image');
        const imageToImagePanel = document.getElementById('image-to-image-panel');
        const textToImagePanel = document.getElementById('text-to-image-panel');
        
        if (tabImageToImage && imageToImagePanel && textToImagePanel) {
            // 切换标签
            switchTab(tabImageToImage, imageToImagePanel);
            
            // 确保图片URL是完整的，如果是相对路径则转换为绝对路径
            const processedSrc = getProxiedImageUrl(imageSrc);
            console.log('Processed image URL:', processedSrc);
            
            // 先测试图片是否可以加载
            const testImg = new Image();
            testImg.onload = () => {
                // 图片加载成功，继续处理
                fetch(processedSrc)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        // 创建File对象
                        const file = new File([blob], `image_${Date.now()}.png`, { type: 'image/png' });
                        const reader = new FileReader();
                        
                        reader.onload = (e) => {
                            // 如果不是多图模式，清空现有的上传文件
                            if (!isMultiple) {
                                uploadedFiles.length = 0;
                            }
                            
                            // 检查是否已达到最大上传数量
                            const maxFiles = 9;
                            if (uploadedFiles.length >= maxFiles) {
                                showNotification(`最多只能上传 ${maxFiles} 张图片`, 'error');
                                return;
                            }
                            
                            // 添加新图片到上传文件列表
                            uploadedFiles.push({
                                file: file,
                                dataUrl: e.target.result
                            });
                            
                            // 重新渲染上传预览
                            renderUploadPreviews();
                            
                            // 显示成功提示
                            const message = isMultiple ?
                                `已添加图片到图生图 (${uploadedFiles.length}/${maxFiles})` :
                                '图片已发送到图生图！';
                            showNotification(message, 'success');
                            
                            console.log('Image successfully added to img2img');
                        };
                        
                        reader.onerror = () => {
                            console.error('Failed to read image data');
                            showNotification('读取图片数据失败，请重试', 'error');
                        };
                        
                        reader.readAsDataURL(file);
                    })
                    .catch(error => {
                        console.error('Failed to fetch image:', error);
                        showNotification('获取图片失败，请重试', 'error');
                    });
            };
            
            testImg.onerror = () => {
                console.error('Failed to load image:', processedSrc);
                showNotification('图片加载失败，请重试', 'error');
            };
            
            testImg.src = processedSrc;
        }
    }

    // 显示通知功能
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007aff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3秒后自动消失
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 专门为历史详情模态框绑定按钮事件
    function setupHistoryDetailButtons() {
        // 绑定收藏按钮 - 使用更可靠的方式
        const favoriteBtn = document.getElementById('favorite-history-detail-btn');
        if (favoriteBtn) {
            // 移除旧的事件监听器
            const newFavoriteBtn = favoriteBtn.cloneNode(true);
            favoriteBtn.parentNode.replaceChild(newFavoriteBtn, favoriteBtn);
            
            newFavoriteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('History detail favorite button clicked');
                if (currentItemInDetailView) {
                    console.log('Toggling favorite for history detail:', currentItemInDetailView);
                    // 确保项目有正确的ID和类型
                    const itemToFavorite = {
                        ...currentItemInDetailView,
                        sourceType: 'history' // 明确标记来源类型
                    };
                    toggleFavorite(itemToFavorite, 'detail');
                    // 延迟更新图标状态，确保收藏状态已保存
                    setTimeout(() => {
                        updateFavoriteIcon(newFavoriteBtn, itemToFavorite);
                    }, 100);
                }
            });
            
            // 更新收藏图标
            updateFavoriteIcon(newFavoriteBtn, currentItemInDetailView);
        }

        // 绑定发送到图生图按钮
        const sendBtn = document.getElementById('send-history-to-img2img-btn');
        if (sendBtn) {
            // 移除旧的事件监听器
            sendBtn.replaceWith(sendBtn.cloneNode(true));
            const newSendBtn = document.getElementById('send-history-to-img2img-btn');
            
            newSendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Send history to img2img button clicked');
                if (currentItemInDetailView && currentItemInDetailView.src) {
                    sendImageToImg2Img(currentItemInDetailView.src, true);
                    // 关闭历史详情模态框
                    closeModal(historyDetailModal);
                }
            });
        }

        // 绑定下载按钮
        const downloadBtn = document.getElementById('download-history-detail-btn');
        if (downloadBtn) {
            downloadBtn.replaceWith(downloadBtn.cloneNode(true));
            const newDownloadBtn = document.getElementById('download-history-detail-btn');
            
            newDownloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentItemInDetailView && currentItemInDetailView.src) {
                    const link = document.createElement('a');
                    link.href = currentItemInDetailView.src;
                    link.download = `nano-banana-history-${currentItemInDetailView.id}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        }
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
            console.log('!!! addToHistory called with imageData:', imageData);
            
            // 简化版本：暂时注释掉复杂逻辑，只保留核心调用
            const historyItem = {
                prompt: imageData.prompt || 'Test prompt',
                model: imageData.model || 'test-model',
                src: imageData.src,
                thumbnail: imageData.src, // 暂时使用原图作为缩略图
                timestamp: Date.now(),
                id: imageData.id || `gen_${Date.now()}`
            };
            
            console.log('!!! Simplified history item prepared:', historyItem);
            console.log('!!! Attempting to call addToHistoryDB...');
            
            await addToHistoryDB(historyItem);
            console.log('!!! Successfully added to history DB.');

        } catch (error) {
            console.error('!!! CRITICAL: Failed to add to history:', error);
            console.error('!!! Error stack:', error.stack);
            console.error('!!! Error name:', error.name);
            console.error('!!! Error message:', error.message);
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
            await deleteFromFavoritesDB(itemId);
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
    async function clearAllFavorites() {
        if (!confirm('确定要清空所有收藏吗？此操作不可恢复。')) return;
        await clearFavoritesDB();
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
            
            // 对于历史记录和收藏，直接使用同步版本的getProxiedImageUrl
            // 因为这些图片需要立即显示，而不是懒加载
            img.alt = 'Image';
            img.src = getProxiedImageUrl(imgSrc);
            img.onerror = function() {
                console.warn(`Grid image load failed: ${imgSrc}`);
                // 加载失败时显示默认图标
                this.style.display = 'none';
                const iconDiv = document.createElement('div');
                iconDiv.innerHTML = '🖼️';
                iconDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100px; font-size: 2em; background-color: var(--bg-color); border-radius: var(--border-radius-small);';
                this.parentNode.appendChild(iconDiv);
            };
            
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
                const fullSrc = type === 'history' ? item.src : (item.src || item.thumbnail);
                currentItemInDetailView = {
                    ...item,
                    src: fullSrc,
                    id: item.id || item.title || item.src,
                    sourceType: type // 添加来源类型标识
                };

                // 确保图片URL是完整的，如果是相对路径则转换为绝对路径
                const processedSrc = getProxiedImageUrl(fullSrc);
                
                // 对于收藏中的图片，确保URL是可访问的
                if (type === 'favorites' && processedSrc) {
                    // 预加载图片以确保URL有效
                    const testImg = new Image();
                    testImg.onload = () => {
                        // 图片加载成功，设置详情模态框
                        historyDetailImage.src = processedSrc;
                        historyDetailPrompt.textContent = item.prompt;
                        
                        // 根据来源类型设置模态框标题
                        const titleElement = document.getElementById('history-detail-title');
                        if (titleElement) {
                            titleElement.textContent = type === 'favorites' ? '收藏详情' : '历史记录详情';
                        }
                        
                        // 重新绑定按钮事件
                        setupHistoryDetailButtons();
                        
                        downloadHistoryDetailBtn.onclick = () => {
                            const link = document.createElement('a');
                            link.href = processedSrc;
                            link.download = `nano-banana-${type}-${currentItemInDetailView.id}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        };

                        openModal(historyDetailModal);
                    };
                    testImg.onerror = () => {
                        // 图片加载失败，显示错误提示
                        showNotification('无法加载图片，请重试', 'error');
                        console.error('Failed to load image from favorites:', processedSrc);
                    };
                    testImg.src = processedSrc;
                } else {
                    // 对于历史记录或其他类型，直接显示
                    historyDetailImage.src = processedSrc;
                    historyDetailPrompt.textContent = item.prompt;
                    
                    // 根据来源类型设置模态框标题
                    const titleElement = document.getElementById('history-detail-title');
                    if (titleElement) {
                        titleElement.textContent = type === 'favorites' ? '收藏详情' : '历史记录详情';
                    }
                    
                    // 重新绑定按钮事件
                    setupHistoryDetailButtons();
                    
                    downloadHistoryDetailBtn.onclick = () => {
                        const link = document.createElement('a');
                        link.href = processedSrc;
                        link.download = `nano-banana-${type}-${currentItemInDetailView.id}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    };

                    openModal(historyDetailModal);
                }
            });
            
            // 添加时间信息（如果有）
            if (item.timestamp || item.id) {
                const timeInfo = document.createElement('div');
                timeInfo.style.cssText = 'font-size: 0.75em; color: var(--text-color-secondary); padding: 5px 10px;';
                const date = item.timestamp ? new Date(item.timestamp) : new Date(item.id);
                timeInfo.textContent = date.toLocaleString();
                gridItem.appendChild(timeInfo);
            }
            
            // 创建图片容器
            const imageContainer = document.createElement('div');
            imageContainer.className = 'grid-item-image-container';
            imageContainer.appendChild(img);
            
            // 创建内容容器
            const contentContainer = document.createElement('div');
            contentContainer.className = 'grid-item-content';
            contentContainer.appendChild(p);
            
            gridItem.appendChild(imageContainer);
            gridItem.appendChild(contentContainer);
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
        const maxFiles = 9;
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
    const initialize = async () => {
        console.log('=== 开始初始化应用 ===');
        
        // 清理过期的图片缓存
        try {
            await clearExpiredImageCache();
            console.log('Expired image cache cleared');
        } catch (error) {
            console.error('Failed to clear expired image cache:', error);
        }
        
        // 确保所有必要的DOM元素已加载
        if (!tabTextToImage || !tabImageToImage || !tabImageEdit) {
            console.error('标签页元素未找到，延迟初始化');
            setTimeout(initialize, 100);
            return;
        }
        
        if (!textToImagePanel || !imageToImagePanel || !imageEditPanel) {
            console.error('面板元素未找到，延迟初始化');
            setTimeout(initialize, 100);
            return;
        }
        
        // 绑定标签页切换事件
        tabTextToImage.addEventListener('click', () => switchTab(tabTextToImage, textToImagePanel));
        tabImageToImage.addEventListener('click', () => switchTab(tabImageToImage, imageToImagePanel));
        tabImageEdit.addEventListener('click', () => switchTab(tabImageEdit, imageEditPanel));

        // 初始化比例选择器
        initRatioSelector();

        // 从localStorage加载设置
        const savedModelName = localStorage.getItem('modelName');
        
        if (modelNameInput) modelNameInput.value = savedModelName || 'vertexpic-gemini-2.5-flash-image-preview';

        // 初始化主题
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

        // 初始化默认标签页
        switchTab(tabTextToImage, textToImagePanel);

        // 初始化图编辑功能 - 确保在所有其他初始化之后
        console.log('准备初始化图编辑功能...');
        setTimeout(() => {
            try {
                initImageEdit();
                console.log('图编辑功能初始化完成');
            } catch (error) {
                console.error('图编辑功能初始化失败:', error);
                // 如果初始化失败，尝试延迟重试
                setTimeout(() => {
                    console.log('尝试重新初始化图编辑功能...');
                    try {
                        initImageEdit();
                        console.log('图编辑功能重新初始化成功');
                    } catch (retryError) {
                        console.error('图编辑功能重新初始化失败:', retryError);
                    }
                }, 500);
            }
        }, 200);

        // Adjust body padding to prevent content from being hidden by the fixed header
        const header = document.querySelector('header');
        if (header) {
            const headerHeight = header.offsetHeight;
            document.body.style.paddingTop = `${headerHeight + 25}px`; // Add extra space
        }

        // 灯箱事件监听
        // 安全绑定灯箱事件监听器
        if (lightboxClose && !lightboxClose.dataset.listenerAdded) {
            lightboxClose.addEventListener('click', closeLightbox);
            lightboxClose.dataset.listenerAdded = 'true';
        }
        if (lightboxModal && !lightboxModal.dataset.listenerAdded) {
            lightboxModal.addEventListener('click', (e) => {
                // 确保点击的是背景而不是图片或其他元素
                if (e.target === lightboxModal) {
                    closeLightbox();
                }
            });
            lightboxModal.dataset.listenerAdded = 'true';
        }
        // 阻止图片和内容区域点击事件冒泡
        if (lightboxImage && !lightboxImage.dataset.listenerAdded) {
            lightboxImage.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            lightboxImage.dataset.listenerAdded = 'true';
        }
        // 获取lightbox-content元素并添加点击阻止
        const lightboxContent = document.querySelector('.lightbox-content');
        if (lightboxContent && !lightboxContent.dataset.listenerAdded) {
            lightboxContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            lightboxContent.dataset.listenerAdded = 'true';
        }
        if (lightboxPrev && !lightboxPrev.dataset.listenerAdded) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrevImage();
            });
            lightboxPrev.dataset.listenerAdded = 'true';
        }
        if (lightboxNext && !lightboxNext.dataset.listenerAdded) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showNextImage();
            });
            lightboxNext.dataset.listenerAdded = 'true';
        }
        if (!document.body.dataset.keydownListenerAdded) {
            document.addEventListener('keydown', handleKeydown);
            document.body.dataset.keydownListenerAdded = 'true';
        }
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
        exportFavoritesBtn.addEventListener('click', async () => {
            try {
                const favorites = await getFavoritesDB();
                const filename = `nano-banana-favorites-${new Date().toISOString().split('T')[0]}.json`;
                exportData(favorites, filename);
            } catch (error) {
                console.error('导出收藏失败:', error);
                showNotification('导出收藏失败，请重试', 'error');
            }
        });
    }

    // 导出历史记录
    const exportHistoryBtn = document.getElementById('export-history-btn');
    if (exportHistoryBtn) {
        exportHistoryBtn.addEventListener('click', async () => {
            try {
                const history = await getHistoryDB();
                const filename = `nano-banana-history-${new Date().toISOString().split('T')[0]}.json`;
                exportData(history, filename);
            } catch (error) {
                console.error('导出历史记录失败:', error);
                showNotification('导出历史记录失败，请重试', 'error');
            }
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
    
    // 初始化后立即绑定事件监听器
    setupEventListeners();
    
    // 确保在页面加载完成后重新绑定历史详情模态框的按钮
    setTimeout(() => {
        setupHistoryDetailButtons();
    }, 100);
    
    // 使用事件委托模式处理所有动态按钮点击事件
    // 找到静态的父容器并绑定事件监听器
    const resultsContainer = document.getElementById('image-actions') || document.body;
    const historyContainer = document.getElementById('history-grid') || document.body;
    const favoritesContainer = document.getElementById('favorites-grid') || document.body;
    
    // 为生成结果区域的按钮使用事件委托
    resultsContainer.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        
        console.log('Result area button clicked:', target.id, target.className);
        
        // 收藏结果按钮 - 更精确的匹配
        if (target.id === 'favorite-result-btn' ||
            (target.classList.contains('icon-button') && target.closest('#image-actions'))) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Result favorite button clicked via delegation');
            if (currentGeneratedImage) {
                console.log('Toggling favorite for result via delegation:', currentGeneratedImage);
                toggleFavorite(currentGeneratedImage, 'result').then(() => {
                    updateResultFavoriteIcon();
                });
            }
            return;
        }
        
        // 下载结果按钮
        if (target.id === 'download-result-btn' || target.classList.contains('download-result-btn')) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Download button clicked via delegation');
            if (currentGeneratedImage && currentGeneratedImage.src) {
                const link = document.createElement('a');
                // 确保使用完整的URL，包括协议
                let imageUrl = currentGeneratedImage.src;
                if (imageUrl.startsWith('//')) {
                    imageUrl = window.location.protocol + imageUrl;
                } else if (imageUrl.startsWith('/')) {
                    imageUrl = window.location.origin + imageUrl;
                }
                link.href = imageUrl;
                link.download = `nano-banana-${Date.now()}.png`;
                link.target = '_blank'; // 在新标签页中打开
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            return;
        }
        
        // 发送到图生图按钮
        if (target.id === 'send-to-img2img-btn' || target.classList.contains('send-to-img2img-btn')) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Send to img2img button clicked via delegation');
            if (currentGeneratedImage && currentGeneratedImage.src) {
                sendImageToImg2Img(currentGeneratedImage.src, true);
            }
            return;
        }
    });
    
    // 为历史记录和收藏夹区域使用事件委托
    [historyContainer, favoritesContainer].forEach(container => {
        container.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (!target) return;
            
            console.log('Grid area button clicked:', target.id, target.className);
            
            // 历史详情收藏按钮 - 更精确的匹配
            if (target.id === 'favorite-history-detail-btn' ||
                (target.classList.contains('icon-button') && target.closest('.modal-header-actions'))) {
                event.preventDefault();
                event.stopPropagation();
                console.log('History detail favorite button clicked via delegation');
                if (currentItemInDetailView) {
                    console.log('Toggling favorite for history detail via delegation:', currentItemInDetailView);
                    toggleFavorite(currentItemInDetailView, 'detail').then(() => {
                        updateFavoriteIcon(target, currentItemInDetailView);
                    });
                }
                return;
            }
            
            // 历史详情下载按钮
            if (target.id === 'download-history-detail-btn' || target.classList.contains('download-history-detail-btn')) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Download history detail button clicked via delegation');
                if (currentItemInDetailView && currentItemInDetailView.src) {
                    const link = document.createElement('a');
                    // 确保使用完整的URL，包括协议
                    let imageUrl = currentItemInDetailView.src;
                    if (imageUrl.startsWith('//')) {
                        imageUrl = window.location.protocol + imageUrl;
                    } else if (imageUrl.startsWith('/')) {
                        imageUrl = window.location.origin + imageUrl;
                    }
                    link.href = imageUrl;
                    link.download = `nano-banana-history-${currentItemInDetailView.id}.png`;
                    link.target = '_blank'; // 在新标签页中打开
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                return;
            }
            
            // 历史详情发送到图生图按钮
            if (target.id === 'send-history-to-img2img-btn' || target.classList.contains('send-history-to-img2img-btn')) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Send history to img2img button clicked via delegation');
                if (currentItemInDetailView && currentItemInDetailView.src) {
                    sendImageToImg2Img(currentItemInDetailView.src, true);
                    closeModal(historyDetailModal);
                }
                return;
            }
        });
    });
    } catch (error) {
        console.error('!!! FATAL SCRIPT ERROR:', error);
        console.error('!!! Error stack:', error.stack);
        console.error('!!! Error name:', error.name);
        console.error('!!! Error message:', error.message);
        
        // 显示用户友好的错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #dc3545; color: white; padding: 20px; border-radius: 8px; z-index: 10000; max-width: 500px; text-align: center;';
        errorDiv.innerHTML = `
            <h3>⚠️ 脚本执行失败</h3>
            <p>检测到致命错误，请打开开发者工具查看详细信息。</p>
            <p style="font-size: 0.8em; margin-top: 10px;">错误类型: ${error.name}</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; background: white; color: #dc3545; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">关闭</button>
        `;
        document.body.appendChild(errorDiv);
    }

});



    // --- 图编辑功能初始化 ---
    function initImageEdit() {
        console.log('=== 初始化图编辑功能 ===');
        
        // 确保全局变量 currentColor 已定义
        if (typeof window.currentColor === 'undefined' || window.currentColor === null) {
            window.currentColor = '#ff0000'; // 默认红色
            console.log('初始化 currentColor 为默认值:', window.currentColor);
        }
        
        // 初始化图编辑专用的上传文件数组
        window.editUploadedFiles = [];
        console.log('初始化 editUploadedFiles 为默认值: []');
        
        // 确保全局变量 referenceImages 已定义
        if (typeof window.referenceImages === 'undefined') {
            window.referenceImages = [];
            console.log('初始化 referenceImages 为默认值: []');
        }
        
        // 初始化全局变量 annotations 和 currentAnnotation
        window.annotations = [];
        window.currentAnnotation = null;
        
        console.log('图编辑调试 - 初始化开始:', {
            hasEditCanvas: !!document.getElementById('edit-canvas'),
            hasColorInput: !!document.getElementById('edit-color'),
            hasColorPresets: !!document.querySelectorAll('.color-preset').length,
            hasToolButtons: !!document.querySelectorAll('.tool-btn').length, // 修正选择器
            currentColor: window.currentColor,
            currentTool: window.currentTool
        });
        
        // 获取画布和上下文
        window.editCanvas = document.getElementById('edit-canvas');
        console.log('获取画布元素:', !!window.editCanvas);
        if (!window.editCanvas) {
            console.error('编辑画布元素不存在');
            return;
        }
        window.editCtx = window.editCanvas.getContext('2d');
        console.log('获取画布上下文:', !!window.editCtx);
        
        // 设置画布尺寸
        const container = document.querySelector('.edit-canvas-container');
        if (container) {
            window.editCanvas.width = container.clientWidth;
            window.editCanvas.height = container.clientHeight;
        }
        
        // 初始化图编辑功能的宽高比选择器
        try {
            initEditRatioSelector();
        } catch (error) {
            console.error('初始化图编辑宽高比选择器失败:', error);
            // 继续执行其他初始化，不阻止整个功能
        }
        
        // 绑定工具选择事件 - 使用事件委托确保动态可用
        const editPanel = document.getElementById('image-edit-panel');
        if (editPanel) {
            editPanel.addEventListener('click', (e) => {
                const btn = e.target.closest('.tool-btn');
                if (btn) {
                    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    window.currentTool = btn.dataset.tool;
                    console.log('工具已更改为:', window.currentTool);
                }
            });
        }
        
        // 默认选择矩形工具
        const defaultTool = document.querySelector('.tool-btn[data-tool="rectangle"]');
        if (defaultTool) {
            defaultTool.classList.add('active');
            window.currentTool = 'rectangle';
            console.log('默认工具已设置为:', window.currentTool);
        }
        
        // 绑定颜色选择事件
        const colorInput = document.getElementById('edit-color');
        if (colorInput) {
            // 设置初始颜色值
            colorInput.value = window.currentColor;
            colorInput.addEventListener('change', (e) => {
                window.currentColor = e.target.value;
                console.log('颜色已更改为:', window.currentColor);
            });
        }
        
        // 绑定预设颜色选择事件
        document.querySelectorAll('.color-preset').forEach(colorPreset => {
            colorPreset.addEventListener('click', () => {
                document.querySelectorAll('.color-preset').forEach(c => c.classList.remove('active'));
                colorPreset.classList.add('active');
                window.currentColor = colorPreset.dataset.color;
                const colorInput = document.getElementById('edit-color');
                if (colorInput) {
                    colorInput.value = window.currentColor;
                }
                console.log('预设颜色已更改为:', window.currentColor);
            });
        });
        
        // 绑定画布事件 - 使用全局变量确保事件正确绑定
        if (window.editCanvas) {
            // 先移除可能存在的事件监听器，避免重复绑定
            window.editCanvas.removeEventListener('mousedown', startDrawing);
            window.editCanvas.removeEventListener('mousemove', draw);
            window.editCanvas.removeEventListener('mouseup', stopDrawing);
            window.editCanvas.removeEventListener('mouseout', stopDrawing);
            window.editCanvas.removeEventListener('touchstart', handleTouch);
            window.editCanvas.removeEventListener('touchmove', handleTouch);
            window.editCanvas.removeEventListener('touchend', stopDrawing);
            
            // 重新绑定事件
            window.editCanvas.addEventListener('mousedown', startDrawing);
            window.editCanvas.addEventListener('mousemove', draw);
            window.editCanvas.addEventListener('mouseup', stopDrawing);
            window.editCanvas.addEventListener('mouseout', stopDrawing);
            window.editCanvas.addEventListener('touchstart', handleTouch, { passive: true });
            window.editCanvas.addEventListener('touchmove', handleTouch, { passive: true });
            window.editCanvas.addEventListener('touchend', stopDrawing);
            
            console.log('画布事件绑定完成');
        }
        
        // 绑定操作按钮事件
        const clearBtn = document.getElementById('edit-clear-btn');
        if (clearBtn) {
            // 先移除可能存在的事件监听器，避免重复绑定
            clearBtn.removeEventListener('click', clearAnnotations);
            clearBtn.addEventListener('click', clearAnnotations);
            console.log('清除按钮事件绑定完成');
        }
        
        const resetBtn = document.getElementById('edit-reset-btn');
        if (resetBtn) {
            // 先移除可能存在的事件监听器，避免重复绑定
            resetBtn.removeEventListener('click', resetEditImage);
            resetBtn.addEventListener('click', resetEditImage);
            console.log('重置按钮事件绑定完成');
        }
        
        // --- 图编辑专用的上传逻辑 ---
        const editImageInput = document.getElementById('edit-image-input');
        const editUploadArea = document.getElementById('edit-upload-area');

        if (editImageInput && editUploadArea) {
            // 处理点击上传
            editUploadArea.addEventListener('click', () => editImageInput.click());

            // 处理文件选择 - 专用图像编辑上传处理
            editImageInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    console.log('图编辑主图片文件选择事件触发，文件数量:', e.target.files.length);
                    
                    // 清空图编辑专用的上传文件数组
                    window.editUploadedFiles.length = 0;
                    
                    // 专用处理逻辑
                    const files = e.target.files;
                    const maxFiles = 1; // 图像编辑只允许一张主图片
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    
                    [...files].forEach(file => {
                        console.log('处理图编辑主图片文件:', file.name);
                        
                        if (!file.type.startsWith('image/')) {
                            alert(`文件 "${file.name}" 不是图片格式`);
                            return;
                        }
                        
                        if (file.size > maxSize) {
                            alert(`文件 "${file.name}" 太大，请选择小于 10MB 的图片`);
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            console.log('图编辑主图片文件读取完成:', file.name);
                            window.editUploadedFiles.push({ file, dataUrl: event.target.result });
                            
                            // 显示图片预览
                            renderEditUploadPreviews();
                            
                            // 图片上传后，初始化图编辑画布
                            initializeEditCanvas();
                        };
                        reader.onerror = () => {
                            console.error('读取文件失败:', file.name);
                            alert(`读取文件 "${file.name}" 失败`);
                        };
                        reader.readAsDataURL(file);
                    });
                }
                e.target.value = ''; // 允许重复上传同一文件
            });

            // 处理拖放上传 - 图编辑专用逻辑
            editUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                editUploadArea.classList.add('dragging');
            });
            
            editUploadArea.addEventListener('dragleave', () => {
                editUploadArea.classList.remove('dragging');
            });
            
            editUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                editUploadArea.classList.remove('dragging');
                if (e.dataTransfer.files.length > 0) {
                    console.log('图编辑主图片拖放事件触发，文件数量:', e.dataTransfer.files.length);
                    
                    // 清空图编辑专用的上传文件数组
                    window.editUploadedFiles.length = 0;
                    
                    // 专用处理逻辑
                    const files = e.dataTransfer.files;
                    const maxFiles = 1; // 图像编辑只允许一张主图片
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    
                    [...files].forEach(file => {
                        console.log('处理拖放的图编辑主图片文件:', file.name);
                        
                        if (!file.type.startsWith('image/')) {
                            alert(`文件 "${file.name}" 不是图片格式`);
                            return;
                        }
                        
                        if (file.size > maxSize) {
                            alert(`文件 "${file.name}" 太大，请选择小于 10MB 的图片`);
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            console.log('拖放的图编辑主图片文件读取完成:', file.name);
                            window.editUploadedFiles.push({ file, dataUrl: event.target.result });
                            
                            // 显示图片预览
                            renderEditUploadPreviews();
                            
                            // 图片上传后，初始化图编辑画布
                            initializeEditCanvas();
                        };
                        reader.onerror = () => {
                            console.error('读取拖放文件失败:', file.name);
                            alert(`读取文件 "${file.name}" 失败`);
                        };
                        reader.readAsDataURL(file);
                    });
                }
            });
            
            console.log('图编辑主图片上传事件绑定完成');
        }
        // --- 上传逻辑重构结束 ---

        // 绑定参考图片上传 - 图编辑专用功能
        const editReferenceInput = document.getElementById('edit-reference-input');
        const editReferenceUploadArea = document.getElementById('edit-reference-upload-area');

        if (editReferenceInput && editReferenceUploadArea) {
            // 处理点击上传
            editReferenceUploadArea.addEventListener('click', () => editReferenceInput.click());

            // 处理文件选择 - 专用参考图片上传处理
            editReferenceInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    console.log('参考图片文件选择事件触发，文件数量:', e.target.files.length);
                    
                    // 检查是否已上传主编辑图片
                    if (!window.editImageUploaded) {
                        if (typeof window.showNotification === 'function') {
                            window.showNotification('请先上传主编辑图片', 'error');
                        } else if (typeof showNotification === 'function') {
                            showNotification('请先上传主编辑图片', 'error');
                        } else {
                            alert('请先上传主编辑图片');
                        }
                        e.target.value = '';
                        return;
                    }
                    
                    // 添加参考图片到图编辑专用数组
                    const files = e.target.files;
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    let addedCount = 0;
                    let filesToProcess = files.length;
                    
                    [...files].forEach(file => {
                        console.log('处理参考图片文件:', file.name);
                        
                        if (!file.type.startsWith('image/')) {
                            alert(`文件 "${file.name}" 不是图片格式`);
                            filesToProcess--;
                            if (filesToProcess === 0 && addedCount === 0) {
                                e.target.value = '';
                            }
                            return;
                        }
                        
                        if (file.size > maxSize) {
                            alert(`文件 "${file.name}" 太大，请选择小于 10MB 的图片`);
                            filesToProcess--;
                            if (filesToProcess === 0 && addedCount === 0) {
                                e.target.value = '';
                            }
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            console.log('参考图片文件读取完成:', file.name);
                            // 添加到editUploadedFiles数组（参考图片从索引1开始）
                            window.editUploadedFiles.push({ file, dataUrl: event.target.result });
                            
                            // 同时添加到referenceImages数组以便显示
                            window.referenceImages.push({
                                file: file,
                                dataUrl: event.target.result,
                                img: null
                            });
                            
                            addedCount++;
                            console.log(`已添加第 ${addedCount} 张参考图片，共需处理 ${filesToProcess} 张`);
                            
                            // 每添加一张图片就立即更新显示
                            updateReferenceThumbnails();
                            
                            if (addedCount === filesToProcess) {
                                console.log('所有参考图片文件处理完成');
                                if (typeof window.showNotification === 'function') {
                                    window.showNotification(`已添加 ${addedCount} 张参考图片`, 'success');
                                } else if (typeof showNotification === 'function') {
                                    showNotification(`已添加 ${addedCount} 张参考图片`, 'success');
                                } else {
                                    console.log(`已添加 ${addedCount} 张参考图片`);
                                }
                                console.log(`图编辑参考图片上传成功: ${addedCount}张`);
                            }
                        };
                        reader.onerror = () => {
                            console.error('读取文件失败:', file.name);
                            alert(`读取文件 "${file.name}" 失败`);
                            filesToProcess--;
                            if (addedCount === filesToProcess) {
                                updateReferenceThumbnails();
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }
                e.target.value = ''; // 允许重复上传同一文件
            });

            // 处理拖放上传 - 图编辑专用逻辑
            editReferenceUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                editReferenceUploadArea.classList.add('dragging');
            });
            
            editReferenceUploadArea.addEventListener('dragleave', () => {
                editReferenceUploadArea.classList.remove('dragging');
            });
            
            editReferenceUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                editReferenceUploadArea.classList.remove('dragging');
                if (e.dataTransfer.files.length > 0) {
                    console.log('参考图片拖放事件触发，文件数量:', e.dataTransfer.files.length);
                    
                    // 检查是否已上传主编辑图片
                    if (!window.editImageUploaded) {
                        if (typeof window.showNotification === 'function') {
                            window.showNotification('请先上传主编辑图片', 'error');
                        } else if (typeof showNotification === 'function') {
                            showNotification('请先上传主编辑图片', 'error');
                        } else {
                            alert('请先上传主编辑图片');
                        }
                        return;
                    }
                    
                    // 添加参考图片到图编辑专用数组
                    const files = e.dataTransfer.files;
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    let addedCount = 0;
                    let filesToProcess = files.length;
                    
                    [...files].forEach(file => {
                        console.log('处理拖放的参考图片文件:', file.name);
                        
                        if (!file.type.startsWith('image/')) {
                            alert(`文件 "${file.name}" 不是图片格式`);
                            filesToProcess--;
                            return;
                        }
                        
                        if (file.size > maxSize) {
                            alert(`文件 "${file.name}" 太大，请选择小于 10MB 的图片`);
                            filesToProcess--;
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            console.log('拖放的参考图片文件读取完成:', file.name);
                            // 添加到editUploadedFiles数组（参考图片从索引1开始）
                            window.editUploadedFiles.push({ file, dataUrl: event.target.result });
                            
                            // 同时添加到referenceImages数组以便显示
                            window.referenceImages.push({
                                file: file,
                                dataUrl: event.target.result,
                                img: null
                            });
                            
                            addedCount++;
                            console.log(`已添加第 ${addedCount} 张参考图片，共需处理 ${filesToProcess} 张`);
                            
                            // 每添加一张图片就立即更新显示
                            updateReferenceThumbnails();
                            
                            if (addedCount === filesToProcess) {
                                console.log('所有拖放的参考图片文件处理完成');
                                if (typeof window.showNotification === 'function') {
                                    window.showNotification(`已添加 ${addedCount} 张参考图片`, 'success');
                                } else if (typeof showNotification === 'function') {
                                    showNotification(`已添加 ${addedCount} 张参考图片`, 'success');
                                } else {
                                    console.log(`已添加 ${addedCount} 张参考图片`);
                                }
                                console.log(`图编辑参考图片拖放上传成功: ${addedCount}张`);
                            }
                        };
                        reader.onerror = () => {
                            console.error('读取拖放文件失败:', file.name);
                            alert(`读取文件 "${file.name}" 失败`);
                            filesToProcess--;
                            if (addedCount === filesToProcess) {
                                updateReferenceThumbnails();
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }
            });
            
            console.log('图编辑参考图片上传事件绑定完成');
        }
        
        createTextInputModal();
        
        // 获取编辑按钮并绑定事件
        const editGenerateBtn = document.getElementById('generate-btn-edit');
        if (editGenerateBtn) {
            // 先移除可能存在的事件监听器，避免重复绑定
            editGenerateBtn.removeEventListener('click', generateEditedImage);
            editGenerateBtn.addEventListener('click', generateEditedImage);
            console.log('编辑按钮事件绑定成功');
        } else {
            console.warn('未找到编辑按钮元素');
        }
        
        console.log('图编辑功能初始化完成');
    }
    
    // --- 图编辑功能核心函数 ---
    function startDrawing(e) {
        console.log('=== 开始绘图 ===');
        console.log('当前工具:', window.currentTool);
        console.log('图片已上传:', window.editImageUploaded);
        console.log('画布尺寸:', window.editCanvas ? {width: window.editCanvas.width, height: window.editCanvas.height} : 'null');
        console.log('当前颜色:', window.currentColor);
        console.log('图编辑调试 - 开始绘图:', {
            currentColor: window.currentColor,
            colorInputValue: document.getElementById('edit-color')?.value,
            activeColorPreset: document.querySelector('.color-preset.active')?.dataset.color
        });
        
        if (!window.editImageUploaded) {
            console.warn('尝试绘图但未上传图片');
            if (typeof showNotification === 'function') {
                showNotification('请先上传一张图片', 'error');
            } else {
                console.error('请先上传一张图片');
            }
            return;
        }
        
        // 确保画布和上下文存在
        if (!window.editCanvas || !window.editCtx) {
            console.error('画布或上下文不存在');
            if (typeof showNotification === 'function') {
                showNotification('画布初始化失败，请刷新页面重试', 'error');
            } else {
                console.error('画布初始化失败，请刷新页面重试');
            }
            return;
        }
        
        // 使用全局 isDrawing 变量
        window.isDrawing = true;
        const rect = window.editCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log('绘图坐标:', {x, y, clientX: e.clientX, clientY: e.clientY, rect: {left: rect.left, top: rect.top}});
        
        if (window.currentTool === 'text') {
            showTextInputModal(x, y);
            return;
        }
        
        // 使用全局 currentColor 变量
        const colorToUse = window.currentColor || '#ff0000';
        console.log('使用颜色:', colorToUse);
        console.log('图编辑调试 - 颜色检查:', {
            currentColor: window.currentColor,
            colorToUse: colorToUse,
            hasColorInput: !!document.getElementById('edit-color'),
            colorInputValue: document.getElementById('edit-color')?.value
        });
        
        window.currentAnnotation = {
            type: window.currentTool,
            color: colorToUse,
            startX: x,
            startY: y,
            endX: x,
            endY: y
        };
    }
    
    function draw(e) {
        // 确保使用全局 isDrawing 变量
        if (!window.isDrawing || !window.currentAnnotation) {
            return;
        }
        
        // 确保画布和上下文存在
        if (!window.editCanvas || !window.editCtx) {
            console.error('画布或上下文不存在');
            return;
        }
        
        const rect = window.editCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log('绘图过程 - 坐标:', {x, y, clientX: e.clientX, clientY: e.clientY});
        console.log('图编辑调试 - 绘图过程:', {
            isDrawing: window.isDrawing,
            hasCurrentAnnotation: !!window.currentAnnotation,
            annotationType: window.currentAnnotation?.type,
            annotationColor: window.currentAnnotation?.color,
            canvasSize: {width: window.editCanvas.width, height: window.editCanvas.height}
        });
        
        window.currentAnnotation.endX = x;
        window.currentAnnotation.endY = y;
        
        console.log('当前注释状态:', {
            type: window.currentAnnotation.type,
            color: window.currentAnnotation.color,
            startX: window.currentAnnotation.startX,
            startY: window.currentAnnotation.startY,
            endX: window.currentAnnotation.endX,
            endY: window.currentAnnotation.endY
        });
        
        // 重绘画布以显示实时绘图
        redrawCanvas();
    }
    
    function stopDrawing() {
        // 确保使用全局 isDrawing 变量
        if (!window.isDrawing) {
            console.log('停止绘图，但当前不在绘图状态');
            return;
        }
        
        console.log('=== 停止绘图 ===');
        console.log('停止前的注释状态:', window.currentAnnotation);
        console.log('图编辑调试 - 停止绘图:', {
            isDrawing: window.isDrawing,
            hasCurrentAnnotation: !!window.currentAnnotation,
            annotationType: window.currentAnnotation?.type,
            annotationColor: window.currentAnnotation?.color,
            annotationsCount: window.annotations.length
        });
        window.isDrawing = false;
        if (window.currentAnnotation) {
            // 保存当前注释
            const savedAnnotation = {...window.currentAnnotation};
            window.annotations.push(savedAnnotation);
            console.log('已保存注释:', savedAnnotation);
            console.log('当前注释总数:', window.annotations.length);
            window.currentAnnotation = null;
        }
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' :
                                         e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        console.log('触摸事件转换为鼠标事件:', e.type);
        window.editCanvas.dispatchEvent(mouseEvent);
    }
    
    function redrawCanvas() {
        // 确保画布和上下文存在
        if (!window.editCanvas || !window.editCtx) {
            console.error('重绘画布失败：画布或上下文不存在');
            return;
        }
        
        console.log('重绘画布，图片已上传:', !!window.editImage, '注释数量:', window.annotations.length);
        console.log('图编辑调试 - 重绘画布:', {
            canvasSize: {width: window.editCanvas.width, height: window.editCanvas.height},
            hasEditImage: !!window.editImage,
            editImageSize: window.editImage ? {width: window.editImage.width, height: window.editImage.height} : null,
            annotationsCount: window.annotations.length,
            hasCurrentAnnotation: !!window.currentAnnotation
        });
        
        // 清除画布
        window.editCtx.clearRect(0, 0, window.editCanvas.width, window.editCanvas.height);
        
        // 绘制图片
        if (window.editImage) {
            // 计算缩放比例以适应画布
            const scale = Math.min(window.editCanvas.width / window.editImage.width, window.editCanvas.height / window.editImage.height);
            const width = window.editImage.width * scale;
            const height = window.editImage.height * scale;
            const x = (window.editCanvas.width - width) / 2;
            const y = (window.editCanvas.height - height) / 2;
            
            console.log('绘制图片:', {width, height, x, y, scale});
            console.log('图编辑调试 - 图片绘制:', {
                originalSize: {width: window.editImage.width, height: window.editImage.height},
                displaySize: {width, height},
                position: {x, y},
                scale: scale
            });
            window.editCtx.drawImage(window.editImage, x, y, width, height);
            
            // 保存图片的位置和尺寸信息，用于注释绘制
            window.editImageDisplayInfo = { x, y, width, height, scale };
        } else {
            window.editImageDisplayInfo = null;
        }
        
        // 绘制所有注释
        window.annotations.forEach((annotation, index) => {
            console.log('绘制注释', index, annotation);
            drawAnnotation(annotation);
        });
        
        // 绘制当前注释
        if (window.currentAnnotation) {
            console.log('绘制当前注释:', window.currentAnnotation);
            drawAnnotation(window.currentAnnotation);
        }
    }
    
    function drawAnnotation(annotation) {
        // 确保上下文存在
        if (!window.editCtx) {
            console.error('绘制注释失败：上下文不存在');
            return;
        }
        
        console.log('绘制注释:', annotation);
        console.log('图编辑调试 - 绘制注释:', {
            annotationType: annotation.type,
            annotationColor: annotation.color,
            hasValidCoordinates: !!(annotation.startX !== undefined && annotation.startY !== undefined &&
                                  annotation.endX !== undefined && annotation.endY !== undefined),
            coordinates: {
                startX: annotation.startX,
                startY: annotation.startY,
                endX: annotation.endX,
                endY: annotation.endY
            }
        });
        
        window.editCtx.strokeStyle = annotation.color;
        window.editCtx.lineWidth = 2;
        window.editCtx.beginPath();
        
        switch (annotation.type) {
            case 'rectangle':
                const width = annotation.endX - annotation.startX;
                const height = annotation.endY - annotation.startY;
                console.log('绘制矩形:', {x: annotation.startX, y: annotation.startY, width, height});
                window.editCtx.rect(annotation.startX, annotation.startY, width, height);
                break;
                
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(annotation.endX - annotation.startX, 2) +
                    Math.pow(annotation.endY - annotation.startY, 2)
                );
                console.log('绘制圆形:', {x: annotation.startX, y: annotation.startY, radius});
                window.editCtx.arc(annotation.startX, annotation.startY, radius, 0, 2 * Math.PI);
                break;
                
            case 'arrow':
                // 绘制线条
                window.editCtx.moveTo(annotation.startX, annotation.startY);
                window.editCtx.lineTo(annotation.endX, annotation.endY);
                
                // 绘制箭头头部
                const angle = Math.atan2(annotation.endY - annotation.startY, annotation.endX - annotation.startX);
                const arrowLength = 15;
                window.editCtx.lineTo(
                    annotation.endX - arrowLength * Math.cos(angle - Math.PI / 6),
                    annotation.endY - arrowLength * Math.sin(angle - Math.PI / 6)
                );
                window.editCtx.moveTo(annotation.endX, annotation.endY);
                window.editCtx.lineTo(
                    annotation.endX - arrowLength * Math.cos(angle + Math.PI / 6),
                    annotation.endY - arrowLength * Math.sin(angle + Math.PI / 6)
                );
                console.log('绘制箭头:', {startX: annotation.startX, startY: annotation.startY, endX: annotation.endX, endY: annotation.endY});
                break;
                
            case 'text':
                window.editCtx.font = '16px Arial';
                window.editCtx.fillStyle = annotation.color;
                console.log('绘制文本:', {text: annotation.text, x: annotation.startX, y: annotation.startY});
                window.editCtx.fillText(annotation.text, annotation.startX, annotation.startY);
                return; // 文本不需要stroke
        }
        
        window.editCtx.stroke();
    }
    
    function clearAnnotations() {
        window.isDrawing = false; // 重置全局 isDrawing 变量
        window.annotations = [];
        window.currentAnnotation = null;
        redrawCanvas();
    }
    
    function resetEditImage() {
        window.editImage = null;
        window.editImageUploaded = false;
        window.isDrawing = false; // 重置全局 isDrawing 变量
        window.annotations = [];
        window.currentAnnotation = null;
        window.referenceImages = []; // 清空参考图片
        window.editImageDisplayInfo = null; // 重置图片显示信息
        window.editUploadedFiles = []; // 清空图编辑专用的上传图片数组
        
        // 清空编辑说明
        const editInstructions = document.getElementById('edit-instructions');
        if (editInstructions) {
            editInstructions.value = '';
        }
        
        // 重置UI - 恢复初始结构
        const container = document.querySelector('.edit-canvas-container');
        if (container) {
            // 保存当前画布尺寸
            const canvasWidth = container.clientWidth;
            const canvasHeight = container.clientHeight;
            
            // 恢复初始HTML结构：显示上传区域，隐藏canvas wrapper
            container.innerHTML = `
                <div class="file-upload-area" id="edit-upload-area">
                    <p>上传图片进行编辑</p>
                    <input type="file" id="edit-image-input" accept="image/*" hidden>
                </div>
                <div class="edit-canvas-wrapper hidden">
                    <canvas id="edit-canvas"></canvas>
                    <img id="edit-image" class="hidden">
                </div>
            `;
            
            // 重新获取画布引用（现在是隐藏的）
            editCanvas = document.getElementById('edit-canvas');
            if (editCanvas) {
                editCtx = editCanvas.getContext('2d');
                // 设置画布尺寸，但由于隐藏，不立即重绘
                editCanvas.width = canvasWidth;
                editCanvas.height = canvasHeight;
            } else {
                console.error('重置后无法获取画布元素');
            }
            
            // 重新绑定上传事件（确保文件输入事件绑定）
            const editImageInput = document.getElementById('edit-image-input');
            if (editImageInput) {
                editImageInput.addEventListener('change', (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        // 清空图编辑专用的上传文件数组
                        editUploadedFiles.length = 0;
                        
                        // 专用处理逻辑
                        const files = e.target.files;
                        const maxFiles = 1; // 图像编辑只允许一张主图片
                        const maxSize = 10 * 1024 * 1024; // 10MB
                        
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
                            reader.onload = (event) => {
                                editUploadedFiles.push({ file, dataUrl: event.target.result });
                                // 图片上传后，初始化图编辑画布
                                initializeEditCanvas();
                            };
                            reader.onerror = () => {
                                alert(`读取文件 "${file.name}" 失败`);
                            };
                            reader.readAsDataURL(file);
                        });
                    }
                    e.target.value = ''; // 允许重复上传同一文件
                });
            }
            
            // 重新绑定上传区域点击事件
            const editUploadArea = document.getElementById('edit-upload-area');
            if (editUploadArea) {
                editUploadArea.addEventListener('click', () => {
                    const editImageInput = document.getElementById('edit-image-input');
                    if (editImageInput) editImageInput.click();
                });
                
                // 重新绑定拖放事件
                editUploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    editUploadArea.classList.add('dragging');
                });
                
                editUploadArea.addEventListener('dragleave', () => {
                    editUploadArea.classList.remove('dragging');
                });
                
                editUploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    editUploadArea.classList.remove('dragging');
                    if (e.dataTransfer.files.length > 0) {
                        // 清空图编辑专用的上传文件数组
                        editUploadedFiles.length = 0;
                        
                        // 专用处理逻辑
                        const files = e.dataTransfer.files;
                        const maxFiles = 1; // 图像编辑只允许一张主图片
                        const maxSize = 10 * 1024 * 1024; // 10MB
                        
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
                            reader.onload = (event) => {
                                editUploadedFiles.push({ file, dataUrl: event.target.result });
                                // 图片上传后，初始化图编辑画布
                                initializeEditCanvas();
                            };
                            reader.onerror = () => {
                                alert(`读取文件 "${file.name}" 失败`);
                            };
                            reader.readAsDataURL(file);
                        });
                    }
                });
            }
            
            // 重新绑定画布事件（如果canvas存在）
            if (editCanvas) {
                editCanvas.addEventListener('mousedown', startDrawing);
                editCanvas.addEventListener('mousemove', draw);
                editCanvas.addEventListener('mouseup', stopDrawing);
                editCanvas.addEventListener('mouseout', stopDrawing);
                editCanvas.addEventListener('touchstart', handleTouch, { passive: true });
                editCanvas.addEventListener('touchmove', handleTouch, { passive: true });
                editCanvas.addEventListener('touchend', stopDrawing);
            }
        }
        
        // 重置参考图片上传区域和缩略图
        const referenceUploadArea = document.getElementById('edit-reference-upload-area');
        if (referenceUploadArea) {
            // 清空可能存在的缩略图
            const thumbnailsContainer = document.getElementById('edit-reference-thumbnails');
            if (thumbnailsContainer) {
                thumbnailsContainer.classList.add('hidden');
                thumbnailsContainer.innerHTML = '';
            }
            
            // 重新绑定参考图片上传事件（简化，假设已全局绑定）
        }
        
        console.log('图编辑功能已完全重置，用户可立即重新上传图片');
    }
    
    // 初始化图编辑画布 - 使用图生图上传的图片
    function initializeEditCanvas() {
        console.log('=== 初始化图编辑画布 ===');
        
        // 确保有上传的图片
        if (!window.editUploadedFiles || window.editUploadedFiles.length === 0) {
            console.warn('没有上传的图片可用于初始化画布');
            return;
        }
        
        // 使用第一张上传的图片
        const firstFile = window.editUploadedFiles[0];
        console.log('使用上传的图片初始化画布:', firstFile.file.name);
        
        // 创建图片对象
        const img = new Image();
        img.onload = () => {
            console.log('图片加载成功，原始尺寸:', {width: img.width, height: img.height});
            
            // 确保画布元素存在并正确初始化
            window.editCanvas = document.getElementById('edit-canvas');
            console.log('获取画布元素:', !!window.editCanvas);
            if (!window.editCanvas) {
                console.error('画布元素初始化失败');
                if (typeof showNotification === 'function') {
                    showNotification('画布元素初始化失败', 'error');
                }
                return;
            }
            window.editCtx = window.editCanvas.getContext('2d');
            console.log('获取画布上下文:', !!window.editCtx);
            
            // 重新设置画布尺寸
            const container = document.querySelector('.edit-canvas-container');
            console.log('获取画布容器:', !!container);
            if (container) {
                window.editCanvas.width = container.clientWidth;
                window.editCanvas.height = container.clientHeight;
                console.log('设置画布尺寸:', {width: window.editCanvas.width, height: window.editCanvas.height});
            }

            // 图片完全加载并解码后，再赋值给 editImage
            window.editImage = img;
            window.editImageUploaded = true;
            window.annotations = [];
            window.currentAnnotation = null;
            window.editImageDisplayInfo = null; // 重置图片显示信息
            
            console.log('图片加载并解码成功，画布已初始化');
            console.log('当前状态:', {
                editImage: !!window.editImage,
                editImageUploaded: window.editImageUploaded,
                annotationsLength: window.annotations.length,
                currentAnnotation: window.currentAnnotation
            });
            
            // 确保事件绑定正确 (在重绘前绑定，以防重绘中需要事件)
            // 先移除可能存在的旧事件监听器
            window.editCanvas.removeEventListener('mousedown', startDrawing);
            window.editCanvas.removeEventListener('mousemove', draw);
            window.editCanvas.removeEventListener('mouseup', stopDrawing);
            window.editCanvas.removeEventListener('mouseout', stopDrawing);
            window.editCanvas.removeEventListener('touchstart', handleTouch);
            window.editCanvas.removeEventListener('touchmove', handleTouch);
            window.editCanvas.removeEventListener('touchend', stopDrawing);
            
            // 重新绑定事件
            window.editCanvas.addEventListener('mousedown', startDrawing);
            window.editCanvas.addEventListener('mousemove', draw);
            window.editCanvas.addEventListener('mouseup', stopDrawing);
            window.editCanvas.addEventListener('mouseout', stopDrawing);
            window.editCanvas.addEventListener('touchstart', handleTouch, { passive: true });
            window.editCanvas.addEventListener('touchmove', handleTouch, { passive: true });
            window.editCanvas.addEventListener('touchend', stopDrawing);
            
            // 隐藏上传区域，显示画布
            const uploadArea = document.getElementById('edit-upload-area');
            const canvasWrapper = document.querySelector('.edit-canvas-wrapper');
            
            if (uploadArea) {
                uploadArea.style.display = 'none';
            }
            
            if (canvasWrapper) {
                canvasWrapper.classList.remove('hidden');
                canvasWrapper.style.display = 'block';
            }
            
            // 重绘画布 (此时图片已确保加载和解码)
            redrawCanvas();
            
            // 显示成功提示
            if (typeof window.showNotification === 'function') {
                window.showNotification('图片上传成功，可以开始编辑', 'success');
            } else if (typeof showNotification === 'function') {
                showNotification('图片上传成功，可以开始编辑', 'success');
            } else {
                console.log('图片上传成功，可以开始编辑');
            }
        };
        
        // 处理图片加载错误的情况
        img.onerror = () => {
            showNotification('图片加载失败，请重试', 'error');
            console.error('Failed to load image for editing.');
        };
        
        // 使用上传文件的dataUrl
        img.src = firstFile.dataUrl;
    }
    
    function updateReferenceThumbnails() {
        const container = document.getElementById('edit-reference-thumbnails');
        if (!container) {
            console.warn('参考图片缩略图容器不存在');
            return;
        }
        
        console.log('更新参考图片缩略图，当前参考图片数量:', window.referenceImages.length);
        console.log('参考图片数组内容:', window.referenceImages);
        
        // 如果有参考图片，显示缩略图区域
        if (window.referenceImages.length > 0) {
            // 确保移除hidden类
            container.classList.remove('hidden');
            // 确保容器可见
            container.style.display = 'flex';
            
            // 清空现有缩略图
            container.innerHTML = '';
            
            // 添加每个参考图片的缩略图
            window.referenceImages.forEach((item, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'edit-reference-thumbnail';
                
                const img = document.createElement('img');
                img.src = item.dataUrl;
                img.alt = `参考图片 ${index + 1}`;
                img.onload = function() {
                    console.log(`参考图片缩略图 ${index + 1} 加载成功`);
                };
                img.onerror = function() {
                    console.warn(`参考图片缩略图加载失败: ${item.dataUrl ? item.dataUrl.substring(0, 50) : 'null'}...`);
                    this.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 60px; background-color: #f0f0f0; border-radius: 4px; font-size: 12px;';
                    errorDiv.innerHTML = '图片加载失败';
                    thumbnail.appendChild(errorDiv);
                };
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-reference';
                removeBtn.innerHTML = '×';
                removeBtn.title = '移除参考图片';
                removeBtn.addEventListener('click', () => {
                    console.log(`移除参考图片 ${index}`);
                    
                    // 从referenceImages数组中移除
                    window.referenceImages.splice(index, 1);
                    
                    // 同时从editUploadedFiles中查找并移除对应的文件
                    // 查找具有相同dataUrl的文件在editUploadedFiles中的位置
                    const fileToRemove = item.dataUrl;
                    const indexInEditFiles = window.editUploadedFiles.findIndex(f => f.dataUrl === fileToRemove);
                    if (indexInEditFiles > 0) { // 确保不移除主图片（索引0）
                        window.editUploadedFiles.splice(indexInEditFiles, 1);
                    }
                    
                    // 重新更新参考图片缩略图
                    updateReferenceThumbnails();
                });
                
                thumbnail.appendChild(img);
                thumbnail.appendChild(removeBtn);
                container.appendChild(thumbnail);
            });
            
            console.log('参考图片缩略图已更新，显示数量:', window.referenceImages.length);
            console.log('缩略图容器的class:', container.className);
            console.log('缩略图容器的display:', container.style.display);
        } else {
            // 没有参考图片，隐藏缩略图区域
            container.classList.add('hidden');
            container.style.display = '';
            console.log('没有参考图片，隐藏缩略图区域');
        }
    }
    
    // 渲染图编辑上传的图片预览
    function renderEditUploadPreviews() {
        const uploadArea = document.getElementById('edit-upload-area');
        if (!uploadArea) return;
        
        const initialText = uploadArea.querySelector('p');
        if (initialText) initialText.style.display = 'none';
        
        let thumbsContainer = document.getElementById('edit-upload-thumbs');
        if (!thumbsContainer) {
            thumbsContainer = document.createElement('div');
            thumbsContainer.id = 'edit-upload-thumbs';
            thumbsContainer.className = 'upload-thumbs';
            uploadArea.appendChild(thumbsContainer);
        }
        
        // 清理现有的事件监听器
        const existingButtons = thumbsContainer.querySelectorAll('.remove-thumb');
        existingButtons.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        thumbsContainer.innerHTML = '';
        
        // 只渲染主图片（index 0）
        if (window.editUploadedFiles.length > 0) {
            const mainItem = window.editUploadedFiles[0];
            const thumbItem = document.createElement('div');
            thumbItem.className = 'upload-thumb-item';
            
            const img = document.createElement('img');
            img.src = mainItem.dataUrl;
            img.alt = '主图片预览';
            img.loading = 'lazy';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-thumb';
            removeBtn.textContent = '×';
            removeBtn.dataset.index = 0; // 主图片固定 index 0
            
            // 使用事件委托避免重复绑定
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const indexToRemove = parseInt(e.target.dataset.index, 10);
                
                if (indexToRemove === 0) {
                    // 移除主图片，重置整个编辑状态
                    window.editUploadedFiles = [];
                    window.referenceImages = [];
                    resetEditImage();
                    if (initialText) {
                        initialText.style.display = 'block';
                    }
                } else {
                    // 移除参考图片（但主预览不渲染参考，所以此逻辑在参考移除中处理）
                    console.warn('主预览中不应移除非主图片');
                }
                
                renderEditUploadPreviews();
            });
            
            thumbItem.appendChild(img);
            thumbItem.appendChild(removeBtn);
            thumbsContainer.appendChild(thumbItem);
        } else {
            // 没有主图片，显示初始文本并重置
            if (initialText) initialText.style.display = 'block';
            resetEditImage();
        }
    }
    
    function createTextInputModal() {
        if (document.getElementById('text-input-modal')) return;
        
        textInputModal = document.createElement('div');
        textInputModal.id = 'text-input-modal';
        textInputModal.className = 'text-input-modal';
        textInputModal.style.display = 'none';
        
        textInputModal.innerHTML = `
            <div class="text-input-content">
                <h3>输入文本</h3>
                <input type="text" id="text-input-value" placeholder="请输入要添加的文本">
                <div class="text-input-actions">
                    <button class="cancel-btn" id="text-input-cancel">取消</button>
                    <button class="confirm-btn" id="text-input-confirm">确定</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(textInputModal);
        
        // 绑定事件 - 使用全局变量引用函数
        const cancelBtn = document.getElementById('text-input-cancel');
        const confirmBtn = document.getElementById('text-input-confirm');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideTextInputModal);
        }
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', confirmTextInput);
        }
        
        // 点击背景关闭
        textInputModal.addEventListener('click', (e) => {
            if (e.target === textInputModal) {
                hideTextInputModal();
            }
        });
        
        console.log('文本输入模态框创建并绑定事件完成');
    }
    
    function showTextInputModal(x, y) {
        if (!textInputModal) return;
        
        textInputModal.style.display = 'flex';
        const input = document.getElementById('text-input-value');
        input.value = '';
        input.focus();
        
        // 保存位置信息
        textInputModal.dataset.x = x;
        textInputModal.dataset.y = y;
    }
    
    function hideTextInputModal() {
        if (!textInputModal) return;
        textInputModal.style.display = 'none';
    }
    
    function confirmTextInput() {
        if (!textInputModal) return;
        
        const input = document.getElementById('text-input-value');
        const text = input.value.trim();
        
        if (text) {
            const x = parseFloat(textInputModal.dataset.x);
            const y = parseFloat(textInputModal.dataset.y);
            
            // 使用全局currentColor变量
            const colorToUse = window.currentColor || '#ff0000';
            console.log('图编辑调试 - 文本注释:', {
                text: text,
                position: {x, y},
                colorToUse: colorToUse,
                currentColor: window.currentColor
            });
            
            window.annotations.push({
                type: 'text',
                color: colorToUse,
                text: text,
                startX: x,
                startY: y
            });
            
            redrawCanvas();
        }
        
        hideTextInputModal();
    }
    
    // --- 编辑图片生成功能 ---
    async function generateEditedImage() {
        if (!window.editImageUploaded) {
            if (typeof showNotification === 'function') showNotification('请先上传一张图片', 'error');
            return;
        }
        
        const editInstructions = document.getElementById('edit-instructions');
        if (!editInstructions || !editInstructions.value.trim()) {
            if (typeof showNotification === 'function') showNotification('请输入编辑说明', 'error');
            return;
        }
        
        // 获取画布内容（包含注释）
        const canvasWithAnnotations = document.createElement('canvas');
        canvasWithAnnotations.width = window.editCanvas.width;
        canvasWithAnnotations.height = window.editCanvas.height;
        const ctx = canvasWithAnnotations.getContext('2d');
        
        // 绘制原始图片和标注
        ctx.drawImage(window.editCanvas, 0, 0);
        
        // 转换为DataURL
        const imageDataUrl = canvasWithAnnotations.toDataURL('image/png');
        
        // 准备上传文件列表，使用与图生图相同的格式
        uploadedFiles = [];
        
        // 添加编辑后的画布作为第一张图片
        uploadedFiles.push({
            file: null,
            dataUrl: imageDataUrl
        });
        
        // 添加参考图片
        if (window.editUploadedFiles.length > 1) {
            for (let i = 1; i < window.editUploadedFiles.length; i++) {
                uploadedFiles.push({
                    file: window.editUploadedFiles[i].file,
                    dataUrl: window.editUploadedFiles[i].dataUrl
                });
            }
        }
        
        // 构建编辑专用的提示词
        const instructions = editInstructions.value.trim();
        let editPrompt = instructions;
        
        // 根据是否有标注来调整提示词
        if (window.annotations && window.annotations.length > 0) {
            editPrompt = `请注意：第一张图片是用户编辑的主图，其中包含了用户标注的特定区域（矩形、圆形、箭头或文本）。这些标注表示用户希望重点编辑或替换的区域。请根据以下编辑说明，在这些标注区域内进行相应的修改：\n\n${instructions}`;
        } else {
            editPrompt = `请基于第一张主编辑图片，根据以下编辑需求进行修改或重绘：\n\n${instructions}`;
        }
        
        // 如果有参考图片，在提示词中说明
        if (uploadedFiles.length > 1) {
            const referenceCount = uploadedFiles.length - 1;
            editPrompt += `\n\n注意：除了主编辑图片外，还有 ${referenceCount} 张参考图片，请参考这些图片的风格、元素或内容进行编辑。`;
        }
        
        // 临时保存原始提示词输入元素的值
        const originalPromptInput = imageToImagePanel.classList.contains('active') ? promptInputImage : promptInputText;
        const originalPromptValue = originalPromptInput ? originalPromptInput.value : '';
        
        // 设置编辑提示词
        if (originalPromptInput) {
            originalPromptInput.value = editPrompt;
        }
        
        try {
            // 调用通用的图片生成函数
            await generateImageWithRetry();
        } finally {
            // 恢复原始提示词
            if (originalPromptInput) {
                originalPromptInput.value = originalPromptValue;
            }
            
            // 清理临时的uploadedFiles，避免影响图生图功能
            uploadedFiles = [];
        }
    }
