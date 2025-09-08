document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('!!! DOMContentLoaded event fired, starting script execution...');
        
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
    let currentItemInDetailView = null; // 用于详情视图的状态管理
    let selectedRatio = '16:9'; // 默认选中的比例

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
            if (example.thumbnail && (example.thumbnail.startsWith('http') || example.thumbnail.startsWith('data:image') || example.thumbnail.startsWith('/'))) {
                const img = document.createElement('img');
                img.alt = example.title;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNlYWVhZWEiLz48L3N2Zz4='; // Placeholder
                img.dataset.src = getProxiedImageUrl(example.thumbnail);
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
        return await generateImageWithRetry();
    }

    async function generateImageWithRetry(retryCount = 0) {
        const maxRetries = 3;
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
            generateBtn.textContent = '生成中...';
            generateBtn.disabled = true;
            imageDisplay.innerHTML = '<div class="loading-spinner"><p>正在为您生成图片...</p><div class="spinner"></div></div>';
            imageActions.classList.add('hidden');
        } else {
            // 重试时更新加载信息
            const loadingText = imageDisplay.querySelector('.loading-spinner p');
            if (loadingText) {
                loadingText.textContent = `正在重试生成图片... (${retryCount}/${maxRetries})`;
            }
        }

        try {
            // 构建增强的提示词
            let enhancedPrompt = prompt;
            const hasUserImages = uploadedFiles && uploadedFiles.length > 0;
            const hasAspectRatioImage = baseImage && selectedRatio !== '1:1';

            if (hasAspectRatioImage) {
                let imageInstructions = "你是一位专业的图像合成师。请严格遵循以下指令：\n";
                imageInstructions += `- **重要**: 你接收到的最后一张图片是宽高比参考图（我们称之为“画布”）。它的现有内容必须被完全忽略和清除，只使用它的宽高比（${selectedRatio}）作为最终输出的画框。\n`;

                if (hasUserImages) {
                    const userImageCount = uploadedFiles.length;
                    imageInstructions += `- 你接收到的前 ${userImageCount} 张图片是内容源。你的任务是将这些源图片的内容、风格、元素智能地融合、重绘到空白的“画布”上，并完美地填充至 ${selectedRatio} 的宽高比。\n`;
                } else {
                    imageInstructions += `- 你的任务是根据用户的文本提示词，在空白的“画布”上生成全新的内容，并完美地填充至 ${selectedRatio} 的宽高比。\n`;
                }
                imageInstructions += `- 最终生成的图片必须内容完整，填满整个画布，绝不留下任何边框或空白区域。\n`;
                enhancedPrompt = `${imageInstructions}\n用户的原始需求是：“${prompt}”`;

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
                     enhancedPrompt = `请基于用户上传的图片，根据以下需求进行修改或重绘，最终输出一张 ${ratioConfig.description}(${selectedRatio}) 的图片。\n\n用户的需求是：“${prompt}”`;
                } else {
                    enhancedPrompt = `请根据用户的需求生成一张图片。最终图片的宽高比必须为 ${ratioConfig.description} (${selectedRatio})。请确保内容完整并填满整个画面，不要留有边框。\n\n用户的需求是：“${prompt}”`;
                }
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
                generateBtn.textContent = '生成';
                generateBtn.disabled = false;
                displayImage({ src: result.src, prompt: prompt, model: modelName });
                return;
            } else {
                throw new Error('API 返回数据中未找到图片');
            }

        } catch (error) {
            console.error(`API 生成失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error);
            
            // 检查是否应该重试
            if (retryCount < maxRetries && shouldRetry(error)) {
                console.log(`准备进行第 ${retryCount + 1} 次重试...`);
                
                // 智能延迟：递增延迟时间
                const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // 1s, 2s, 4s, 最大5s
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // 递归重试
                return await generateImageWithRetry(retryCount + 1);
            }
            
            // 所有重试都失败了，显示错误信息
            handleGenerationError(error, retryCount);
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
        generateBtn.textContent = '生成';
        generateBtn.disabled = false;
        
        // 详细的错误信息用于调试
        let errorDetails = {
            message: error.message || '未知错误',
            stack: error.stack || '无堆栈信息',
            name: error.name || '未知错误类型',
            error: error.error || null,
            details: error.details || null,
            rawResponse: error.rawResponse || null,
            responseText: error.responseText || null,
            totalRetries: finalRetryCount
        };
        
        // 如果是网络错误，添加更多信息
        if (error instanceof TypeError && error.message.includes('fetch')) {
            errorDetails.networkError = true;
            errorDetails.suggestion = '请检查网络连接和API地址';
        }
        
        let displayMessage = error.error || error.message || '生成失败，请重试';
        
        // 如果进行了重试，在消息中体现
        if (finalRetryCount > 0) {
            displayMessage += ` (已自动重试 ${finalRetryCount} 次)`;
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
        
        const retryBtn = document.createElement('button');
        retryBtn.className = 'retry-btn';
        retryBtn.textContent = '手动重试';
        retryBtn.addEventListener('click', generateImage);
        
        errorDiv.appendChild(errorP);
        errorDiv.appendChild(debugInfo);
        errorDiv.appendChild(retryBtn);
        imageDisplay.innerHTML = '';
        imageDisplay.appendChild(errorDiv);
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
            favorites.unshift(favoriteItem);
            console.log('已添加到收藏:', favoriteItem);
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
        } else if (type === 'detail') {
            // 更新历史记录详情视图的收藏图标
            const favoriteBtn = document.getElementById('favorite-history-detail-btn');
            if (favoriteBtn) {
                updateFavoriteIcon(favoriteBtn, item);
            }
        }
    }

    function updateFavoriteIcon(button, item) {
        if (!button || !item) return;
        const itemId = item.id || item.title || item.src;
        const favorites = getStorage('favorites');
        const isFavorited = favorites.some(fav => fav.id === itemId);
        button.classList.toggle('favorited', isFavorited);
    }

    function updateTemplateFavoriteIcon() {
        const example = currentExamples[currentIndexOnPage];
        const btn = document.getElementById('favorite-template-btn');
        if (example && btn) updateFavoriteIcon(btn, example);
    }
    
    function updateResultFavoriteIcon() {
        const btn = document.getElementById('favorite-result-btn');
        if (currentGeneratedImage && btn) updateFavoriteIcon(btn, currentGeneratedImage);
    }

    function loadFavorites() {
        renderGrid(favoritesGrid, getStorage('favorites'), '暂无收藏', 'favorites');
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
                    toggleFavorite({ ...example, id: example.id || example.title }, 'template');
                    updateTemplateFavoriteIcon();
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
                    toggleFavorite(currentGeneratedImage, 'result');
                    updateResultFavoriteIcon();
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
                    sendImageToImg2Img(currentGeneratedImage.src);
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
                    link.href = currentGeneratedImage.src;
                    link.download = `nano-banana-${Date.now()}.png`;
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
                    sendImageToImg2Img(currentItemInDetailView.src);
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
                    link.href = currentItemInDetailView.src;
                    link.download = `nano-banana-history-${currentItemInDetailView.id}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
            downloadHistoryBtn.dataset.eventBound = 'true';
        }
    }

    // 发送图片到图生图功能
    function sendImageToImg2Img(imageSrc) {
        console.log('Sending image to img2img:', imageSrc);
        
        // 切换到图生图标签
        const tabImageToImage = document.getElementById('tab-image-to-image');
        const imageToImagePanel = document.getElementById('image-to-image-panel');
        const textToImagePanel = document.getElementById('text-to-image-panel');
        
        if (tabImageToImage && imageToImagePanel && textToImagePanel) {
            // 切换标签
            switchTab(tabImageToImage, imageToImagePanel);
            
            // 将图片添加到上传文件列表
            fetch(imageSrc)
                .then(response => response.blob())
                .then(blob => {
                    // 创建File对象
                    const file = new File([blob], `image_${Date.now()}.png`, { type: 'image/png' });
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        // 清空现有的上传文件
                        uploadedFiles.length = 0;
                        
                        // 添加新图片到上传文件列表
                        uploadedFiles.push({
                            file: file,
                            dataUrl: e.target.result
                        });
                        
                        // 重新渲染上传预览
                        renderUploadPreviews();
                        
                        // 显示成功提示
                        showNotification('图片已发送到图生图！', 'success');
                        
                        console.log('Image successfully added to img2img');
                    };
                    
                    reader.onerror = () => {
                        console.error('Failed to read image data');
                        showNotification('发送图片失败，请重试', 'error');
                    };
                    
                    reader.readAsDataURL(file);
                })
                .catch(error => {
                    console.error('Failed to fetch image:', error);
                    showNotification('发送图片失败，请重试', 'error');
                });
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
                    sendImageToImg2Img(currentItemInDetailView.src);
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
                const fullSrc = type === 'history' ? item.src : (item.src || item.thumbnail);
                currentItemInDetailView = {
                    ...item,
                    src: fullSrc,
                    id: item.id || item.title || item.src,
                    sourceType: type // 添加来源类型标识
                };

                historyDetailImage.src = getProxiedImageUrl(fullSrc);
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
                    link.href = fullSrc;
                    link.download = `nano-banana-${type}-${currentItemInDetailView.id}.png`;
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

        // 初始化比例选择器
        initRatioSelector();

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
                toggleFavorite(currentGeneratedImage, 'result');
                updateResultFavoriteIcon();
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
                link.href = currentGeneratedImage.src;
                link.download = `nano-banana-${Date.now()}.png`;
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
                sendImageToImg2Img(currentGeneratedImage.src);
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
                    toggleFavorite(currentItemInDetailView, 'detail');
                    updateFavoriteIcon(target, currentItemInDetailView);
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
                    link.href = currentItemInDetailView.src;
                    link.download = `nano-banana-history-${currentItemInDetailView.id}.png`;
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
                    sendImageToImg2Img(currentItemInDetailView.src);
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