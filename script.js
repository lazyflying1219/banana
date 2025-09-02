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

    // 1. Load settings (无变化)
    function loadSettings() {
        apiUrlInput.value = localStorage.getItem('apiUrl') || '';
        apiKeyInput.value = localStorage.getItem('apiKey') || '';
        apiModelInput.value = localStorage.getItem('apiModel') || '';
    }

    // 2. Save settings (无变化)
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

    // ★★★★★ 7. Generate Image via CHAT INTERFACE ONLY (Definitive Version) ★★★★★
    async function generateImage() {
        const apiUrl = apiUrlInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        const model = apiModelInput.value.trim();
        const userPrompt = promptInput.value.trim();

        if (!apiUrl || !apiKey || !model) {
            alert('请先完成并保存API配置！请确保模型名称是聊天模型 (如 gpt-4o)，而不是图片模型！');
            return;
        }
        if (!userPrompt) {
            alert('请输入提示词！');
            return;
        }

        loader.style.display = 'block';
        imageResultContainer.innerHTML = '';
        imageResultContainer.appendChild(loader);
        generateBtn.disabled = true;
        generateBtn.textContent = '生成中...';

        try {
            // 始终使用聊天接口 /chat/completions
            const response = await fetch(`${apiUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            "role": "user",
                            "content": `请严格根据以下描述生成一张图片，不要添加任何额外评论: "${userPrompt}"`
                        }
                    ],
                    max_tokens: 1500 // 留足空间给可能返回的Base64数据
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.message || JSON.stringify(errorData);
                throw new Error(`API Error: ${errorMessage}`);
            }

            const data = await response.json();
            const message = data.choices[0]?.message;
            if (!message) throw new Error("API返回了无效的响应结构。");

            const img = document.createElement('img');
            img.alt = userPrompt;
            let imageUrlFound = false;

            // 智能解析逻辑：
            // 现代模型(如GPT-4o)返回的是一个内容数组
            if (Array.isArray(message.content)) {
                for (const contentPart of message.content) {
                    if (contentPart.type === 'image_url') {
                        // image_url.url 可能直接是 http://... 或 data:image/png;base64,...
                        // <img> 标签都能识别
                        img.src = contentPart.image_url.url;
                        imageUrlFound = true;
                        break; 
                    }
                }
            } 
            // 兼容老模型或非标准API，返回的是一个包含URL的字符串
            else if (typeof message.content === 'string') {
                const urlMatch = message.content.match(/\((https?:\/\/[^\s)]+)\)/) || message.content.match(/https?:\/\/[^\s]+/);
                if (urlMatch) {
                    img.src = urlMatch[0].replace('(', '').replace(')', '');
                    imageUrlFound = true;
                }
            }

            if (!imageUrlFound) {
                throw new Error("模型回复中未找到有效的图片URL或Base64数据。模型回复: " + (typeof message.content === 'string' ? message.content : JSON.stringify(message.content)));
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
