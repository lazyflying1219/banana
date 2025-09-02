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

    // 1. Load settings from localStorage (移除了responseFormat)
    function loadSettings() {
        apiUrlInput.value = localStorage.getItem('apiUrl') || '';
        apiKeyInput.value = localStorage.getItem('apiKey') || '';
        apiModelInput.value = localStorage.getItem('apiModel') || '';
    }

    // 2. Save settings to localStorage (移除了responseFormat)
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

    // 3. Load inspiration prompts (无变化)
    async function loadInspirationPrompts() {
        try {
            const response = await fetch('./prompts.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allPrompts = await response.json();
            displayPrompts(allPrompts);
        } catch (error) {
            console.error("Could not load inspiration prompts:", error);
            inspirationList.innerHTML = `<p style="color: var(--text-muted);">无法加载灵感案例 (prompts.json)。</p>`;
        }
    }

    // 4. Display prompts (无变化)
    function displayPrompts(prompts) {
        inspirationList.innerHTML = '';
        if (prompts.length === 0) {
            inspirationList.innerHTML = `<p style="color: var(--text-muted);">没有找到匹配的案例。</p>`;
            return;
        }
        prompts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inspiration-item';
            div.innerHTML = `<img src="${item.image_url}" alt="Inspiration image" loading="lazy"><p>${item.prompt}</p>`;
            div.addEventListener('click', () => {
                promptInput.value = item.prompt;
                promptInput.focus();
            });
            inspirationList.appendChild(div);
        });
    }
    
    // 5. Filter prompts (无变化)
    function filterPrompts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPrompts = allPrompts.filter(item => item.prompt.toLowerCase().includes(searchTerm));
        displayPrompts(filteredPrompts);
    }

    // 6. Handle tab switching (无变化)
    function handleTabSwitch(e) {
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        const clickedTab = e.currentTarget;
        clickedTab.classList.add('active');
        document.getElementById(clickedTab.dataset.tab).classList.add('active');
    }

    // ★★★★★ 7. Generate image with AUTO-DETECT logic ★★★★★
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
        imageResultContainer.innerHTML = '';
        imageResultContainer.appendChild(loader);
        generateBtn.disabled = true;
        generateBtn.textContent = '生成中...';

        try {
            // 我们默认请求URL，因为这样更高效。但后续代码能处理B64的响应。
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
                    size: "1024x1024",
                    response_format: "url" // 优先请求URL
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.message || JSON.stringify(errorData);
                throw new Error(`API Error: ${errorMessage}`);
            }

            const data = await response.json();
            const result = data.data && data.data[0];
            if (!result) {
                throw new Error("API返回了无效的数据结构。");
            }

            const img = document.createElement('img');
            img.alt = prompt;

            // 核心兼容逻辑：检查URL是否存在，如果不存在，则检查Base64
            if (result.url) {
                // 方式一：API返回了URL
                img.src = result.url;
            } else if (result.b64_json) {
                // 方式二：API返回了Base64数据
                img.src = `data:image/png;base64,${result.b64_json}`;
            } else {
                // 两种格式都未找到
                throw new Error("API响应中既未找到URL也未找到Base64数据。");
            }
            
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
