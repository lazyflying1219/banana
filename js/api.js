import { getState } from './state.js';
import { elements, displayImage, showGenerationError } from './ui.js';
import { addToHistory } from './storage.js';

const API_URL = '/api/generate';

// --- 图片代理 ---
export function getProxiedImageUrl(originalUrl) {
    if (!originalUrl || originalUrl.startsWith('data:') || (originalUrl.startsWith('/') && !originalUrl.startsWith('//'))) {
        return originalUrl;
    }
    if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://') || originalUrl.startsWith('//')) {
        return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    }
    return originalUrl;
}

// --- 图片生成 ---
export async function generateImage() {
    await generateImageWithRetry();
}

async function generateImageWithRetry(retryCount = 0) {
    const maxRetries = 3;
    const modelName = elements.modelNameInput ? elements.modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview';
    const prompt = elements.textToImagePanel.classList.contains('active') ? elements.promptInputText.value : elements.promptInputImage.value;
    let images = getState('uploadedFiles').map(f => f.dataUrl);

    if (!prompt.trim()) {
        alert('请输入提示词');
        return;
    }

    if (retryCount === 0) {
        elements.generateBtn.textContent = '生成中...';
        elements.generateBtn.disabled = true;
        elements.imageDisplay.innerHTML = '<div class="loading-spinner"><p>正在为您生成图片...</p><div class="spinner"></div></div>';
        elements.imageActions.classList.add('hidden');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
        let finalPrompt = prompt;
        if (getState('selectedRatio')) {
            finalPrompt += `\n\nPlease generate the image with an aspect ratio of ${getState('selectedRatio')}.`;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: finalPrompt,
                model: modelName,
                images: images,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw await response.json();
        }

        const result = await response.json();
        if (result.src) {
            elements.generateBtn.textContent = '生成';
            elements.generateBtn.disabled = false;
            const imageData = { src: result.src, prompt: prompt, model: modelName };
            displayImage(imageData);
            await addToHistory(imageData);
        } else {
            throw new Error('API 返回数据中未找到图片');
        }

    } catch (error) {
        if (retryCount < maxRetries && shouldRetry(error)) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
            return await generateImageWithRetry(retryCount + 1);
        }
        showGenerationError(error, retryCount);
        elements.generateBtn.textContent = '生成';
        elements.generateBtn.disabled = false;
    } finally {
        clearTimeout(timeoutId);
    }
}

function shouldRetry(error) {
    if (error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('aborted'))) {
        return true;
    }
    const errorMessage = (error.message || error.error || '').toLowerCase();
    const retryableErrors = ['timeout', 'network', 'connection', 'temporary', 'rate limit', 'service unavailable', 'internal server error'];
    return retryableErrors.some(keyword => errorMessage.includes(keyword));
}

// --- API 测试 ---
export async function testApi() {
    const testApiBtn = document.getElementById('test-api-btn');
    const apiTestResult = document.getElementById('api-test-result');
    if (!testApiBtn || !apiTestResult) return;

    testApiBtn.textContent = '测试中...';
    testApiBtn.disabled = true;
    apiTestResult.innerHTML = '🔄 正在测试API连接...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: '测试图片生成：一只可爱的小猫',
                model: elements.modelNameInput ? elements.modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview'
            }),
        });
        const result = await response.json();
        if (response.ok && result.src) {
            apiTestResult.innerHTML = '✅ API连接成功！图片生成正常';
        } else {
            apiTestResult.innerHTML = `❌ API测试失败: ${JSON.stringify(result, null, 2)}`;
        }
    } catch (error) {
        apiTestResult.innerHTML = `❌ 网络错误: ${error.message}`;
    }

    testApiBtn.textContent = '测试图片生成';
    testApiBtn.disabled = false;
}