document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const apiUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const apiModelInput = document.getElementById('api-model');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const inspirationList = document.getElementById('inspiration-list');
    const searchInput = document.getElementById('search-prompts');
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const imageResultContainer = document.getElementById('image-result');
    const loader = document.getElementById('loader');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    let allPrompts = [];

    // --- Functions ---

    // 1. Load settings from localStorage
    function loadSettings() {
        const url = localStorage.getItem('apiUrl');
        const key = localStorage.getItem('apiKey');
        const model = localStorage.getItem('apiModel');
        if (url) apiUrlInput.value = url;
        if (key) apiKeyInput.value = key;
        if (model) apiModelInput.value = model;
    }

    // 2. Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('apiUrl', apiUrlInput.value);
        localStorage.setItem('apiKey', apiKeyInput.value);
        localStorage.setItem('apiModel', apiModelInput.value);
        
        saveSettingsBtn.textContent = '已保存!';
        saveSettingsBtn.style.backgroundColor = '#45a049';
        setTimeout(() => {
            saveSettingsBtn.textContent = '保存配置';
            saveSettingsBtn.style.backgroundColor = 'var(--success-color)';
        }, 2000);
    }

    // 3. Load inspiration prompts from JSON
    async function loadInspirationPrompts() {
        try {
            const response = await fetch('./prompts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allPrompts = await response.json();
            displayPrompts(allPrompts);
        } catch (error) {
            console.error("Could not load inspiration prompts:", error);
            inspirationList.innerHTML = `<p style="color: var(--text-muted);">无法加载灵感案例 (prompts.json)。</p>`;
        }
    }

    // 4. Display prompts in the sidebar
    function displayPrompts(prompts) {
        inspirationList.innerHTML = '';
        if (prompts.length === 0) {
            inspirationList.innerHTML = `<p style="color: var(--text-muted);">没有找到匹配的案例。</p>`;
            return;
        }
        prompts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inspiration-item';
            div.innerHTML = `
                <img src="${item.image_url}" alt="Inspiration image" loading="lazy">
                <p>${item.prompt}</p>
            `;
            div.addEventListener('click', () => {
                promptInput.value = item.prompt;
                promptInput.focus();
            });
            inspirationList.appendChild(div);
        });
    }
    
    // 5. Filter prompts based on search input
    function filterPrompts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPrompts = allPrompts.filter(item => 
            item.prompt.toLowerCase().includes(searchTerm)
        );
        displayPrompts(filteredPrompts);
    }

    // 6. Handle tab switching
    function handleTabSwitch(e) {
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        const clickedTab = e.currentTarget;
        clickedTab.classList.add('active');
        document.getElementById(clickedTab.dataset.tab).classList.add('active');
    }

    // 7. Generate image via API call
    async function generateImage() {
        const apiUrl = apiUrlInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        const model = apiModelInput.value.trim();
        const prompt = promptInput.value.trim();

        if (!apiUrl || !apiKey || !model) {
            alert('请先完成并保存API配置！');
            return;
        }
        if (!prompt) {
            alert('请输入提示词！');
            return;
        }

        loader.style.display = 'block';
        imageResultContainer.innerHTML = ''; // Clear previous result
        imageResultContainer.appendChild(loader);
        generateBtn.disabled = true;
        generateBtn.textContent = '生成中...';

        try {
            // 注意：这里的请求体格式是基于OpenAI DALL-E API的。
            // 如果你使用的API有不同的格式，需要修改这里的body。
            const response = await fetch(`${apiUrl}/images/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024", // 你可以根据需要修改尺寸
                    response_format: "url" // 我们需要API返回图片URL
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error.message}`);
            }

            const data = await response.json();
            const imageUrl = data.data[0].url;

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = prompt;
            
            loader.style.display = 'none';
            imageResultContainer.innerHTML = '';
            imageResultContainer.appendChild(img);

        } catch (error) {
            console.error('Generation failed:', error);
            loader.style.display = 'none';
            imageResultContainer.innerHTML = `<p style="color: #ff6b6b;">生成失败: ${error.message}</p>`;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '生成图片';
        }
    }


    // --- Event Listeners ---
    saveSettingsBtn.addEventListener('click', saveSettings);
    searchInput.addEventListener('input', filterPrompts);
    tabs.forEach(tab => tab.addEventListener('click', handleTabSwitch));
    generateBtn.addEventListener('click', generateImage);


    // --- Initializations ---
    loadSettings();
    loadInspirationPrompts();
});
