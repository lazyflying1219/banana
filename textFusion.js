// textFusion.js - ratio + text compositing for better Chinese text workflows
console.log('[Fusion] file loaded at', new Date().toISOString());

(function(){
  window.App = window.App || {}; 
  const App = window.App; 
  const U = () => App.utils;
  
  console.log('[Fusion] script executing');

  const state = {
    ctx: null, canvas: null, dpr: 1,
    ratio: '16:9', baseImageUrl: null,
    textItems: [], // {id, x, y, text, font, size, color, bold}
    activeId: null,
    dragging: false, dragStart: {x:0,y:0},
    mode: 'txt2img', // or 'img2img' when ref present
    refs: [],
    editingText: false
  };

  function init(){
    console.log('[Fusion] init() called');
    const canvas = document.getElementById('fusion-canvas'); 
    if (!canvas) {
      console.error('[Fusion] canvas not found!');
      return;
    }
    console.log('[Fusion] canvas found');
    
    state.canvas = canvas; 
    state.ctx = canvas.getContext('2d'); 
    state.dpr = window.devicePixelRatio||1;
    
    // Watch for ratio changes
    const ratioObserver = setInterval(()=>{
      const newRatio = App.state?.selectedRatio || '16:9';
      if (newRatio !== state.ratio){
        state.ratio = newRatio;
        updateCanvasRatio();
      }
    }, 500);
    
    updateCanvasRatio();
    bindUI(); 
    bindCanvas();
    
    // Initial text prompt helper
    const promptInput = document.getElementById('prompt-input-fusion');
    if (promptInput && !promptInput.value){
      promptInput.placeholder = '示例：在文字背景上创建一幅艺术作品，保持文字清晰可见...';
    }
    
    console.log('[Fusion] init() complete');
  }

  function updateCanvasRatio(){
    const cfg = U().ASPECT_RATIOS[state.ratio];
    let w = 1024, h = 576; // default 16:9
    
    // Landscape ratios
    if (state.ratio === '21:9') { w = 1024; h = 439; }
    else if (state.ratio === '16:9') { w = 1024; h = 576; }
    else if (state.ratio === '4:3') { w = 1024; h = 768; }
    else if (state.ratio === '3:2') { w = 1024; h = 683; }
    
    // Square ratio
    else if (state.ratio === '1:1') { w = h = 768; }
    
    // Portrait ratios
    else if (state.ratio === '9:16') { w = 576; h = 1024; }
    else if (state.ratio === '3:4') { w = 768; h = 1024; }
    else if (state.ratio === '2:3') { w = 683; h = 1024; }
    
    // Flexible ratios
    else if (state.ratio === '5:4') { w = 1024; h = 819; }
    else if (state.ratio === '4:5') { w = 819; h = 1024; }
    
    state.canvas.width = w;
    state.canvas.height = h;
    state.canvas.style.maxWidth = '100%';
    state.canvas.style.height = 'auto';
    
    console.log('[Fusion] canvas ratio:', state.ratio, 'size:', w + 'x' + h);
    
    // baseImage is now always null with new API
    draw();
  }

  async function preloadBase(url){ 
    console.log('[Fusion] preloading base image:', url);
    try { 
      const img = await urlToImage(url); 
      state.baseImageUrl = url; 
      draw(img); 
      console.log('[Fusion] base image loaded');
    } catch(e){ 
      console.warn('[Fusion] base image failed:', e);
      draw(); 
    } 
  }
  
  function urlToImage(url){ 
    return new Promise((res,rej)=>{ 
      const img=new Image(); 
      img.onload=()=>res(img); 
      img.onerror=rej; 
      img.src=url; 
    }); 
  }

  function bindUI(){
    console.log('[Fusion] binding UI');
    
    const addBtn = document.getElementById('fusion-add-text');
    const delBtn = document.getElementById('fusion-remove-text');
    const refTrigger = document.getElementById('fusion-ref-trigger');
    
    if (!addBtn) {
      console.error('[Fusion] Add button not found!');
    } else {
      console.log('[Fusion] Add button found, binding click');
      addBtn.addEventListener('click', function(){
        console.log('[Fusion] Add text clicked');
        showTextInput();
      });
    }
    
    if (delBtn) {
      delBtn.addEventListener('click', function(){
        console.log('[Fusion] Delete clicked');
        if (!state.activeId) return; 
        state.textItems = state.textItems.filter(t=> t.id!==state.activeId); 
        state.activeId=null; 
        draw(); 
      });
    }

    if (refTrigger) {
      refTrigger.addEventListener('change', function(e){
        console.log('[Fusion] Ref images selected');
        const files = e.target.files; 
        if (!files || !files.length) return; 
        state.refs = [];
        Array.from(files).slice(0,3).forEach(f=>{ 
          const r = new FileReader(); 
          r.onload=()=>{ 
            state.refs.push(r.result); 
            renderRefThumbs(); 
            state.mode = 'img2img';
            updatePromptHelper();
          }; 
          r.readAsDataURL(f); 
        }); 
      });
    }
  }
  
  function showTextInput(editItem){
    console.log('[Fusion] showTextInput called, edit mode:', !!editItem);
    
    // Create overlay input
    let overlay = document.getElementById('fusion-text-input');
    if (!overlay){
      console.log('[Fusion] Creating text input overlay');
      overlay = document.createElement('div');
      overlay.id = 'fusion-text-input';
      overlay.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:#fff;padding:20px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.2);min-width:300px;';
      overlay.innerHTML = '<h4 style="margin:0 0 12px 0;color:#333;">添加文字</h4>' +
        '<input id="fusion-text-value" type="text" placeholder="输入文字内容" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-bottom:12px;box-sizing:border-box;">' +
        '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
        '<button id="fusion-text-cancel" style="padding:6px 16px;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer;">取消</button>' +
        '<button id="fusion-text-ok" style="padding:6px 16px;border:none;background:#007aff;color:#fff;border-radius:6px;cursor:pointer;">确定</button>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'block';
    const input = document.getElementById('fusion-text-value');
    const okBtn = document.getElementById('fusion-text-ok');
    const cancelBtn = document.getElementById('fusion-text-cancel');
    
    input.value = editItem ? editItem.text : '';
    input.focus();
    input.select();
    
    const cleanup = function(){
      console.log('[Fusion] Closing text input');
      overlay.style.display = 'none';
      state.editingText = false;
    };
    
    okBtn.onclick = function(){
      const text = input.value.trim();
      console.log('[Fusion] OK clicked, text:', text);
      if (!text) { cleanup(); return; }
      
      if (editItem){
        editItem.text = text;
      } else {
        const fontSel = document.getElementById('fusion-font');
        const sizeInp = document.getElementById('fusion-font-size');
        const colorInp = document.getElementById('fusion-color');
        const boldChk = document.getElementById('fusion-bold');
        
        const id = 't'+Date.now();
        const newItem = { 
          id: id, 
          x: 100, 
          y: 150, 
          text: text, 
          font: fontSel?.value || 'Arial, sans-serif', 
          size: parseInt(sizeInp?.value||'64',10), 
          color: colorInp?.value||'#000', 
          bold: !!boldChk?.checked 
        };
        console.log('[Fusion] Adding text item:', newItem);
        state.textItems.push(newItem);
        state.activeId = id;
      }
      
      draw();
      cleanup();
    };
    
    cancelBtn.onclick = cleanup;
    input.onkeydown = function(e){
      if (e.key === 'Enter') okBtn.click();
      if (e.key === 'Escape') cancelBtn.click();
    };
    
    state.editingText = true;
  }
  
  function updatePromptHelper(){
    const promptInput = document.getElementById('prompt-input-fusion');
    if (!promptInput) return;
    
    if (state.mode === 'img2img' && state.refs.length > 0){
      promptInput.placeholder = '示例：按照下面的提示词，在有文字的图上作画，并融合参考图。注意调整文字区域使其与背景协调...';
    } else {
      promptInput.placeholder = '示例：按照下面的提示词，在有文字的图上作画，注意调整文字区域使其与背景协调...';
    }
  }

  function renderRefThumbs(){ 
    const wrap = document.getElementById('fusion-ref-thumbs'); 
    if (!wrap) return; 
    wrap.innerHTML=''; 
    state.refs.forEach((src, i)=>{ 
      const container = document.createElement('div');
      container.style.cssText = 'position:relative;display:inline-block;margin-right:8px;';
      
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'width:80px;height:auto;border-radius:4px;';
      img.onerror = function(){ this.style.display='none'; };
      
      const delBtn = document.createElement('button');
      delBtn.textContent = '×';
      delBtn.style.cssText = 'position:absolute;top:2px;right:2px;background:rgba(220,53,69,0.9);color:white;border:none;border-radius:50%;width:20px;height:20px;font-size:14px;cursor:pointer;';
      delBtn.onclick = function(){
        state.refs.splice(i, 1);
        renderRefThumbs();
        if (state.refs.length === 0) {
          state.mode = 'txt2img';
          updatePromptHelper();
        }
      };
      
      container.appendChild(img);
      container.appendChild(delBtn);
      wrap.appendChild(container);
    });
  }
  
  function bindCanvas(){
    console.log('[Fusion] binding canvas events');
    if (!state.canvas) return;
    
    let dragging = false;
    let dragId = null;
    
    state.canvas.addEventListener('pointerdown', function(e){
      const rect = state.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (state.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (state.canvas.height / rect.height);
      
      // Check if clicking on existing text
      for (const item of state.textItems){
        const ctx = state.ctx;
        ctx.font = (item.bold ? 'bold ' : '') + item.size + 'px ' + item.font;
        const metrics = ctx.measureText(item.text);
        const w = metrics.width;
        const h = item.size;
        
        if (x >= item.x && x <= item.x + w && y >= item.y - h && y <= item.y){
          dragging = true;
          dragId = item.id;
          state.activeId = item.id;
          state.dragStart = {x: x - item.x, y: y - item.y};
          draw();
          return;
        }
      }
    });
    
    state.canvas.addEventListener('pointermove', function(e){
      if (!dragging || !dragId) return;
      
      const rect = state.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (state.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (state.canvas.height / rect.height);
      
      const item = state.textItems.find(t => t.id === dragId);
      if (item){
        item.x = x - state.dragStart.x;
        item.y = y - state.dragStart.y;
        draw();
      }
    });
    
    state.canvas.addEventListener('pointerup', function(){
      dragging = false;
      dragId = null;
    });
    
    state.canvas.addEventListener('dblclick', function(e){
      const rect = state.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (state.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (state.canvas.height / rect.height);
      
      // Check if double-clicking on existing text
      for (const item of state.textItems){
        const ctx = state.ctx;
        ctx.font = (item.bold ? 'bold ' : '') + item.size + 'px ' + item.font;
        const metrics = ctx.measureText(item.text);
        const w = metrics.width;
        const h = item.size;
        
        if (x >= item.x && x <= item.x + w && y >= item.y - h && y <= item.y){
          showTextInput(item);
          return;
        }
      }
    });
  }
  
  function draw(baseImage){
    console.log('[Fusion] drawing canvas');
    if (!state.ctx || !state.canvas) return;
    
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    
    // Draw base image if provided
    if (baseImage){
      state.ctx.drawImage(baseImage, 0, 0, state.canvas.width, state.canvas.height);
    } else {
      // Fill with white background
      state.ctx.fillStyle = '#ffffff';
      state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    }
    
    // Draw all text items
    state.textItems.forEach(item => {
      state.ctx.save();
      state.ctx.font = (item.bold ? 'bold ' : '') + item.size + 'px ' + item.font;
      state.ctx.fillStyle = item.color;
      state.ctx.fillText(item.text, item.x, item.y);
      
      // Draw selection if this is the active item
      if (item.id === state.activeId){
        const metrics = state.ctx.measureText(item.text);
        const w = metrics.width;
        const h = item.size;
        state.ctx.strokeStyle = '#007aff';
        state.ctx.lineWidth = 2;
        state.ctx.setLineDash([4, 4]);
        state.ctx.strokeRect(item.x - 2, item.y - h - 2, w + 4, h + 4);
      }
      
      state.ctx.restore();
    });
  }
  
  function exportDataUrl(){
    console.log('[Fusion] exporting canvas as data URL');
    if (!state.canvas) return null;
    return state.canvas.toDataURL('image/png');
  }
  
  function getMode(){
    return state.mode;
  }
  
  // Export module
  App.textFusion = {
    init: init,
    exportDataUrl: exportDataUrl,
    getMode: getMode
  };
  
  console.log('[Fusion] module ready');
})();
