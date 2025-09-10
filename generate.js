// generate.js - core image generation flow (txt2img, img2img, editor)
(function(){
  window.App = window.App || {}; const App = window.App; const U = () => App.utils; const HF = ()=> App.historyFavorites;

  function setLoadingState(loadingText){
    const { generateBtn, imageDisplay, imageActions } = App.dom;
    if (generateBtn){ generateBtn.textContent = '生成中...'; generateBtn.disabled = true; }
    if (imageDisplay){ imageDisplay.innerHTML = `<div class="loading-spinner"><p>${loadingText || '正在为您生成图片...'}</p><div class="spinner"></div></div>`; }
    if (imageActions){ imageActions.classList.add('hidden'); }
  }
  function clearLoadingState(){ const { generateBtn } = App.dom; if (generateBtn){ generateBtn.textContent = '生成'; generateBtn.disabled = false; } }

  function imageToDataUrl(url){ return fetch(url).then(r=>{ if(!r.ok) throw new Error(`无法获取图片: ${url}, 状态: ${r.status}`); return r.blob(); }).then(blob=> new Promise((resolve,reject)=>{ const reader=new FileReader(); reader.onloadend=()=>resolve(reader.result); reader.onerror=reject; reader.readAsDataURL(blob); })).catch(()=>null); }

  function applyImageFadeIn(imgEl){ imgEl.style.opacity=0; imgEl.onload = ()=> setTimeout(()=> imgEl.style.opacity = 1, 50); if (imgEl.complete) setTimeout(()=> imgEl.style.opacity = 1, 50); }

  // Check output image aspect ratio against selection; allow small tolerance
  async function imageAspectMatches(src, ratioStr, tolerance = 0.03){
    return new Promise((resolve) => {
      if (!src || !ratioStr || !ratioStr.includes(':')) return resolve(true);
      const [wStr, hStr] = ratioStr.split(':');
      const expW = parseFloat(wStr); const expH = parseFloat(hStr);
      if (!expW || !expH) return resolve(true);
      const expected = expW / expH;
      const img = new Image();
      img.onload = () => {
        const actual = img.naturalWidth / img.naturalHeight;
        const dev = Math.abs(actual - expected) / expected;
        resolve(dev <= tolerance);
      };
      img.onerror = () => resolve(true);
      img.src = src;
    });
  }

  async function displayImage(imageData){
    const { imageDisplay, imageActions } = App.dom;
    imageDisplay.innerHTML = '';
    const currentImg = document.createElement('img'); currentImg.decoding='async'; currentImg.onerror = function(){ imageDisplay.innerHTML = '<p>图片加载失败，请重试</p>'; imageActions.classList.add('hidden'); };
    currentImg.src = imageData.src; currentImg.alt = imageData.prompt || 'Generated Image';
    applyImageFadeIn(currentImg); imageDisplay.appendChild(currentImg);
    currentImg.addEventListener('click', async ()=>{
      if (App.gallery && App.gallery.updateGalleryDisplay){ await (async ()=>{ const idx=0; App.gallery.updateGalleryDisplay(idx); })(); }
      // open like lightbox but only with current image
      App.dom.lightboxImage.src = imageData.src; App.dom.lightboxImage.alt = imageData.prompt || 'image'; App.dom.lightboxModal.classList.remove('hidden'); document.body.style.overflow='hidden';
    });
    imageActions.classList.remove('hidden');
    App.state.currentGeneratedImage = { ...imageData, id: imageData.id || `gen_${Date.now()}`, timestamp: Date.now() };
    HF() && HF().addToHistory && HF().addToHistory(App.state.currentGeneratedImage);
    HF() && HF().updateResultFavoriteIcon && HF().updateResultFavoriteIcon();
  }

  function buildEnhancedPrompt({ basePrompt, selectedRatio, hasUserImages, useAspectRatioCanvas, annotations, ratioConfig }){
    const qualityEnhancers = '4K, HDR, physically-based lighting, photorealistic materials, accurate perspective, crisp details, clean background, no borders';
    let instructions = '';
    if (useAspectRatioCanvas){
      instructions += '你是一位专业的图像生成师。严格遵循以下布局与质量约束：\n';
      instructions += `- 重要: 最后一张图片是“宽高比画布” (${selectedRatio})，只用于框定输出比例，原有内容必须忽略。\n`;
      instructions += `- 输出图像必须完整填充画布，不留边框或留白。\n`;
      instructions += `- 质量要求：${qualityEnhancers}。\n`;
    } else if (selectedRatio){
      instructions += `- 输出比例：${ratioConfig.description} (${selectedRatio})，必须严格遵循，画面需充满。质量：${qualityEnhancers}。\n`;
    } else {
      instructions += `- 质量：${qualityEnhancers}。\n`;
    }
    if (hasUserImages){ instructions += '- 你接收到的前几张图片是“参考图”，请在风格、纹理与主体上进行融合与重绘，而非简单拼贴。\n'; }
    if (annotations && annotations.length){
      instructions += '- 使用用户在编辑图中绘制的标注来指导具体布局：\n';
      annotations.forEach((a, idx)=>{
        const norm = a.norm || {}; const base = `#${idx+1} 颜色:${a.color} 标签:${a.label||''}`;
        if (a.type==='rect'){
          instructions += `  - 矩形${base} | 归一化: x=${fmt(norm.x)}, y=${fmt(norm.y)}, w=${fmt(norm.w)}, h=${fmt(norm.h)}。在此区域内优先放置对应元素。\n`;
        } else if (a.type==='circle'){
          instructions += `  - 圆形${base} | 归一化: cx=${fmt(norm.cx)}, cy=${fmt(norm.cy)}, rx=${fmt(norm.rx)}, ry=${fmt(norm.ry)}。视为高亮/关注区域。\n`;
        } else if (a.type==='arrow'){
          instructions += `  - 箭头${base} | 归一化: x1=${fmt(norm.x1)}, y1=${fmt(norm.y1)} → x2=${fmt(norm.x2)}, y2=${fmt(norm.y2)}。表示方向或元素放置的流向/指向关系。\n`;
        } else if (a.type==='text'){
          instructions += `  - 文字${base} | 归一化: x=${fmt(norm.x)}, y=${fmt(norm.y)}。文字内容作为意图提示，不要在最终图上绘制文字叠层。\n`;
        }
      });
      instructions += '- 请根据这些标注进行合理排版与物体摆放，保持真实的光影、材质和透视一致性；最终图像中不要包含任何标注、红框、箭头或文字的可见痕迹，仅把它们视为布局指导。\n';
    }
    // 强化不渲染标注的要求
    instructions += '\n- 严禁在最终图像中绘制框线、标注、说明文字或任何叠加元素。\n';
    return `${instructions}\n用户的需求："${basePrompt}"`;
  }
  function fmt(n){ return (typeof n === 'number' ? n.toFixed(3) : n); }

  function shouldRetry(error){
    if (error instanceof TypeError && error.message.includes('fetch')) return true;
    if (error.error && typeof error.error === 'string'){
      if (error.error.includes('HTTP 5') || error.error.includes('timeout') || error.error.includes('连接') || error.error.includes('服务器')) return true;
    }
    const retryable = ['timeout','network','connection','temporary','rate limit','service unavailable','internal server error'];
    const msg = (error.message || error.error || '').toLowerCase();
    return retryable.some(k => msg.includes(k));
  }

  function handleGenerationError(error, finalRetryCount){
    clearLoadingState();
    const errorData = error.errorData || error;
    let displayMessage = error.error || error.message || '生成失败，请重试';
    let showRetryButton = true;
    if (error.isTextResponseError){ const maxTextRetries = 2; if (finalRetryCount >= maxTextRetries - 1){ displayMessage = '模型返回了文本而非图片。请尝试修改提示词，更明确地描述您想要生成的图片内容。'; showRetryButton=false; } else { displayMessage = '模型返回了文本而非图片，正在自动重试...'; } }
    const errorDiv = document.createElement('div'); errorDiv.className='error-message'; errorDiv.style.textAlign='left';
    const errorP = document.createElement('p'); errorP.textContent = `❌ ${displayMessage}`; errorDiv.appendChild(errorP);
    const debugInfo = document.createElement('details'); debugInfo.style.marginTop='15px';
    const errorDetails = { message: error.message||'未知错误', stack: error.stack||'无堆栈信息', name: error.name||'未知错误类型', error: errorData.error||null, details: errorData.details||null, rawResponse: errorData.rawResponse||null, responseText: errorData.responseText||null, totalRetries: finalRetryCount, isTextResponseError: error.isTextResponseError||false };
    debugInfo.innerHTML = `<summary style="cursor: pointer; color: var(--accent-color); margin-bottom: 10px;">🔍 调试信息 (点击展开)</summary><pre style="background: rgba(120,120,128,0.1); padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap;">${JSON.stringify(errorDetails,null,2)}</pre>`;
    if (showRetryButton){ const retryBtn = document.createElement('button'); retryBtn.className='retry-btn'; retryBtn.textContent='手动重试'; retryBtn.addEventListener('click', ()=> App.generate.startGeneration()); errorDiv.appendChild(retryBtn); }
    App.dom.imageDisplay.innerHTML = ''; App.dom.imageDisplay.appendChild(errorDiv);
  }

  async function startGeneration({ mode, prompt } = {}){
    const apiUrl = '/api/generate';
    const modelName = App.dom.modelNameInput ? App.dom.modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview';
    const selectedRatio = App.state.selectedRatio; const ratioConfig = U().ASPECT_RATIOS[selectedRatio];
    const basePrompt = (prompt || '').trim(); if (!basePrompt){ U().showNotification('请输入提示词', 'error'); return; }

    // Immediately show loading UI to avoid perceived delay before async work (e.g., loading ratio canvas)
    setLoadingState();

    // images collection per mode
    let images = [];
    let useAspectRatioCanvas = false;
    if (mode === 'img2img'){
      images = App.state.uploadedFiles.map(f=> f.dataUrl);
      // include aspect ratio canvas if applicable
      if (ratioConfig && ratioConfig.baseImage && selectedRatio !== '1:1'){
        const ratioBase = await imageToDataUrl(ratioConfig.baseImage);
        if (ratioBase) { images.push(ratioBase); useAspectRatioCanvas = true; }
      }
    }
    else if (mode === 'editor'){
      images = [...App.state.editor.refImages];
      if (App.state.editor.baseImageDataUrl) images.push(App.state.editor.baseImageDataUrl);
      // also include aspect ratio canvas as last if applicable
      if (ratioConfig && ratioConfig.baseImage && selectedRatio !== '1:1'){
        const ratioBase = await imageToDataUrl(ratioConfig.baseImage); if (ratioBase) { images.push(ratioBase); useAspectRatioCanvas = true; }
      }
    } else { // txt2img
      // only use ratio canvas if not 1:1
      if (ratioConfig && ratioConfig.baseImage && selectedRatio !== '1:1'){
        const ratioBase = await imageToDataUrl(ratioConfig.baseImage); if (ratioBase) { images.push(ratioBase); useAspectRatioCanvas = true; }
      }
    }

    // de-duplicate images (by dataUrl) to reduce redundancy
    images = Array.from(new Set(images));
    const hasUserImages = images.length > 0;
    const enhancedPrompt = buildEnhancedPrompt({ basePrompt, selectedRatio, hasUserImages, useAspectRatioCanvas, annotations: App.state.editor.annotations, ratioConfig });

    const requestBody = { prompt: enhancedPrompt, model: modelName, images };

    let retryCount = 0; const maxRetries = 3;
    let aspectRetryDone = false;
    while (retryCount <= maxRetries){
      try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
        if (!response.ok){ let errorData; try { errorData = await response.json(); } catch { errorData = { error: `HTTP ${response.status}: ${response.statusText}` }; } throw errorData; }
        const result = await response.json();
        if (result.src){
          // Post-check aspect ratio; prioritize retry when model defaulted to 1:1 while a non-1:1 ratio was chosen
          const matches = await imageAspectMatches(result.src, selectedRatio, 0.03);
          const isNearSquare = await imageAspectMatches(result.src, '1:1', 0.02);
          const targetIsSquare = (selectedRatio === '1:1');
          if (!targetIsSquare && isNearSquare && !aspectRetryDone){
            aspectRetryDone = true;
            if (U() && U().showNotification) U().showNotification('检测到模型默认输出为 1:1，正在按所选比例重试一次…','info');
            requestBody.prompt = requestBody.prompt + '\n- 目标比例为 ' + selectedRatio + '，切勿输出 1:1。若比例不符请重新生成直至满足，必须完全填充画面且不留边框。';
            continue;
          }
          if (!matches && !aspectRetryDone && selectedRatio){
            aspectRetryDone = true;
            if (U() && U().showNotification) U().showNotification('检测到输出比例不符，正在按所选比例重试一次…','info');
            requestBody.prompt = requestBody.prompt + '\n- 如果输出宽高比与所选 ' + selectedRatio + ' 不一致，请重新生成直到满足。务必完全填充画面且不留边框。';
            continue;
          }
          clearLoadingState(); await displayImage({ src: result.src, prompt: basePrompt, model: modelName }); return;
        }
        if (result.error && result.error === 'API响应中未找到图片数据'){
          if (result.responseText || result.rawResponse?.choices?.[0]?.message?.content){
            const textContent = result.responseText || result.rawResponse.choices[0].message.content;
            if (textContent && textContent.length > 0 && !textContent.includes('data:image')){
              const textError = new Error(retryCount === 0 ? 'Model returned text instead of image' : 'Model returned text instead of image. Please refine your prompt.');
              textError.isTextResponseError = true; throw textError;
            }
          }
        }
        throw new Error(result.error || 'API 返回数据中未找到图片');
      } catch (error){
        if (retryCount < maxRetries && shouldRetry(error)){
          // backoff with jitter
          const schedule = [3000, 7000, 15000, 30000, 60000]; const base = schedule[Math.min(retryCount, schedule.length-1)]; const jitter = Math.floor(Math.random()*2000); const delay = base + jitter;
          await new Promise(r=> setTimeout(r, delay));
          retryCount++; continue;
        }
        handleGenerationError(error, retryCount);
        return;
      }
    }
    clearLoadingState();
  }

  App.generate = { startGeneration };
})();
