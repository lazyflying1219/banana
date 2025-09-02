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

    // 7. Generate image via API call (MODIFIED FUNCTION)
    async function generateImage() {
        const apiUrl = apiUrlInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        const model = apiModelInput.value.trim();
        const userPrompt = promptInput.value.trim();

        if (!apiUrl || !apiKey || !model) {
            alert('请先完成并保存API配置！');
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
            // ★★★★★ CORE CHANGE START ★★★★★

            // Use the Chat Completions endpoint
            const response = await fetch(`${apiUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                // Re-structured body for chat models that can generate images (like gpt-4o)
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            "role": "user",
                            // We instruct the model to generate an image based on the user's prompt.
                            "content": `根据以下描述生成一张图片: "${userPrompt}"`
                        }
                    ],
                    max_tokens: 1024 // Allow enough space for the response containing the URL
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.message || JSON.stringify(errorData);
                throw new Error(`API Error: ${errorMessage}`);
            }

            const data = await response.json();
            
            // Parse the image URL from the chat response
            const assistantResponse = data.choices[0]?.message?.content;
            if (!assistantResponse) {
                throw new Error("API返回了无效的响应格式。");
            }

            // Use regex to find a URL within markdown image syntax: ![...](URL) or just a raw URL.
            // This regex looks for a URL inside parentheses, which is common in markdown.
            const urlMatch = assistantResponse.match(/\((https?:\/\/[^\s)]+)\)/);
            let imageUrl = null;

            if (urlMatch && urlMatch[1]) {
                imageUrl = urlMatch[1];
            } else {
                // Fallback: If no markdown pattern is found, try to find the first raw URL in the text.
                const fallbackUrlMatch = assistantResponse.match(/https?:\/\/[^\s]+/);
                if (fallbackUrlMatch) {
                    imageUrl = fallbackUrlMatch[0];
                }
            }
            
            if (!imageUrl) {
                // If no URL is found at all, show the model's text response for debugging.
                throw new Error("模型没有返回有效的图片URL。模型回复: " + assistantResponse);
            }

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = userPrompt;
            
            loader.style.display = 'none';
            imageResultContainer.innerHTML = '';
            imageResultContainer.appendChild(img);

            // ★★★★★ CORE CHANGE END ★★★★★

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
