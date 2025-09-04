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

    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('image-input');
    
    const apiUrlInput = document.getElementById('api-url');
    const modelNameInput = document.getElementById('model-name');

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
    let uploadedFiles = []; // { file: File, dataUrl: string }

    // --- 通用函数 ---
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
    [settingsModal, favoritesModal, historyModal].forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });

    // --- 图片代理函数 ---
    function getProxiedImageUrl(originalUrl) {
        // 检查是否为GitHub raw URL
        if (originalUrl && originalUrl.includes('raw.githubusercontent.com')) {
            return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
        }
        return originalUrl;
    }

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

            const img = document.createElement('img');
            img.alt = example.title;
            img.loading = 'lazy'; // 懒加载
            img.onerror = function() {
                console.warn(`缩略图加载失败: ${this.src}`);
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNmMmY0ZjYiLz48cGF0aCBkPSJNNTAuNzkyOSAzMy4xMjVIMzQuMjA4M1Y0OS43MDgzSDUwLjc5MjlaTTQ2LjQxNjcgMzcuNUw0Mi4wNDgzIDQxLjg3NUwzNy42Nzg0IDM3LjVIMzUuNTYyNVY0Ny41ODMzSDQ5LjQzNzVWNDEuODc1TDQ2LjQxNjcgMzcuNVoiIGZpbGw9IiNjMmNhZDEiLz48L3N2Zz4=';
                this.style.objectFit = 'scale-down';
            };
            img.src = getProxiedImageUrl(example.thumbnail);
            thumbItem.appendChild(img);

            // 点击事件
            const clickHandler = () => updateGalleryDisplay(index);
            thumbItem.addEventListener('click', clickHandler);

            // 预览器事件 - 仅在桌面端启用
            if (window.matchMedia('(hover: hover)').matches) {
                let mouseEnterHandler, mouseLeaveHandler;
                
                mouseEnterHandler = (e) => {
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
                    galleryPreviewer.style.left = `${rect.right + 15}px`;
                    galleryPreviewer.style.top = `${window.scrollY + rect.top - 50}px`;
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
                };

                mouseLeaveHandler = () => {
                    cleanupGalleryPreviewer();
                };

                thumbItem.addEventListener('mouseenter', mouseEnterHandler);
                thumbItem.addEventListener('mouseleave', mouseLeaveHandler);
            }

            fragment.appendChild(thumbItem);
        });

        thumbnailTrack.appendChild(fragment);
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

    // --- 图片生成与展示 (无跳动优化) ---
    function displayImage(imageData) {
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
        
        currentImg.onload = () => {
            setTimeout(() => { currentImg.style.opacity = 1; }, 50); 
        };
        if (currentImg.complete) {
            setTimeout(() => { currentImg.style.opacity = 1; }, 50);
        }

        imageActions.classList.remove('hidden');
        currentGeneratedImage = { ...imageData, id: imageData.id || Date.now() };
        updateResultFavoriteIcon();
        addToHistory(currentGeneratedImage);
    }

    async function generateImage() {
        const apiUrl = apiUrlInput.value;
        const modelName = modelNameInput.value;
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
            let errorMessage = '生成失败，请重试';
            
            if (error.error) {
                errorMessage = error.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            
            const errorP = document.createElement('p');
            errorP.textContent = `❌ ${errorMessage}`;
            
            const retryBtn = document.createElement('button');
            retryBtn.className = 'retry-btn';
            retryBtn.textContent = '重试';
            retryBtn.addEventListener('click', generateImage);
            
            errorDiv.appendChild(errorP);
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
            favorites.splice(existingIndex, 1);
        } else {
            favorites.unshift({ ...item, type, id: itemId });
        }
        setStorage('favorites', favorites);
        if (type === 'template') updateTemplateFavoriteIcon();
        else updateResultFavoriteIcon();
    }

    function updateTemplateFavoriteIcon() {
        const example = currentExamples[currentIndexOnPage];
        if (!example || !favoriteTemplateBtn) return;
        
        const favorites = getStorage('favorites');
        const exampleId = example.id || example.title;
        const isFavorited = favorites.some(fav => fav.id === exampleId);
        favoriteTemplateBtn.classList.toggle('favorited', isFavorited);
    }

    function updateResultFavoriteIcon() {
        if (!currentGeneratedImage || !favoriteResultBtn) return;
        
        const favorites = getStorage('favorites');
        const isFavorited = favorites.some(fav => fav.id === currentGeneratedImage.id);
        favoriteResultBtn.classList.toggle('favorited', isFavorited);
    }

    function loadFavorites() {
        renderGrid(favoritesGrid, getStorage('favorites'), '暂无收藏');
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

    // --- 历史记录 ---
    function addToHistory(imageData) {
        let history = getStorage('history');
        if (!history.some(item => item.id === imageData.id)) {
            history.unshift(imageData);
            if (history.length > 50) history.pop();
            setStorage('history', history);
        }
    }

    function loadHistory() {
        renderGrid(historyGrid, getStorage('history'), '暂无历史记录');
    }

    // --- 通用网格渲染 ---
    function renderGrid(gridElement, items, emptyText) {
        // 清理现有事件监听器
        const existingItems = gridElement.querySelectorAll('.grid-item');
        existingItems.forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });
        
        gridElement.innerHTML = '';
        
        if (!items || items.length === 0) {
            gridElement.innerHTML = `<p style="text-align:center; color:var(--text-color-light);">${emptyText}</p>`;
            return;
        }
        
        // 使用文档片段提高性能
        const fragment = document.createDocumentFragment();
        
        // 限制显示数量，避免内存过度使用
        const maxItems = 100;
        const limitedItems = items.slice(0, maxItems);
        
        limitedItems.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            
            const img = document.createElement('img');
            const imgSrc = item.thumbnail || item.src || '';
            img.src = getProxiedImageUrl(imgSrc);
            img.alt = 'Image';
            img.loading = 'lazy';
            
            const p = document.createElement('p');
            p.title = item.prompt || '';
            p.textContent = item.prompt || '';
            
            // 使用单个事件监听器
            img.addEventListener('click', () => {
                displayImage({ src: getProxiedImageUrl(imgSrc), prompt: item.prompt, id: item.id });
                closeModal(favoritesModal);
                closeModal(historyModal);
            });
            
            gridItem.appendChild(img);
            gridItem.appendChild(p);
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

    // --- 设置保存 ---
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            localStorage.setItem('apiUrl', apiUrlInput.value);
            localStorage.setItem('modelName', modelNameInput.value);
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
        const savedApiUrl = localStorage.getItem('apiUrl');
        const savedModelName = localStorage.getItem('modelName');
        
        if (apiUrlInput) apiUrlInput.value = savedApiUrl || '/api/generate';
        if (modelNameInput) modelNameInput.value = savedModelName || 'vertexpic-gemini-2.5-flash-image-preview';

        // 初始化主题
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

        switchTab(tabTextToImage, textToImagePanel);
    };

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