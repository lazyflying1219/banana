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
 
    const galleryPreviewer = document.createElement('div');
    galleryPreviewer.className = 'thumbnail-previewer';
    document.body.appendChild(galleryPreviewer);
    let previewInterval = null;

    // --- 状态变量 ---
    let selectedAspectRatio = '1:1'; // 默认比例为 1:1
    let allExamples = [];
    let currentExamples = [];
    let currentIndexOnPage = 0;
    let currentPage = 0;
    const itemsPerPage = 15;
    let currentGeneratedImage = null;
    let uploadedFiles = []; // { file: File, dataUrl:string }
    let currentLightboxIndex = 0;
    let currentItemInDetailView = null;

    const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

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

    // --- 新：图片缓存与获取逻辑 ---
    async function getCachedImageOrFetch(originalUrl) {
        if (!originalUrl || originalUrl.startsWith('data:') || originalUrl.startsWith('blob:') || (!originalUrl.startsWith('http') && !originalUrl.startsWith('//'))) {
            return originalUrl;
        }

        try {
            const cachedBlob = await getImageFromCache(originalUrl);
            if (cachedBlob) {
                return URL.createObjectURL(cachedBlob);
            }
        } catch (error) {
            console.error('Failed to get from cache:', error);
        }

        const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;

        try {
            const response = await fetch(proxiedUrl);
            if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status}`);
            const blob = await response.blob();
            await saveImageToCache(originalUrl, blob.slice());
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Failed to fetch and cache image:', originalUrl, error);
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNlYWVhZWEiLz48cGF0aCBkPSJNMjEuMjUgMjEuMjVMNjMuNzUgNjMuNzUiIHN0cm9rZT0iI2RjMzk0MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjEuMjUgNjMuNzVMMzcuMzQyMyA0Ny42NTc3IiBzdHJva2U9IiNkYzM5NDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTQyLjUgNDIuNUw2My43NSA2My43NSIgc3Ryb2tlPSIjZGMzOTQwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg=='; // Error placeholder
        }
    }

    const lazyLoadObserver = new IntersectionObserver(async (entries, observer) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const img = entry.target;
                const originalUrl = img.dataset.src;
                if (originalUrl) {
                    img.style.opacity = '0.5';
                    const finalSrc = await getCachedImageOrFetch(originalUrl);
                    img.src = finalSrc;
                    img.onload = () => img.style.opacity = '1';
                    if (img.complete) img.style.opacity = '1';
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        }
    }, { rootMargin: '0px 0px 200px 0px' });

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

    function cleanupPreviewInterval() {
        if (previewInterval) clearInterval(previewInterval);
        previewInterval = null;
    }

    function cleanupGalleryPreviewer() {
        cleanupPreviewInterval();
        galleryPreviewer.classList.remove('visible');
        galleryPreviewer.innerHTML = '';
    }

    function loadPage(page) {
        cleanupGalleryPreviewer();
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        currentExamples = allExamples.slice(start, end);
        thumbnailTrack.innerHTML = '';

        if (currentExamples.length === 0) {
            promptDisplayArea.textContent = '该分类下暂无灵感...';
            galleryPromptTitle.textContent = '空空如也';
            galleryPromptAuthor.textContent = '';
            return;
        }

        const fragment = document.createDocumentFragment();
        currentExamples.forEach((example, index) => {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'thumbnail-item';
            thumbItem.dataset.id = example.id || example.title;

            if (example.thumbnail && (example.thumbnail.startsWith('http') || example.thumbnail.startsWith('/'))) {
                const img = document.createElement('img');
                img.alt = example.title;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNlYWVhZWEiLz48L3N2Zz4=';
                img.dataset.src = example.thumbnail;
                thumbItem.appendChild(img);
            } else if (example.thumbnail) {
                thumbItem.innerHTML = example.thumbnail;
                thumbItem.style.cssText = 'display: flex; align-items: center; justify-content: center; font-size: 2em; background-color: var(--bg-color);';
            } else {
                thumbItem.innerHTML = '🖼️';
                thumbItem.style.cssText = 'display: flex; align-items: center; justify-content: center; font-size: 2em; background-color: var(--bg-color);';
            }

            thumbItem.addEventListener('click', () => openLightbox(index));
            
            // 添加鼠标悬停预览功能
            thumbItem.addEventListener('mouseenter', (e) => {
                const example = currentExamples[index];
                if (!example || !example.outputImages) return;
                
                cleanupPreviewInterval();
                
                const rect = thumbItem.getBoundingClientRect();
                galleryPreviewer.innerHTML = '';
                
                const previewImg = document.createElement('img');
                previewImg.style.cssText = 'width: 200px; height: 200px; object-fit: cover; border-radius: 8px;';
                
                // 如果有多张图片，显示轮播预览
                if (Array.isArray(example.outputImages) && example.outputImages.length > 1) {
                    let currentPreviewIndex = 0;
                    
                    const updatePreviewImage = async () => {
                        const imageUrl = example.outputImages[currentPreviewIndex];
                        previewImg.src = await getCachedImageOrFetch(imageUrl);
                    };
                    
                    updatePreviewImage();
                    galleryPreviewer.appendChild(previewImg);
                    
                    previewInterval = setInterval(() => {
                        currentPreviewIndex = (currentPreviewIndex + 1) % example.outputImages.length;
                        updatePreviewImage();
                    }, 1000);
                } else {
                    // 单张图片预览
                    const imageUrl = Array.isArray(example.outputImages) ? example.outputImages[0] : example.outputImages;
                    getCachedImageOrFetch(imageUrl).then(src => {
                        previewImg.src = src;
                    });
                    galleryPreviewer.appendChild(previewImg);
                }
                
                // 定位预览器
                galleryPreviewer.style.cssText = `
                    position: fixed;
                    left: ${rect.right + 10}px;
                    top: ${rect.top + window.scrollY}px;
                    z-index: 1000;
                    background: var(--bg-color);
                    border: 2px solid var(--accent-color);
                    border-radius: 12px;
                    padding: 8px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    pointer-events: none;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: opacity 0.2s ease, transform 0.2s ease;
                `;
                
                // 检查是否会超出右边界，如果是则显示在左边
                if (rect.right + 220 > window.innerWidth) {
                    galleryPreviewer.style.left = `${rect.left - 220}px`;
                }
                
                // 检查是否会超出下边界，如果是则向上调整
                if (rect.top + 220 > window.innerHeight) {
                    galleryPreviewer.style.top = `${rect.bottom - 220 + window.scrollY}px`;
                }
                
                // 显示预览器
                requestAnimationFrame(() => {
                    galleryPreviewer.classList.add('visible');
                    galleryPreviewer.style.opacity = '1';
                    galleryPreviewer.style.transform = 'scale(1)';
                });
            });
            
            thumbItem.addEventListener('mouseleave', () => {
                cleanupGalleryPreviewer();
            });
            
            fragment.appendChild(thumbItem);
        });

        thumbnailTrack.appendChild(fragment);
        thumbnailTrack.querySelectorAll('img[data-src]').forEach(img => lazyLoadObserver.observe(img));
        updateGalleryDisplay(0);
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        carouselPrev.disabled = currentPage === 0;
        carouselNext.disabled = currentPage >= Math.ceil(allExamples.length / itemsPerPage) - 1;
    }
    if (carouselPrev) carouselPrev.addEventListener('click', () => { if (currentPage > 0) { currentPage--; loadPage(currentPage); } });
    if (carouselNext) carouselNext.addEventListener('click', () => { if (currentPage < Math.ceil(allExamples.length / itemsPerPage) - 1) { currentPage++; loadPage(currentPage); } });
    if (selectTemplateBtn) selectTemplateBtn.addEventListener('click', () => {
        const example = currentExamples[currentIndexOnPage];
        if (!example) return;
        const targetTextArea = textToImagePanel.classList.contains('active') ? promptInputText : promptInputImage;
        targetTextArea.value = example.prompt || '';
        targetTextArea.focus();
    });

    async function updateLightboxImage(index) {
        if (!currentExamples[index]) return;
        const example = currentExamples[index];
        const highResImage = (example.outputImages && example.outputImages) || example.thumbnail;
        lightboxImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Placeholder
        lightboxImage.src = await getCachedImageOrFetch(highResImage);
        lightboxImage.alt = example.title;
        currentLightboxIndex = index;
        lightboxPrev.style.display = index > 0 ? 'flex' : 'none';
        lightboxNext.style.display = index < currentExamples.length - 1 ? 'flex' : 'none';
    }

    function openLightbox(index) {
        updateGalleryDisplay(index);
        updateLightboxImage(index);
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.add('hidden');
        document.body.style.overflow = '';
        if (lightboxImage.src.startsWith('blob:')) {
            URL.revokeObjectURL(lightboxImage.src);
        }
    }

    function showNextImage() {
        if (currentLightboxIndex < currentExamples.length - 1) updateLightboxImage(currentLightboxIndex + 1);
    }

    function showPrevImage() {
        if (currentLightboxIndex > 0) updateLightboxImage(currentLightboxIndex - 1);
    }

    function handleKeydown(e) {
        if (!lightboxModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (currentLightboxIndex >= 0) {
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        }
    }
 
     async function displayImage(imageData) {
        imageDisplay.innerHTML = '';
        let currentImg = document.createElement('img');
        currentImg.onerror = () => {
            console.error('Generated image failed to load:', imageData.src);
            imageDisplay.innerHTML = '<p>图片加载失败，请重试</p>';
            imageActions.classList.add('hidden');
        };
        currentImg.src = imageData.src;
        currentImg.alt = imageData.prompt || 'Generated Image';
        currentImg.style.opacity = 0;
        imageDisplay.appendChild(currentImg);
        currentImg.addEventListener('click', async () => {
            currentLightboxIndex = -1;
            lightboxImage.src = await getCachedImageOrFetch(currentImg.src); // Also use cache for generated image view
            lightboxImage.alt = currentImg.alt;
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
            lightboxModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
        currentImg.onload = () => setTimeout(() => { currentImg.style.opacity = 1; }, 50);
        if (currentImg.complete) setTimeout(() => { currentImg.style.opacity = 1; }, 50);

        imageActions.classList.remove('hidden');
        currentGeneratedImage = { ...imageData, id: `gen_${Date.now()}` };
        updateResultFavoriteIcon();
        await addToHistory(currentGeneratedImage);
    }

    async function generateImage() {
        return await generateImageWithRetry();
    }

    function setLoading(isLoading) {
        if (generateBtn) {
            generateBtn.disabled = isLoading;
            generateBtn.textContent = isLoading ? 'Generating...' : 'Generate';
        }
    }

    function saveDraft() {
        // Placeholder for saveDraft logic
        console.log('Draft saved (placeholder)');
    }

    function handleGenerationSuccess(result) {
        setLoading(false);
        displayImage({ src: result.imageUrl, prompt: result.prompt });
        updateGalleryListeners();
    }

    function handleGalleryItemMouseenter(e) {
        const item = e.currentTarget;
        const images = item.dataset.images ? JSON.parse(item.dataset.images) : [];
        if (images.length === 0) return;

        const previewer = document.createElement('div');
        previewer.className = 'image-preview';
        const img = document.createElement('img');
        img.src = images[0];
        previewer.appendChild(img);
        document.body.appendChild(previewer);

        const rect = item.getBoundingClientRect();
        previewer.style.left = `${rect.right + 10}px`;
        previewer.style.top = `${window.scrollY + rect.top}px`;
        previewer.classList.add('visible');

        item._previewer = previewer;
    }

    function handleGalleryItemMouseleave(e) {
        const item = e.currentTarget;
        if (item._previewer) {
            item._previewer.remove();
            item._previewer = null;
        }
    }

    function updateGalleryListeners() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.removeEventListener('mouseenter', handleGalleryItemMouseenter);
            item.removeEventListener('mouseleave', handleGalleryItemMouseleave);
            item.addEventListener('mouseenter', handleGalleryItemMouseenter);
            item.addEventListener('mouseleave', handleGalleryItemMouseleave);
        });
    }

async function generateImageWithRetry(retryCount = 0) {
    const maxRetries = 3;
    const apiUrl = '/api/generate';
    const modelName = modelNameInput ? modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview';
    let userPrompt = textToImagePanel.classList.contains('active') ? promptInputText.value : promptInputImage.value;
    const images = uploadedFiles.map(f => f.dataUrl);

    if (!userPrompt.trim()) {
        alert('请输入提示词');
        return;
    }

    setLoading(true);
    let resultFound = false;

    let baseImage = null;
    let finalPrompt = userPrompt;

    // --- 核心修改逻辑：动态构建Prompt ---
    if (selectedAspectRatio !== '1:1') {
        try {
            const ratioFileName = selectedAspectRatio.replace(':', '_') + '.png';
            const response = await fetch(ratioFileName);
            if (!response.ok) throw new Error(`无法加载底图: ${ratioFileName}`);
            const blob = await response.blob();
            baseImage = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            
            // 根据是否上传了用户图片来构建不同的指令
            if (images.length > 0) {
                // 场景二：选择了比例，且有用户上传的图片
                const instruction = `The first image provided is the canvas. Redraw the content of the subsequent reference images onto this canvas. Adapt and expand the content from the reference images to perfectly fit the aspect ratio of the canvas. The original canvas should be completely replaced with the new creation, retaining only its aspect ratio. The user's request is: `;
                finalPrompt = instruction + userPrompt;
            } else {
                // 场景一：选择了比例，但没有用户上传的图片
                const instruction = `Please create the following content on the provided canvas, ensuring the final image strictly adheres to the canvas's aspect ratio. The user's request is: `;
                finalPrompt = instruction + userPrompt;
            }

        } catch (error) {
            console.error('加载底图失败:', error);
            handleGenerationError({ error: '加载比例底图失败，请检查文件是否存在且位于根目录。' }, 0);
            return;
        }
    }
    // 场景三：比例为1:1，finalPrompt 保持为 userPrompt，不作任何改变。
    // --- 修改逻辑结束 ---

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: finalPrompt, model: modelName, images, baseImage }),
        });

        if (response.status === 202) {
            const data = await response.json();
            const taskId = data.taskId;

            const checkStatus = async () => {
                if (resultFound) return;

                const statusResponse = await fetch(`/api/generate?taskId=${taskId}`);
                if (statusResponse.status === 200) {
                    resultFound = true;
                    setLoading(false);
                    const result = await statusResponse.json();
                    if (result.error) {
                        handleGenerationError(result, retryCount);
                    } else {
                        handleGenerationSuccess({ ...result, prompt: userPrompt });
                    }
                } else if (statusResponse.status === 202) {
                    setTimeout(checkStatus, 2000);
                } else {
                    resultFound = true;
                    setLoading(false);
                    const errorResult = await statusResponse.json().catch(() => ({ error: `请求失败，状态码: ${statusResponse.status}` }));
                    handleGenerationError(errorResult, retryCount);
                }
            };
            setTimeout(checkStatus, 2000);
        } else {
            resultFound = true;
            setLoading(false);
            const errorResult = await response.json().catch(() => ({ error: `请求失败，状态码: ${response.status}` }));
            handleGenerationError(errorResult, retryCount);
        }
    } catch (error) {
        if (!resultFound) {
            handleGenerationError({ error: error.message }, retryCount);
        }
    }
}

    function handleGenerationError(error, finalRetryCount) {
        setLoading(false);
        let displayMessage = error.error || error.message || 'Generation failed, please retry';
        if (finalRetryCount > 0) displayMessage += ` (Retried ${finalRetryCount} times)`;
        imageDisplay.innerHTML = `<div class="error-message">Generation failed: ${displayMessage}</div>`;
    }

    function toggleFavorite(item, type) {
        let favorites = getStorage('favorites');
        const itemId = item.id || item.title || item.src;
        if (!itemId) return;
        const existingIndex = favorites.findIndex(fav => fav.id === itemId);
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
        } else {
            favorites.unshift({ ...item, type, id: itemId, timestamp: Date.now() });
        }
        if (favorites.length > 200) favorites = favorites.slice(0, 200);
        setStorage('favorites', favorites);
        if (type === 'template') updateTemplateFavoriteIcon();
        else if (type === 'result') updateResultFavoriteIcon();
        else if (type === 'detail') updateFavoriteIcon(favoriteHistoryDetailBtn, currentItemInDetailView);
    }

    function updateFavoriteIcon(button, item) {
        if (!button || !item) return;
        const itemId = item.id || item.title || item.src;
        button.classList.toggle('favorited', getStorage('favorites').some(fav => fav.id === itemId));
    }

    function updateTemplateFavoriteIcon() {
        const example = currentExamples[currentIndexOnPage];
        if (example) updateFavoriteIcon(favoriteTemplateBtn, example);
    }
    
    function updateResultFavoriteIcon() {
        if (currentGeneratedImage) updateFavoriteIcon(favoriteResultBtn, currentGeneratedImage);
    }

    function loadFavorites() {
        renderGrid(favoritesGrid, getStorage('favorites'), '暂无收藏', 'favorites');
    }

    function setupEventListeners() {
        favoriteTemplateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const example = currentExamples[currentIndexOnPage];
            if (example) toggleFavorite({ ...example, id: example.id || example.title }, 'template');
        });
        favoriteResultBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGeneratedImage) toggleFavorite(currentGeneratedImage, 'result');
        });
        document.getElementById('send-to-img2img-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGeneratedImage?.src) sendImageToImg2Img(currentGeneratedImage.src);
        });

        // 监听比例选择按钮
        document.querySelectorAll('.ratio-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.ratio-btn.active').classList.remove('active');
                btn.classList.add('active');
                selectedAspectRatio = btn.dataset.ratio;
            });
        });

        // 为生成按钮绑定点击事件
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                saveDraft();
                generateImage();
            });
        }
    }

    function sendImageToImg2Img(imageSrc) {
        switchTab(tabImageToImage, imageToImagePanel);
        fetch(imageSrc).then(res => res.blob()).then(blob => {
            const file = new File([blob], `image_${Date.now()}.png`, { type: 'image/png' });
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedFiles = [{ file, dataUrl: e.target.result }];
                renderUploadPreviews();
                showNotification('图片已发送到图生图！', 'success');
            };
            reader.readAsDataURL(file);
        }).catch(err => showNotification('发送图片失败', 'error'));
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function setupHistoryDetailButtons() {
        if (!favoriteHistoryDetailBtn) return;
        favoriteHistoryDetailBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentItemInDetailView) toggleFavorite(currentItemInDetailView, 'detail');
        };
        
        const sendHistoryBtn = document.getElementById('send-history-to-img2img-btn');
        if (sendHistoryBtn) {
            sendHistoryBtn.onclick = (e) => {
                e.stopPropagation();
                if (currentItemInDetailView?.src) {
                    sendImageToImg2Img(currentItemInDetailView.src);
                    closeModal(historyDetailModal);
                }
            };
        }
        
        if (downloadHistoryDetailBtn) {
            downloadHistoryDetailBtn.onclick = (e) => {
                e.stopPropagation();
                if (currentItemInDetailView?.src) {
                    const link = document.createElement('a');
                    link.href = currentItemInDetailView.src;
                    link.download = `nano-banana-history-${currentItemInDetailView.id}.png`;
                    link.click();
                }
            };
        }
    }

    document.getElementById('download-result-btn')?.addEventListener('click', () => {
        if (currentGeneratedImage?.src) {
            const link = document.createElement('a');
            link.href = currentGeneratedImage.src;
            link.download = `nano-banana-${Date.now()}.png`;
            link.click();
        }
    });

    async function addToHistory(imageData) {
        try {
            const thumbnail = await createThumbnail(imageData.src);
            const historyItem = { ...imageData, thumbnail, timestamp: Date.now() };
            await addToHistoryDB(historyItem);
        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    }

    async function loadHistory() {
        try {
            renderGrid(historyGrid, await getHistoryDB(), '暂无历史记录', 'history');
        } catch (error) {
            historyGrid.innerHTML = '<p>无法加载历史记录。</p>';
        }
    }

    async function deleteItem(itemId, type) {
        if (!confirm('确定要删除这个项目吗？')) return;
        if (type === 'favorites') {
            let items = getStorage('favorites');
            setStorage('favorites', items.filter(item => (item.id || item.title || item.src) !== itemId));
            loadFavorites();
        } else {
            await deleteFromHistoryDB(itemId);
            loadHistory();
        }
    }

    async function renderGrid(gridElement, items, emptyText, type) {
        gridElement.innerHTML = '';
        if (!items || items.length === 0) {
            gridElement.innerHTML = `<div class="empty-grid"><div>${type === 'favorites' ? '💝' : '📝'}</div><p>${emptyText}</p></div>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        for (const item of items.slice(0, 100)) {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            const img = document.createElement('img');
            const imgSrc = type === 'history' ? item.thumbnail : (item.thumbnail || item.src || '');
            img.src = await getCachedImageOrFetch(imgSrc); // Use cache
            img.alt = 'Image';
            img.loading = 'lazy';
            const p = document.createElement('p');
            p.textContent = item.prompt || '';
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-item-btn';
            deleteBtn.innerHTML = '×';
            gridItem.onmouseenter = () => deleteBtn.style.display = 'block';
            gridItem.onmouseleave = () => deleteBtn.style.display = 'none';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteItem(item.id || item.title || item.src, type);
            };
            img.onclick = async () => {
                const fullSrc = item.src || item.thumbnail;
                currentItemInDetailView = { ...item, src: fullSrc, id: item.id || item.title || item.src };
                historyDetailImage.src = await getCachedImageOrFetch(fullSrc);
                historyDetailPrompt.textContent = item.prompt;
                updateFavoriteIcon(favoriteHistoryDetailBtn, currentItemInDetailView);
                openModal(historyDetailModal);
                setupHistoryDetailButtons();
            };
            gridItem.append(img, p, deleteBtn);
            fragment.appendChild(gridItem);
        }
        gridElement.appendChild(fragment);
    }

    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadArea.classList.add('dragging'); });
    fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('dragging'));
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragging');
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', (e) => { if (e.target.files.length) handleFiles(e.target.files); fileInput.value = ''; });

    function handleFiles(files) {
        const maxFiles = 5;
        const maxSize = 10 * 1024 * 1024;
        if (uploadedFiles.length + files.length > maxFiles) return alert(`最多只能上传 ${maxFiles} 张图片`);
        [...files].forEach(file => {
            if (!file.type.startsWith('image/')) return alert(`文件 "${file.name}" 不是图片格式`);
            if (file.size > maxSize) return alert(`文件 "${file.name}" 太大`);
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedFiles.push({ file, dataUrl: e.target.result });
                renderUploadPreviews();
            };
            reader.readAsDataURL(file);
        });
    }

    function renderUploadPreviews() {
        const thumbsContainer = fileUploadArea.querySelector('.upload-thumbs') || document.createElement('div');
        if (!thumbsContainer.classList.contains('upload-thumbs')) {
            thumbsContainer.className = 'upload-thumbs';
            fileUploadArea.querySelector('p').style.display = 'none';
            fileUploadArea.appendChild(thumbsContainer);
        }
        thumbsContainer.innerHTML = '';
        uploadedFiles.forEach((item, index) => {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'upload-thumb-item';
            const img = document.createElement('img');
            img.src = item.dataUrl;
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-thumb';
            removeBtn.textContent = '×';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                URL.revokeObjectURL(uploadedFiles[index].dataUrl);
                uploadedFiles.splice(index, 1);
                renderUploadPreviews();
                if (uploadedFiles.length === 0) fileUploadArea.querySelector('p').style.display = 'block';
            };
            thumbItem.append(img, removeBtn);
            thumbsContainer.appendChild(thumbItem);
        });
    }

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        sunIcon.style.display = theme === 'dark' ? 'none' : 'block';
        moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
    };
    themeBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (modelNameInput) modelNameInput.value = btn.dataset.model;
        });
    });

    const initialize = () => {
        tabTextToImage.addEventListener('click', () => switchTab(tabTextToImage, textToImagePanel));
        tabImageToImage.addEventListener('click', () => switchTab(tabImageToImage, imageToImagePanel));
        
        applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
        switchTab(tabTextToImage, textToImagePanel);

        const header = document.querySelector('header');
        if (header) document.body.style.paddingTop = `${header.offsetHeight + 25}px`;

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => { if (e.target === lightboxModal) closeLightbox(); });
        lightboxImage.addEventListener('click', e => e.stopPropagation());
        lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showPrevImage(); });
        lightboxNext.addEventListener('click', e => { e.stopPropagation(); showNextImage(); });
        document.addEventListener('keydown', handleKeydown);

        setupEventListeners();
    };

    window.addEventListener('beforeunload', () => {
        cleanupGalleryPreviewer();
        uploadedFiles.forEach(file => URL.revokeObjectURL(file.dataUrl));
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) cleanupGalleryPreviewer(); });

    initialize();
});