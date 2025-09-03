document.addEventListener('DOMContentLoaded', () => {
    // --- 元素获取 ---
    const tabTextToImage = document.getElementById('tab-text-to-image');
    const tabImageToImage = document.getElementById('tab-image-to-image');
    const textToImagePanel = document.getElementById('text-to-image-panel');
    const imageToImagePanel = document.getElementById('image-to-image-panel');
    const promptInputText = document.getElementById('prompt-input-text');
    const promptInputImage = document.getElementById('prompt-input-image');
    const generateBtn = document.querySelector('.generate-button');

    // 头部按钮
    const settingsBtn = document.getElementById('settings-btn');
    const favoritesBtn = document.getElementById('favorites-btn');
    const historyBtn = document.getElementById('history-btn');

    // 结果区
    const imageDisplay = document.getElementById('image-display');
    const imageActions = document.getElementById('image-actions');
    const favoriteResultBtn = document.getElementById('favorite-result-btn');
    const downloadResultBtn = document.getElementById('download-result-btn');

    // 灵感画廊
    const promptDisplayArea = document.getElementById('prompt-display-area');
    const thumbnailTrack = document.getElementById('thumbnail-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const galleryPromptTitle = document.getElementById('gallery-prompt-title');
    const galleryPromptAuthor = document.getElementById('gallery-prompt-author');
    const selectTemplateBtn = document.getElementById('select-template-btn');

    // 模态框
    const settingsModal = document.getElementById('settings-modal');
    const favoritesModal = document.getElementById('favorites-modal');
    const historyModal = document.getElementById('history-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const closeFavoritesModalBtn = document.getElementById('close-favorites-modal-btn');
    const closeHistoryModalBtn = document.getElementById('close-history-modal-btn');
    const favoritesGrid = document.getElementById('favorites-grid');
    const historyGrid = document.getElementById('history-grid');

    // 文件上传
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('image-input');

    // --- 状态变量 ---
    let allExamples = [];
    let currentExamples = [];
    let currentIndexOnPage = 0;
    let currentPage = 0;
    const itemsPerPage = 15;
    let currentGeneratedImage = null;

    // 存储已上传的文件（File 对象或 dataURL），用于图生图后续处理
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

    settingsBtn?.addEventListener('click', () => openModal(settingsModal));
    closeModalBtn?.addEventListener('click', () => closeModal(settingsModal));
    settingsModal?.addEventListener('click', (e) => e.target === settingsModal && closeModal(settingsModal));

    favoritesBtn?.addEventListener('click', () => { loadFavorites(); openModal(favoritesModal); });
    closeFavoritesModalBtn?.addEventListener('click', () => closeModal(favoritesModal));
    favoritesModal?.addEventListener('click', (e) => e.target === favoritesModal && closeModal(favoritesModal));

    historyBtn?.addEventListener('click', () => { loadHistory(); openModal(historyModal); });
    closeHistoryModalBtn?.addEventListener('click', () => closeModal(historyModal));
    historyModal?.addEventListener('click', (e) => e.target === historyModal && closeModal(historyModal));

    // --- 灵感画廊 ---
    function updateGalleryDisplay(indexOnPage) {
        const example = currentExamples[indexOnPage];
        if (!example) return;
        promptDisplayArea.textContent = example.prompt;
        galleryPromptTitle.textContent = example.title;
        galleryPromptAuthor.textContent = `by ${example.author || 'N/A'}`;
        document.querySelectorAll('.thumbnail-item').forEach((item, i) => {
            item.classList.toggle('active', i === indexOnPage);
        });
        currentIndexOnPage = indexOnPage;
    }

    function loadPage(page) {
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

        currentExamples.forEach((example, index) => {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'thumbnail-item';
            const img = document.createElement('img');
            img.src = example.thumbnail;
            img.alt = example.title;
            thumbItem.appendChild(img);
            thumbItem.addEventListener('click', () => updateGalleryDisplay(index));

            const previewer = document.createElement('div');
            previewer.className = 'thumbnail-previewer';
            const imagesToShow = [...(example.inputImages || []), ...(example.outputImages || [])].filter(Boolean);
            if (imagesToShow.length === 0) imagesToShow.push(example.thumbnail);

            imagesToShow.forEach(src => {
                const previewImg = document.createElement('img');
                previewImg.src = src;
                previewer.appendChild(previewImg);
            });
            document.body.appendChild(previewer);

            let previewInterval = null;
            thumbItem.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                previewer.style.left = `${rect.right + 15}px`;
                previewer.style.top = `${window.scrollY + rect.top - 50}px`;
                previewer.classList.add('visible');
                const previewImages = previewer.querySelectorAll('img');
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
                previewer.classList.remove('visible');
                if (previewInterval) clearInterval(previewInterval);
                previewer.querySelectorAll('img').forEach(imgEl => imgEl.classList.remove('active-preview'));
            });
            thumbnailTrack.appendChild(thumbItem);
        });
        updateGalleryDisplay(0);
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        carouselPrev.disabled = currentPage === 0;
        const maxPage = Math.ceil(allExamples.length / itemsPerPage) - 1;
        carouselNext.disabled = currentPage >= maxPage;
    }

    carouselPrev?.addEventListener('click', () => {
        if (currentPage > 0) { currentPage--; loadPage(currentPage); }
    });
    carouselNext?.addEventListener('click', () => {
        const maxPage = Math.ceil(allExamples.length / itemsPerPage) - 1;
        if (currentPage < maxPage) { currentPage++; loadPage(currentPage); }
    });

    selectTemplateBtn?.addEventListener('click', () => {
        const example = currentExamples[currentIndexOnPage];
        if (!example) return;
        const targetTextArea = textToImagePanel.classList.contains('active') ? promptInputText : promptInputImage;
        targetTextArea.value = example.prompt;
        targetTextArea.focus();
    });

    // --- 图片生成与展示 ---
    function displayImage(imageData) {
        // 支持 imageData.src 为字符串或数组（如果后端返回多张输出）
        if (Array.isArray(imageData.src)) {
            imageDisplay.innerHTML = imageData.src.map(s => `<img src="${s}" alt="Generated Image">`).join('');
        } else {
            imageDisplay.innerHTML = `<img src="${imageData.src}" alt="Generated Image">`;
        }
        imageActions.classList.remove('hidden');
        currentGeneratedImage = imageData;
        updateFavoriteIcon();
        addToHistory(imageData);
    }

    function mockGenerateImage() {
        const prompt = promptInputText.value || promptInputImage.value || "一个美丽的日落";
        const randomExample = allExamples.length ? allExamples[Math.floor(Math.random() * allExamples.length)] : { thumbnail: '', outputImages: [] };
        const output = Array.isArray(randomExample.outputImages) && randomExample.outputImages.length ? randomExample.outputImages[0] : randomExample.thumbnail;
        const imageData = {
            id: Date.now(),
            src: output || '',
            prompt: prompt,
        };
        displayImage(imageData);
    }
    generateBtn?.addEventListener('click', mockGenerateImage);

    // --- 收藏 ---
    function toggleFavorite() {
        if (!currentGeneratedImage) return;
        let favorites = getStorage('favorites');
        const existingIndex = favorites.findIndex(fav => fav.id === currentGeneratedImage.id);
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
        } else {
            favorites.unshift(currentGeneratedImage);
        }
        setStorage('favorites', favorites);
        updateFavoriteIcon();
    }

    function updateFavoriteIcon() {
        if (!currentGeneratedImage) return;
        const favorites = getStorage('favorites');
        const isFavorited = favorites.some(fav => fav.id === currentGeneratedImage.id);
        favoriteResultBtn.textContent = isFavorited ? '❤️' : '🤍';
    }

    function loadFavorites() {
        const favorites = getStorage('favorites');
        renderGrid(favoritesGrid, favorites, '暂无收藏');
    }
    favoriteResultBtn?.addEventListener('click', toggleFavorite);

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
        const history = getStorage('history');
        renderGrid(historyGrid, history, '暂无历史记录');
    }

    // --- 通用网格渲染 ---
    function renderGrid(gridElement, items, emptyText) {
        gridElement.innerHTML = '';
        if (!items || items.length === 0) {
            gridElement.innerHTML = `<p>${emptyText}</p>`;
            return;
        }
        items.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.innerHTML = `
                <img src="${item.src}" alt="Image">
                <p title="${item.prompt}">${item.prompt}</p>
            `;
            gridItem.querySelector('img').addEventListener('click', () => {
                displayImage(item);
                closeModal(favoritesModal);
                closeModal(historyModal);
            });
            gridElement.appendChild(gridItem);
        });
    }

    // --- 文件上传（支持多图） ---
    // 将 fileInput 和拖拽的 FileList 统一传入 handleFile
    fileUploadArea?.addEventListener('click', () => fileInput.click());
    fileUploadArea?.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadArea.classList.add('dragging'); });
    fileUploadArea?.addEventListener('dragleave', () => { fileUploadArea.classList.remove('dragging'); });
    fileUploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragging');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files); // FileList
        }
    });

    fileInput?.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files); // FileList
            // 清除以允许再次选择同样的文件
            fileInput.value = '';
        }
    });

    // handleFile 接受 File、FileList 或数组
    function handleFile(files) {
        const fileList = (files instanceof File) ? [files] : Array.from(files || []);
        fileList.forEach(file => {
            if (file && file.type && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target.result;
                    // 保存到 uploadedFiles
                    uploadedFiles.push({ file, dataUrl });
                    // 渲染预览缩略图（追加）
                    renderUploadPreviews();
                };
                reader.readAsDataURL(file);
            } else {
                // 非图片忽略或提示
                console.warn('忽略非图片文件：', file);
            }
        });
    }

    function renderUploadPreviews() {
        // 清空并重建缩略图列表
        // 我们在 fileUploadArea 显示一个预览容器
        fileUploadArea.innerHTML = '';
        const info = document.createElement('div');
        info.className = 'upload-info';
        info.textContent = '已上传参考图：';
        fileUploadArea.appendChild(info);

        const thumbsContainer = document.createElement('div');
        thumbsContainer.className = 'upload-thumbs';
        uploadedFiles.forEach((it, idx) => {
            const wrap = document.createElement('div');
            wrap.className = 'upload-thumb-item';
            wrap.innerHTML = `<img src="${it.dataUrl}" alt="preview"><button class="remove-thumb" data-index="${idx}">✕</button>`;
            thumbsContainer.appendChild(wrap);
        });
        fileUploadArea.appendChild(thumbsContainer);

        // 添加一个提示行（仍可点击上传更多）
        const hint = document.createElement('p');
        hint.className = 'upload-hint';
        hint.textContent = '点击或拖拽更多图片到此区域';
        fileUploadArea.appendChild(hint);

        // 绑定移除事件
        fileUploadArea.querySelectorAll('.remove-thumb').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = Number(e.currentTarget.getAttribute('data-index'));
                if (!Number.isNaN(i)) {
                    uploadedFiles.splice(i, 1);
                    renderUploadPreviews();
                }
            });
        });
    }

    // --- 初始化 --- 
    tabTextToImage.addEventListener('click', () => switchTab(tabTextToImage, textToImagePanel));
    tabImageToImage.addEventListener('click', () => switchTab(tabImageToImage, imageToImagePanel));
    switchTab(tabTextToImage, textToImagePanel);
});