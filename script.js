document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const apiUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const apiModelInput = document.getElementById('api-model');
    const apiAlertBanner = document.getElementById('api-alert-banner');
    const generateBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt-input');
    const resultArea = document.getElementById('result-area');
    const initialResultPlaceholder = resultArea.innerHTML;

    // Image Upload Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const selectFileBtn = document.getElementById('select-file-btn');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    let referenceImageBase64 = null;

    // Template Carousel Elements
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const templateInfo = document.getElementById('template-info');
    const templateName = document.getElementById('template-name');
    const templateDescription = document.getElementById('template-description');
    const selectTemplateBtn = document.getElementById('select-template-btn');
    let templates = [];
    let selectedTemplate = null;
    let carouselIndex = 0;
    
    // Amount Slider
    const amountSlider = document.getElementById('amount-slider');
    const generateAmountText = document.getElementById('generate-amount-text');

    // --- Modal & Settings Logic ---
    const openModal = () => settingsModal.classList.remove('hidden');
    const closeModal = () => settingsModal.classList.add('hidden');
    settingsBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    settingsModal.addEventListener('click', (e) => e.target === settingsModal && closeModal());

    function loadSettings() {
        apiUrlInput.value = localStorage.getItem('apiUrl') || '';
        apiKeyInput.value = localStorage.getItem('apiKey') || '';
        apiModelInput.value = localStorage.getItem('apiModel') || 'gpt-4o';
        checkApiConfig();
    }

    function saveSettings() {
        localStorage.setItem('apiUrl', apiUrlInput.value);
        localStorage.setItem('apiKey', apiKeyInput.value);
        localStorage.setItem('apiModel', apiModelInput.value);
        checkApiConfig();
        closeModal();
    }
    saveSettingsBtn.addEventListener('click', saveSettings);

    function checkApiConfig() {
        const key = apiKeyInput.value.trim();
        apiAlertBanner.classList.toggle('hidden', !!key);
    }

    // --- Image Upload Logic ---
    selectFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
    });
    uploadArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files), false);
    
    document.addEventListener('paste', (e) => {
        handleFiles(e.clipboardData.files);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleFiles(files) {
        if (files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
            referenceImageBase64 = reader.result;
            imagePreviewContainer.innerHTML = `<img src="${referenceImageBase64}" alt="Preview"><button id="remove-image-btn"><i class="fa-solid fa-times"></i></button>`;
            imagePreviewContainer.classList.remove('hidden');
            document.getElementById('upload-placeholder').classList.add('hidden');
            document.getElementById('remove-image-btn').addEventListener('click', removeImage);
        };
        reader.readAsDataURL(file);
    }
    
    function removeImage() {
        referenceImageBase64 = null;
        imagePreviewContainer.innerHTML = '';
        imagePreviewContainer.classList.add('hidden');
        document.getElementById('upload-placeholder').classList.remove('hidden');
        fileInput.value = '';
    }

    // --- Template Carousel Logic ---
    async function loadTemplates() {
        try {
            const response = await fetch('./templates.json');
            templates = await response.json();
            renderCarousel();
        } catch (error) {
            console.error("Failed to load templates:", error);
        }
    }

    function renderCarousel() {
        carouselTrack.innerHTML = '';
        templates.forEach((template, index) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.dataset.index = index;
            card.innerHTML = `<img src="${template.image}" alt="${template.name}">`;
            card.addEventListener('click', () => selectTemplate(index));
            carouselTrack.appendChild(card);
        });
    }

    function selectTemplate(index) {
        selectedTemplate = templates[index];
        document.querySelectorAll('.template-card').forEach((card, i) => {
            card.classList.toggle('selected', i === index);
        });
        templateName.textContent = selectedTemplate.name;
        templateDescription.textContent = selectedTemplate.description;
        templateInfo.classList.remove('hidden');
        selectTemplateBtn.classList.remove('hidden');
    }
    
    selectTemplateBtn.addEventListener('click', () => {
        if (!selectedTemplate) return;
        promptInput.value += ` ${selectedTemplate.style_prompt}`;
    });

    function moveCarousel(direction) {
        const cardWidth = 110; // 100px width + 10px gap
        const trackWidth = carouselTrack.scrollWidth;
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        
        if (direction === 'next' && carouselIndex < templates.length - Math.floor(containerWidth / cardWidth)) {
            carouselIndex++;
        } else if (direction === 'prev' && carouselIndex > 0) {
            carouselIndex--;
        }
        carouselTrack.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;
    }
    carouselNext.addEventListener('click', () => moveCarousel('next'));
    carouselPrev.addEventListener('click', () => moveCarousel('prev'));

    // --- Amount Slider ---
    amountSlider.addEventListener('input', (e) => {
        generateAmountText.textContent = e.target.value;
    });

    // --- Generation Logic ---
    async function generateImage() {
        const key = apiKeyInput.value.trim();
        if (!key) {
            alert('请先在右上角设置中配置您的 API 密钥');
            openModal();
            return;
        }

        const prompt = promptInput.value.trim();
        if (!prompt && !referenceImageBase64) {
            alert('请输入提示词或上传参考图片！');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.classList.add('loading');
        generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 生成中...';
        
        resultArea.innerHTML = `<div class="result-image-wrapper"><div class="loader"></div></div>`;

        try {
            const content = [];
            // Add text prompt
            if (prompt) {
                content.push({ type: "text", text: prompt });
            }
            // Add reference image
            if (referenceImageBase64) {
                content.push({ type: "image_url", image_url: { url: referenceImageBase64 } });
            }

            const response = await fetch(`${apiUrlInput.value.trim()}/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify({
                    model: apiModelInput.value.trim(),
                    messages: [{ role: "user", content: content }],
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const message = data.choices[0]?.message;
            if (!message) throw new Error("API返回了无效的响应结构。");

            let imageUrl = '';
            if (Array.isArray(message.content)) {
                const imagePart = message.content.find(part => part.type === 'image_url');
                if (imagePart) imageUrl = imagePart.image_url.url;
            }

            if (!imageUrl) {
                throw new Error("模型回复中未找到图片数据。");
            }
            
            resultArea.innerHTML = `<div class="result-image-wrapper"><img src="${imageUrl}" alt="Generated Image"></div>`;

        } catch (error) {
            resultArea.innerHTML = `<div class="placeholder"><i class="fa-solid fa-circle-exclamation" style="color:red;"></i><p style="color:red;">生成失败</p><span>${error.message}</span></div>`;
        } finally {
            generateBtn.disabled = false;
            generateBtn.classList.remove('loading');
            generateBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> 生成 <span id="generate-amount-text">${amountSlider.value}</span> 张图片`;
        }
    }
    generateBtn.addEventListener('click', generateImage);

    // --- Initializations ---
    loadSettings();
    loadTemplates();
});
