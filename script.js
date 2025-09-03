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

    function loadPage(page) {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        currentExamples = allExamples.slice(start, end);
        thumbnailTrack.innerHTML = ''; // 清空现有缩略图

        if (currentExamples.length === 0) {
            promptDisplayArea.textContent = '该分类下暂无灵感...';
            galleryPromptTitle.textContent = '空空如也';
            galleryPromptAuthor.textContent = '';
            return;
        }

        currentExamples.forEach((example, index) => {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'thumbnail-item';
            thumbItem.dataset.id = example.id || example.title;

            const img = document.createElement('img');
            img.alt = example.title;
            img.onerror = function() {
                console.warn(`缩略图加载失败: ${this.src}`);
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNmMmY0ZjYiLz48cGF0aCBkPSJNNTAuNzkyOSAzMy4xMjVIMzQuMjA4M1Y0OS43MDgzSDUwLjc5MjlaTTQ2LjQxNjcgMzcuNUw0Mi4wNDgzIDQxLjg3NUwzNy42Nzg0IDM3LjVIMzUuNTYyNVY0Ny41ODMzSDQ5LjQzNzVWNDEuODc1TDQ2LjQxNjcgMzcuNVoiIGZpbGw9IiNjMmNhZDEiLz48L3N2Zz4=';
                this.style.objectFit = 'scale-down';
            };
            img.src = example.thumbnail;
            thumbItem.appendChild(img);

            thumbItem.addEventListener('click', () => updateGalleryDisplay(index));

            // --- 预览器事件监听 (优化后) ---
            thumbItem.addEventListener('mouseenter', (e) => {
                if (previewInterval) clearInterval(previewInterval);
                galleryPreviewer.innerHTML = ''; // 清空旧内容

                const imagesToShow = [...(example.inputImages || []), ...(example.outputImages || [])].filter(Boolean);
                if (imagesToShow.length === 0) imagesToShow.push(example.thumbnail);

                imagesToShow.forEach(src => {
                    const previewImg = document.createElement('img');
                    previewImg.onerror = function() {
                        console.warn(`预览图加载失败: ${this.src}`);
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRw6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YyZjRmNiIvPjxwYXRoIGQ9Ik0yMjAuNTg4IDE2My41MjlIMTc5LjQxMlYyMzYuNDcxSDIyMC41ODhaTTIwOS40MTIgMTc5LjQxMkwxOTcuMDYxIDE5MS43NjNM MTg0LjcxMSAxNzkuNDEySDE3OS40MTJWMTk2LjQ3MUwyMDkuNDEyIDIyNi40NzFWMTkxLjc2M0wyMDMuNTI5IDE4NS44OEwyMDkuNDEyIDE3OS40MTJaIiBmaWxsPSIjYzJjYWQxIi8+PC9zdmc+';
                        this.style.objectFit = 'scale-down';
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
                            previewImages[currentPreviewIndex].classList.remove('active-preview');
                            currentPreviewIndex = (currentPreviewIndex + 1) % previewImages.length;
                            previewImages[currentPreviewIndex].classList.add('active-preview');
                        }, 1500);
                    }
                }
            });

            thumbItem.addEventListener('mouseleave', () => {
                if (previewInterval) clearInterval(previewInterval);
                galleryPreviewer.classList.remove('visible');
            });

            thumbnailTrack.appendChild(thumbItem);
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

    // --- 图片生成与展示 (无跳动优化) ---
    function displayImage(imageData) {
        let currentImg = imageDisplay.querySelector('img');
        if (!currentImg) {
            currentImg = document.createElement('img');
            imageDisplay.appendChild(currentImg);
        }
        
        currentImg.classList.remove('active');
        
        setTimeout(() => {
            currentImg.onerror = function() {
                console.error('生成结果图片加载失败:', this.src);
                imageDisplay.innerHTML = '<p>图片加载失败，请重试</p>';
                imageActions.classList.add('hidden');
            };
            currentImg.src = imageData.src;
            currentImg.alt = imageData.prompt || 'Generated Image';
            currentImg.onload = () => {
                setTimeout(() => currentImg.classList.add('active'), 50); 
            };
            if (currentImg.complete) {
                setTimeout(() => currentImg.classList.add('active'), 50);
            }
        }, 300);

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

        generateBtn.textContent = '生成中...';
        generateBtn.disabled = true;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model: modelName, images }),
            });
            if (!response.ok) throw new Error(`API 请求失败: ${response.statusText}`);
            const result = await response.json();
            // Correctly handle the response format { "src": "..." }
            const imageUrl = result.src || result.data?.src || result.output_url || result.output_image;
            if (imageUrl) {
                displayImage({ src: imageUrl, prompt: prompt, model: modelName });
            } else {
                throw new Error('API 返回数据中未找到图片URL');
            }
        } catch (error) {
            console.error('API 生成失败:', error);
            // Enhanced error handling to display raw response on the page
            try {
                const errorResponse = JSON.parse(error.message.substring(error.message.indexOf('{')));
                if (errorResponse && errorResponse.rawResponse) {
                    const debugInfo = JSON.stringify(errorResponse.rawResponse, null, 2);
                    imageDisplay.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; text-align: left; font-size: 12px; padding: 10px;">${debugInfo}</pre>`;
                    imageActions.classList.add('hidden');
                } else {
                     alert('生成失败，请检查API设置或网络连接。');
                }
            } catch (e) {
                 alert('生成失败，且无法解析错误详情。');
            }
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
        gridElement.innerHTML = '';
        if (!items || items.length === 0) {
            gridElement.innerHTML = `<p style="text-align:center; color:var(--text-color-light);">${emptyText}</p>`;
            return;
        }
        items.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            const imgSrc = item.thumbnail || item.src || ''; 
            gridItem.innerHTML = `
                <img src="${imgSrc}" alt="Image">
                <p title="${item.prompt}">${item.prompt}</p>
            `;
            gridItem.querySelector('img').addEventListener('click', () => {
                displayImage({ src: imgSrc, prompt: item.prompt, id: item.id });
                closeModal(favoritesModal);
                closeModal(historyModal);
            });
            gridElement.appendChild(gridItem);
        });
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
        [...files].forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedFiles.push({ file, dataUrl: e.target.result });
                    renderUploadPreviews();
                };
                reader.readAsDataURL(file);
            } else {
                console.warn('忽略非图片文件：', file.name);
            }
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
        thumbsContainer.innerHTML = '';
        uploadedFiles.forEach((item, index) => {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'upload-thumb-item';
            thumbItem.innerHTML = `<img src="${item.dataUrl}" alt="preview"><button class="remove-thumb" data-index="${index}">&times;</button>`;
            thumbsContainer.appendChild(thumbItem);
        });

        fileUploadArea.querySelectorAll('.remove-thumb').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const indexToRemove = parseInt(e.target.dataset.index, 10);
                uploadedFiles.splice(indexToRemove, 1);
                renderUploadPreviews();
                if (uploadedFiles.length === 0 && initialText) {
                    initialText.style.display = 'block';
                }
            });
        });
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

    // --- 初始化 ---
    const initialize = () => {
        tabTextToImage.addEventListener('click', () => switchTab(tabTextToImage, textToImagePanel));
        tabImageToImage.addEventListener('click', () => switchTab(tabImageToImage, imageToImagePanel));

        // 初始化API设置输入框的默认值
        if (apiUrlInput) apiUrlInput.value = apiUrlInput.value || '/api/generate';
        if (modelNameInput) modelNameInput.value = modelNameInput.value || 'vertexpic-gemini-2.5-flash-image-preview';

        // 初始化主题
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

        // 确保在所有事件监听器设置完毕后，再初始化
        // createGalleryPreviewer(); // This function is not defined in the provided script, commenting out.
        switchTab(tabTextToImage, textToImagePanel);
    };

    initialize();
});
