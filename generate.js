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
        try { console.debug(`[ratio-check] ${src.slice(0,30)}... expected ${ratioStr}=${expected.toFixed(4)}, actual ${img.naturalWidth}x${img.naturalHeight} (${actual.toFixed(4)}), dev ${(dev*100).toFixed(2)}%`); } catch(_) {}
        resolve(dev <= tolerance);
      };
      img.onerror = () => resolve(true);
      img.src = src;
    });
  }

  async function displayImage(imageData){
    const { imageDisplay, imageActions, imageDisplayContainer } = App.dom;
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
    // Debug: show model text reply and final prompt under the image
    try {
      if (imageData && (imageData.textResponse || imageData.finalPrompt)) {
        // remove previous meta blocks
        const container = imageDisplayContainer || document.getElementById('image-display-container') || imageDisplay.parentElement;
        Array.from(container.querySelectorAll('.gen-meta')).forEach(n => n.remove());
        const meta = document.createElement('div');
        meta.className = 'gen-meta';
        meta.style.marginTop = '12px';
        meta.style.padding = '10px';
        meta.style.borderRadius = '8px';
        meta.style.background = 'rgba(0,0,0,0.04)';
        if (imageData.textResponse) {
          const h = document.createElement('div');
          h.style.fontWeight = '600';
          h.style.marginBottom = '4px';
          h.textContent = '模型文本回复';
          const pre = document.createElement('pre');
          pre.style.whiteSpace = 'pre-wrap';
          pre.style.wordBreak = 'break-word';
          pre.style.margin = '0 0 8px 0';
          pre.textContent = imageData.textResponse;
          meta.appendChild(h);
          meta.appendChild(pre);
        }
        if (imageData.finalPrompt) {
          const h2 = document.createElement('div');
          h2.style.fontWeight = '600';
          h2.style.margin = '8px 0 4px 0';
          h2.textContent = '最终 Prompt';
          const pre2 = document.createElement('pre');
          pre2.style.whiteSpace = 'pre-wrap';
          pre2.style.wordBreak = 'break-word';
          pre2.style.margin = '0';
          pre2.textContent = imageData.finalPrompt;
          meta.appendChild(h2);
          meta.appendChild(pre2);
        }
        // append meta below the image area
        container.appendChild(meta);
      }
    } catch(_) {}
    App.state.currentGeneratedImage = { ...imageData, id: imageData.id || `gen_${Date.now()}`, timestamp: Date.now() };
    HF() && HF().addToHistory && HF().addToHistory(App.state.currentGeneratedImage);
    HF() && HF().updateResultFavoriteIcon && HF().updateResultFavoriteIcon();
  }

  function sanitizeModelText(str){
    if (!str || typeof str !== 'string') return '';
    try {
      // Remove embedded base64 image payloads to keep the UI readable
      return str.replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\n\r]+/g, '').trim();
    } catch (_) { return String(str); }
  }

  function buildEnhancedPrompt({ basePrompt, selectedRatio, hasUserImages, useAspectRatioCanvas, annotations, ratioConfig, includeNoOverlayClause }){
    let instructions = '';
    // 不再提及比例画布,因为API会自动处理比例
    if (selectedRatio && ratioConfig){
      instructions += `- 输出比例要求：${ratioConfig.description} (${selectedRatio})。\n`;
    }
    // 删除“参考图融合”提示（按照需求精简）
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
    // “严禁绘制叠加元素”仅在图编辑模式下使用
    if (includeNoOverlayClause){
      instructions += '\n- 严禁在最终图像中绘制框线、标注、说明文字或任何叠加元素。\n';
    }
    return `${instructions}\n用户的需求："${basePrompt}"`;
  }
  function fmt(n){ return (typeof n === 'number' ? n.toFixed(3) : n); }

  function shouldRetry(error){
    // 明确将“未找到图片/文本回复”视为可重试类型
    if (error && (error.isTextResponseError || error.isNoImageError)) return true;
    if (error instanceof TypeError && error.message && error.message.includes('fetch')) return true;
    if (error.error && typeof error.error === 'string'){
      const e = error.error;
      if (e.includes('HTTP 5') || e.includes('timeout') || e.includes('连接') || e.includes('服务器')) return true;
      if (e.includes('未找到图片数据') || e.toLowerCase().includes('no image')) return true;
    }
    const retryable = ['timeout','network','connection','temporary','rate limit','service unavailable','internal server error','no image','not found image'];
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
    if (showRetryButton){ const retryBtn = document.createElement('button'); retryBtn.className='retry-btn'; retryBtn.textContent='手动重试'; retryBtn.addEventListener('click', ()=> App.generate.retryLast && App.generate.retryLast()); errorDiv.appendChild(retryBtn); }
    App.dom.imageDisplay.innerHTML = ''; App.dom.imageDisplay.appendChild(errorDiv);
  }

  async function startGeneration({ mode, prompt } = {}){
    // If text fusion panel is active, treat the fusion canvas as the ratio+text base image
    try {
      if (App.dom.tabTextFusion && App.dom.tabTextFusion.classList.contains('active') && App.textFusion){
        const fusionBase = App.textFusion.exportDataUrl();
        if (fusionBase){
          // Prepend fusion canvas as strongest conditioning image
          if (!App.state.uploadedFiles) App.state.uploadedFiles = [];
          // ensure not duplicated
          const exists = App.state.uploadedFiles.some(f=> f && f.dataUrl === fusionBase);
          if (!exists){ App.state.uploadedFiles.unshift({ file: null, dataUrl: fusionBase }); }
          // If textFusion has refs, switch to img2img for this round
          const tfMode = App.textFusion.getMode();
          if (tfMode === 'img2img'){ mode = 'img2img'; }
        }
        // Merge fusion refs into images later via existing img2img pipeline
      }
    } catch(_){}
    const apiUrl = '/api/generate';
    const modelName = App.dom.modelNameInput ? App.dom.modelNameInput.value.trim() : 'vertexpic-gemini-2.5-flash-image-preview';
    const selectedRatio = App.state.selectedRatio; const ratioConfig = U().ASPECT_RATIOS[selectedRatio];
    const basePrompt = (prompt || '').trim(); if (!basePrompt){ U().showNotification('请输入提示词', 'error'); return; }
    // 记录最近一次请求，供"手动重试"使用
    try { App.generate._last = { mode: mode || 'txt2img', basePrompt }; } catch(_) {}

    // Immediately show loading UI to avoid perceived delay before async work
    setLoadingState();

    // images collection per mode (不再包含比例底图)
    let images = [];
    console.groupCollapsed('[Generate] start');
    console.log('mode:', mode || 'txt2img');
    console.log('model:', modelName);
    console.log('selectedRatio:', selectedRatio, ratioConfig);
    
    if (mode === 'img2img'){
      images = App.state.uploadedFiles.map(f=> f.dataUrl);
      console.debug('[Generate] img2img mode with', images.length, 'user images');
    }
    else if (mode === 'editor'){
      images = [...App.state.editor.refImages];
      if (App.state.editor.baseImageDataUrl) images.push(App.state.editor.baseImageDataUrl);
      console.debug('[Generate] editor mode with', images.length, 'images');
    }
    // txt2img mode: 不需要添加任何图片

    // de-duplicate images (by dataUrl) to reduce redundancy
    images = Array.from(new Set(images));
    const hasUserImages = images.length > 0;
    
    // 简化的prompt构建(不再提及比例画布)
    const enhancedPrompt = buildEnhancedPrompt({
      basePrompt,
      selectedRatio,
      hasUserImages,
      useAspectRatioCanvas: false, // 不再使用比例画布
      annotations: App.state.editor.annotations,
      ratioConfig,
      includeNoOverlayClause: (mode === 'editor')
    });

    // 将比例信息作为独立参数传递给后端API
    const requestBody = {
      prompt: enhancedPrompt,
      model: modelName,
      images,
      aspectRatio: selectedRatio // 新增:直接传递比例参数
    };
    // Log request summary without dumping large base64 payloads
    console.table([{ key: 'imagesCount', value: images.length }, { key: 'aspectRatio', value: selectedRatio }]);
    console.log('prompt.length:', requestBody.prompt.length);
    console.log('prompt.preview:', requestBody.prompt.slice(0, 400));

    let retryCount = 0; const maxRetries = 3;
    let aspectRetryDone = false;
    while (retryCount <= maxRetries){
      try {
        console.log(`[Generate] request attempt #${retryCount+1}`);
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
            console.warn('[Generate] detected near-square output; retrying once without changing prompt');
            continue;
          }
          if (!matches && !aspectRetryDone && selectedRatio){
            aspectRetryDone = true;
            if (U() && U().showNotification) U().showNotification('检测到输出比例不符，正在按所选比例重试一次…','info');
            console.warn('[Generate] detected ratio mismatch; retrying once without changing prompt');
            continue;
          }
          const modelTextRaw = (result.text || result.responseText || (result.rawResponse && result.rawResponse.choices && result.rawResponse.choices[0] && result.rawResponse.choices[0].message && result.rawResponse.choices[0].message.content) || '');
          const modelText = sanitizeModelText(modelTextRaw);
          clearLoadingState();
          await displayImage({ src: result.src, prompt: basePrompt, model: modelName, textResponse: modelText, finalPrompt: requestBody.prompt });
          console.groupCollapsed('[Generate] success');
          console.log('image src length:', String(result.src).length);
          console.log('model text length:', modelText.length);
          console.log('final prompt length:', requestBody.prompt.length);
          console.log('final prompt preview:', requestBody.prompt.slice(0, 400));
          console.groupEnd();
          console.groupEnd();
          return;
        }
        if (result.error && result.error === 'API响应中未找到图片数据'){
          if (result.responseText || result.rawResponse?.choices?.[0]?.message?.content){
            const textContent = result.responseText || result.rawResponse.choices[0].message.content;
            if (textContent && textContent.length > 0 && !textContent.includes('data:image')){
              const textError = new Error(retryCount === 0 ? 'Model returned text instead of image' : 'Model returned text instead of image. Please refine your prompt.');
              textError.isTextResponseError = true; throw textError;
            }
          }
          const noImageErr = new Error(result.error || 'API 返回数据中未找到图片');
          noImageErr.isNoImageError = true; throw noImageErr;
        }
        const generic = new Error(result.error || 'API 返回数据中未找到图片'); generic.isNoImageError = true; throw generic;
      } catch (error){
        console.error('[Generate] error on attempt', retryCount+1, error);
        if (retryCount < maxRetries && shouldRetry(error)){
          // backoff with jitter
          const schedule = [3000, 7000, 15000, 30000, 60000]; const base = schedule[Math.min(retryCount, schedule.length-1)]; const jitter = Math.floor(Math.random()*2000); const delay = base + jitter;
          await new Promise(r=> setTimeout(r, delay));
          retryCount++; continue;
        }
        handleGenerationError(error, retryCount);
        console.groupEnd();
        return;
      }
    }
    clearLoadingState();
    console.groupEnd();
  }

  function retryLast(){
    const last = (App.generate && App.generate._last) || {};
    let mode = last.mode;
    let basePrompt = last.basePrompt;
    if (!basePrompt){
      // 回退到当前激活面板的输入框
      const { tabTextToImage, tabImageToImage, tabImageEditor, promptInputText, promptInputImage, promptInputEditor } = App.dom;
      const activeMode = (tabImageEditor && tabImageEditor.classList.contains('active')) ? 'editor' : ((tabImageToImage && tabImageToImage.classList.contains('active')) ? 'img2img' : 'txt2img');
      mode = mode || activeMode;
      basePrompt = (activeMode === 'txt2img') ? (promptInputText?.value || '') : (activeMode === 'img2img') ? (promptInputImage?.value || '') : (promptInputEditor?.value || '');
    }
    if (!basePrompt || !basePrompt.trim()){ U() && U().showNotification && U().showNotification('请输入提示词', 'error'); return; }
    startGeneration({ mode: mode || 'txt2img', prompt: basePrompt });
  }

  App.generate = { startGeneration, retryLast, _last: null };
})();
