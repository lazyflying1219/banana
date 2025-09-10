// editor.js - Simple image editor with rectangle annotations and ref images
(function(){
  window.App = window.App || {}; const App = window.App; const U = () => App.utils;

  let canvas, ctx, drawing = false, startX=0, startY=0, currentShape=null; let currentTool='rect';
  let baseBitmap = null; let rafId = null; let needsDraw = false;
  let displayWidth = 0, displayHeight = 0; // CSS pixel size
  // selection and transform state
  let selectedShapeIndex = -1; let isDraggingShape = false; let dragStart = {x:0,y:0}; let activeHandle = null; // 'nw','ne','sw','se','start','end'
  // history stacks
  const undoStack = []; const redoStack = [];

  function init(){
    canvas = document.getElementById('editor-canvas');
    if (!canvas) return; ctx = canvas.getContext('2d');

    const baseInput = document.getElementById('editor-base-image-input');
    const refInput = document.getElementById('editor-ref-image-input');
    const colorInput = document.getElementById('editor-color-input');
    const labelInput = document.getElementById('editor-label-input');
    const clearBtn = document.getElementById('editor-clear-annotations-btn');
    const exportBtn = document.getElementById('editor-export-to-ref-btn');
    const refThumbs = document.getElementById('editor-upload-thumbs');
    const toolRect = document.getElementById('editor-tool-rect');
    const toolCircle = document.getElementById('editor-tool-circle');
    const toolArrow = document.getElementById('editor-tool-arrow');
    const toolText = document.getElementById('editor-tool-text');

    baseInput && baseInput.addEventListener('change', (e)=> { loadBaseImage(e.target.files[0]); baseInput.value=''; });
    refInput && refInput.addEventListener('change', (e)=> addRefImages(e.target.files));
    clearBtn && clearBtn.addEventListener('click', ()=>{ App.state.editor.annotations = []; redraw(); });
    exportBtn && exportBtn.addEventListener('click', ()=>{
      if (!App.state.editor.baseImageDataUrl){ U().showNotification('请先上传并编辑一张图片','error'); return; }
      // 只加入干净的底图（不包含标注叠加），避免把红框带入生成
      const dataUrl = App.state.editor.baseImageDataUrl;
      if (App.state.editor.refImages.length >= 9) { U().showNotification('参考图最多 9 张','error'); return; }
      App.state.editor.refImages.push(dataUrl);
      renderEditorRefThumbs();
      U().showNotification('已将底图加入参考图（不含标注）','success');
    });

    const replaceBtn = document.getElementById('editor-replace-image-btn');
    replaceBtn && replaceBtn.addEventListener('click', ()=>{
      App.state.editor.baseImageDataUrl = null; baseBitmap = null; App.state.editor.annotations = [];
      clearHistory();
      scheduleDraw(true);
      baseInput && baseInput.click();
    });

    // undo/redo/delete
    const undoBtn = document.getElementById('editor-undo-btn');
    const redoBtn = document.getElementById('editor-redo-btn');
    const deleteBtn = document.getElementById('editor-delete-selected-btn');
    undoBtn && undoBtn.addEventListener('click', undo);
    redoBtn && redoBtn.addEventListener('click', redo);
    deleteBtn && deleteBtn.addEventListener('click', deleteSelected);

    // removed snap and import/export features

    // canvas drawing handlers (pointer events + accurate coordinates)
    canvas.addEventListener('pointerdown', (e)=>{
      if (!App.state.editor.baseImageDataUrl) return;
      const pos = getPointerPos(e); startX = pos.x; startY = pos.y;
      // check handles first (if a shape is selected)
      const h = handleHitTest(startX, startY, selectedShapeIndex);
      if (h){ activeHandle = h; isDraggingShape = true; dragStart = {x:startX,y:startY}; canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); return; }
      // hit-test for moving existing shapes
      const hitIdx = hitTest(startX, startY);
      if (hitIdx !== -1){
        // Option/Alt 拖动复制
        if (e.altKey){ const clone = JSON.parse(JSON.stringify(App.state.editor.annotations[hitIdx])); if (clone.type==='arrow'){ clone.x1+=12; clone.y1+=12; clone.x2+=12; clone.y2+=12; } else { clone.x+=12; clone.y+=12; } App.state.editor.annotations.push(clone); pushHistory(); selectedShapeIndex = App.state.editor.annotations.length-1; }
        else selectedShapeIndex = hitIdx;
        isDraggingShape = true; dragStart = { x:startX, y:startY }; canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); scheduleDraw(); return; }
      drawing = true;
      const common = { color: colorInput.value || '#ff0000', label: (labelInput.value||'').slice(0,64) };
      if (currentTool==='rect') currentShape = { type:'rect', x:startX, y:startY, w:0, h:0, ...common };
      else if (currentTool==='circle') currentShape = { type:'circle', x:startX, y:startY, w:0, h:0, ...common };
      else if (currentTool==='arrow') currentShape = { type:'arrow', x1:startX, y1:startY, x2:startX, y2:startY, ...common };
      else if (currentTool==='text') { currentShape = { type:'text', x:startX, y:startY, text: common.label || '文字', color: common.color }; drawing = false; addShape(currentShape); currentShape=null; }
    });
    canvas.addEventListener('pointermove', (e)=>{
      const {x,y} = getPointerPos(e);
      if (isDraggingShape && selectedShapeIndex !== -1){
        const s = App.state.editor.annotations[selectedShapeIndex];
        const dx = x - dragStart.x; const dy = y - dragStart.y; dragStart = { x, y };
        if (activeHandle){
          if (s.type==='rect' || s.type==='circle'){
            if (activeHandle==='nw'){ s.x += dx; s.y += dy; s.w -= dx; s.h -= dy; }
            if (activeHandle==='ne'){ s.y += dy; s.w += dx; s.h -= dy; }
            if (activeHandle==='sw'){ s.x += dx; s.w -= dx; s.h += dy; }
            if (activeHandle==='se'){ s.w += dx; s.h += dy; }
            if (e.shiftKey){ const size = Math.max(Math.abs(s.w), Math.abs(s.h)); s.w = Math.sign(s.w)*size; s.h = Math.sign(s.h)*size; }
          } else if (s.type==='arrow'){
            if (activeHandle==='start'){ s.x1 += dx; s.y1 += dy; } else if (activeHandle==='end'){ s.x2 += dx; s.y2 += dy; }
            if (e.shiftKey){ const base = activeHandle==='start'? {x:s.x2,y:s.y2}:{x:s.x1,y:s.y1}; const ang = Math.atan2((activeHandle==='start'? s.y1-base.y : s.y2-base.y),(activeHandle==='start'? s.x1-base.x : s.x2-base.x)); const len = Math.hypot((activeHandle==='start'? s.x1-base.x : s.x2-base.x),(activeHandle==='start'? s.y1-base.y : s.y2-base.y)); const step = Math.PI/4; const qa = Math.round(ang/step)*step; const nx = base.x + Math.cos(qa)*len; const ny = base.y + Math.sin(qa)*len; if (activeHandle==='start'){ s.x1 = nx; s.y1 = ny; } else { s.x2 = nx; s.y2 = ny; } }
          }
        } else {
          if (s.type==='rect' || s.type==='circle'){ s.x += dx; s.y += dy; }
          else if (s.type==='arrow'){ s.x1 += dx; s.y1 += dy; s.x2 += dx; s.y2 += dy; }
          else if (s.type==='text'){ s.x += dx; s.y += dy; }
        }
        scheduleDraw(); return;
      }
      if (!drawing || !currentShape) { // hover state
        const overHandle = handleHitTest(x,y, selectedShapeIndex);
        if (overHandle){ canvas.style.cursor = 'nwse-resize'; }
        else canvas.style.cursor = (hitTest(x,y) !== -1) ? 'move' : 'crosshair';
        return;
      }
      if (currentTool==='rect' || currentTool==='circle'){ currentShape.w = x - startX; currentShape.h = y - startY; if (e.shiftKey){ const size = Math.max(Math.abs(currentShape.w), Math.abs(currentShape.h)); currentShape.w = Math.sign(currentShape.w)*size; currentShape.h = Math.sign(currentShape.h)*size; } } else if (currentTool==='arrow'){ currentShape.x2 = x; currentShape.y2 = y; if (e.shiftKey){ const ang = Math.atan2(currentShape.y2-startY, currentShape.x2-startX); const len = Math.hypot(currentShape.x2-startX, currentShape.y2-startY); const step = Math.PI/4; const qa = Math.round(ang/step)*step; currentShape.x2 = startX + Math.cos(qa)*len; currentShape.y2 = startY + Math.sin(qa)*len; } } scheduleDraw();
    });
    canvas.addEventListener('pointerup', (e)=>{
      if (isDraggingShape && selectedShapeIndex !== -1){
        const s = App.state.editor.annotations[selectedShapeIndex]; annotateNorm(s); isDraggingShape=false; activeHandle=null; pushHistory(); scheduleDraw(true); return;
      }
      if (!drawing) return; drawing=false; if (currentShape){ finalizeCurrentShape(); addShape(currentShape); currentShape=null; scheduleDraw(true); }
    });
    canvas.addEventListener('pointerleave', ()=>{ if (drawing){ drawing=false; if (currentShape){ finalizeCurrentShape(); addShape(currentShape); currentShape=null; scheduleDraw(true); } } isDraggingShape=false; activeHandle=null; });

    function setTool(tool){ currentTool = tool; [toolRect,toolCircle,toolArrow,toolText].forEach(b=> b && b.classList.remove('active')); const m = {rect:toolRect,circle:toolCircle,arrow:toolArrow,text:toolText}[tool]; m && m.classList.add('active'); }
    toolRect && toolRect.addEventListener('click', ()=> setTool('rect'));
    toolCircle && toolCircle.addEventListener('click', ()=> setTool('circle'));
    toolArrow && toolArrow.addEventListener('click', ()=> setTool('arrow'));
    toolText && toolText.addEventListener('click', ()=> setTool('text'));

    // responsive: redraw on resize
    window.addEventListener('resize', ()=>{ if (App.state.editor.baseImageDataUrl) fitCanvasToContainer(); scheduleDraw(true); });
    scheduleDraw(true);
  }

  async function loadBaseImage(file){ if (!file) return; if (!file.type.startsWith('image/')) { U().showNotification('请选择图片文件','error'); return; } const reader = new FileReader(); reader.onload = async (e)=>{ const img = new Image(); img.decoding='async'; img.onload = async ()=>{ try { baseBitmap = await createImageBitmap(img); } catch { baseBitmap = null; } App.state.editor.baseImageDataUrl = e.target.result; App.state.editor.annotations = []; fitCanvasToContainer(img.width, img.height); scheduleDraw(true); }; img.src = e.target.result; }; reader.readAsDataURL(file); }

  function addRefImages(files){ const max = 9; const arr = [...files]; for(const file of arr){ if (!file.type.startsWith('image/')) { U().showNotification(`非图片: ${file.name}`,'error'); continue; } const reader = new FileReader(); reader.onload=(e)=>{ if (App.state.editor.refImages.length>=max){ U().showNotification(`参考图最多 ${max} 张`,'error'); return; } App.state.editor.refImages.push(e.target.result); renderEditorRefThumbs(); }; reader.readAsDataURL(file);} }

  function renderEditorRefThumbs(){ const container = document.getElementById('editor-upload-thumbs'); if (!container) return; container.innerHTML=''; App.state.editor.refImages.forEach((src,idx)=>{ const wrap = document.createElement('div'); wrap.className='upload-thumb-item'; const img=document.createElement('img'); img.decoding='async'; img.src=src; img.alt='ref'; const removeBtn=document.createElement('button'); removeBtn.className='remove-thumb'; removeBtn.textContent='×'; removeBtn.addEventListener('click',()=>{ App.state.editor.refImages.splice(idx,1); renderEditorRefThumbs(); }); wrap.appendChild(img); wrap.appendChild(removeBtn); container.appendChild(wrap); }); }

  function normalizeRect(r){ if (r.w<0){ r.x+=r.w; r.w*=-1; } if (r.h<0){ r.y+=r.h; r.h*=-1; } r.x = Math.max(0, Math.min(r.x, canvas.width)); r.y = Math.max(0, Math.min(r.y, canvas.height)); r.w = Math.max(1, Math.min(r.w, canvas.width - r.x)); r.h = Math.max(1, Math.min(r.h, canvas.height - r.y)); }
  function normalizeCircle(c){ // stored as bounding box x,y,w,h
    normalizeRect(c);
    const cx = c.x + c.w/2, cy = c.y + c.h/2; const rx = Math.abs(c.w/2), ry = Math.abs(c.h/2); c.cx=cx; c.cy=cy; c.rx=rx; c.ry=ry;
  }
  function normalizeArrow(a){ a.x1 = Math.max(0, Math.min(a.x1, canvas.width)); a.y1 = Math.max(0, Math.min(a.y1, canvas.height)); a.x2 = Math.max(0, Math.min(a.x2, canvas.width)); a.y2 = Math.max(0, Math.min(a.y2, canvas.height)); }
  function annotateNorm(shape){ const { width, height } = App.state.editor.canvasSize || { width: canvas.width, height: canvas.height }; if (shape.type==='rect'){ shape.norm = { x: shape.x/width, y: shape.y/height, w: shape.w/width, h: shape.h/height }; } else if (shape.type==='circle'){ shape.norm = { cx: shape.cx/width, cy: shape.cy/height, rx: shape.rx/width, ry: shape.ry/height }; } else if (shape.type==='arrow'){ shape.norm = { x1: shape.x1/width, y1: shape.y1/height, x2: shape.x2/width, y2: shape.y2/height }; } else if (shape.type==='text'){ shape.norm = { x: shape.x/width, y: shape.y/height }; } }
  function drawRect(r){ ctx.save(); ctx.strokeStyle = r.color || '#ff0000'; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h); if (r.label){ ctx.fillStyle = r.color || '#ff0000'; ctx.font='12px sans-serif'; const text = r.label; const pad=4; const metrics = ctx.measureText(text); const tw = metrics.width + pad*2; const th = 16 + pad*2; ctx.globalAlpha=0.8; ctx.fillRect(r.x, Math.max(0, r.y - th), tw, th); ctx.globalAlpha=1; ctx.fillStyle='#fff'; ctx.fillText(text, r.x + pad, Math.max(12, r.y - th + 12)); } ctx.restore(); }
  function drawCircle(c){ ctx.save(); ctx.strokeStyle = c.color || '#ff0000'; ctx.lineWidth = 2; const cx = c.x + c.w/2, cy = c.y + c.h/2; const rx = Math.abs(c.w/2), ry = Math.abs(c.h/2); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.stroke(); if (c.label){ ctx.fillStyle = c.color || '#ff0000'; ctx.font='12px sans-serif'; ctx.fillText(c.label, cx + 6, cy - 6); } ctx.restore(); }
  function drawArrow(a){ ctx.save(); ctx.strokeStyle = a.color || '#ff0000'; ctx.lineWidth = 2; const headlen = 10; const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1); ctx.beginPath(); ctx.moveTo(a.x1, a.y1); ctx.lineTo(a.x2, a.y2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(a.x2, a.y2); ctx.lineTo(a.x2 - headlen * Math.cos(angle - Math.PI/6), a.y2 - headlen * Math.sin(angle - Math.PI/6)); ctx.lineTo(a.x2 - headlen * Math.cos(angle + Math.PI/6), a.y2 - headlen * Math.sin(angle + Math.PI/6)); ctx.closePath(); ctx.fillStyle = a.color || '#ff0000'; ctx.fill(); if (a.label){ ctx.fillStyle = a.color || '#ff0000'; ctx.font='12px sans-serif'; ctx.fillText(a.label, a.x1 + 4, a.y1 - 4); } ctx.restore(); }
  function drawText(t){ ctx.save(); ctx.fillStyle = t.color || '#ff0000'; ctx.font = '14px sans-serif'; ctx.fillText(t.text || t.label || '文字', t.x, t.y); ctx.restore(); }

  function drawCurrentShape(){ if (!currentShape) return; if (currentShape.type==='rect') drawRect(currentShape); else if (currentShape.type==='circle') drawCircle(currentShape); else if (currentShape.type==='arrow') drawArrow(currentShape); }
  function addShape(s){ if (s.type==='rect'){ normalizeRect(s); annotateNorm(s); } else if (s.type==='circle'){ normalizeCircle(s); annotateNorm(s);} else if (s.type==='arrow'){ normalizeArrow(s); annotateNorm(s);} else if (s.type==='text'){ annotateNorm(s);} App.state.editor.annotations.push(s); pushHistory(); selectedShapeIndex = App.state.editor.annotations.length - 1; }
  function finalizeCurrentShape(){ if (!currentShape) return; if (currentShape.type==='rect'){ normalizeRect(currentShape);} else if (currentShape.type==='circle'){ normalizeCircle(currentShape);} else if (currentShape.type==='arrow'){ normalizeArrow(currentShape);} }

  function redraw(){
    // high-DPI transform
    const dpr = window.devicePixelRatio || 1; ctx.setTransform(dpr,0,0,dpr,0,0);
    const replaceBtn = document.getElementById('editor-replace-image-btn');
    replaceBtn && replaceBtn.addEventListener('click', ()=>{
      // clear current base and prompt upload
      App.state.editor.baseImageDataUrl = null; baseBitmap = null; App.state.editor.annotations = [];
      scheduleDraw(true);
      baseInput && baseInput.click();
    });
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (App.state.editor.baseImageDataUrl){
      if (baseBitmap){ ctx.drawImage(baseBitmap, 0, 0, displayWidth, displayHeight); }
      else { const baseImg = new Image(); baseImg.onload = ()=>{ ctx.drawImage(baseImg,0,0,displayWidth,displayHeight); }; baseImg.src = App.state.editor.baseImageDataUrl; }
      // draw annotations
      App.state.editor.annotations.forEach((s, idx)=>{ if (s.type==='rect') drawRect(s); else if (s.type==='circle') drawCircle(s); else if (s.type==='arrow') drawArrow(s); else if (s.type==='text') drawText(s); if (idx===selectedShapeIndex) drawSelection(s); });
      if (currentShape) drawCurrentShape();
    } else {
      // placeholder grid
      ctx.save(); ctx.fillStyle='rgba(120,120,128,0.12)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.strokeStyle='rgba(120,120,128,0.3)'; for(let x=0;x<canvas.width;x+=20){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); } for(let y=0;y<canvas.height;y+=20){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); } ctx.restore();
    }
  }

  function scheduleDraw(immediate=false){ if (immediate){ cancelAnimationFrame(rafId); rafId = requestAnimationFrame(redraw); return; } if (needsDraw) return; needsDraw = true; rafId = requestAnimationFrame(()=>{ needsDraw=false; redraw(); }); }

  function getPointerPos(e){ const rect = canvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; return { x, y }; }

  function fitCanvasToContainer(imgW, imgH){
    const wrap = document.querySelector('.canvas-wrap');
    const containerW = Math.max(320, wrap.clientWidth);
    // choose aspect ratio based on provided image or current canvas CSS size
    const natW = imgW || displayWidth || 800; const natH = imgH || displayHeight || 560; const ar = natW / natH;
    displayWidth = Math.min(containerW, 720); displayHeight = Math.round(displayWidth / ar);
    const dpr = window.devicePixelRatio || 1; canvas.style.width = displayWidth + 'px'; canvas.style.height = displayHeight + 'px'; canvas.width = Math.floor(displayWidth * dpr); canvas.height = Math.floor(displayHeight * dpr); App.state.editor.canvasSize = { width: displayWidth, height: displayHeight };
  }

  // selection helpers
  function hitTest(x, y){
    const list = App.state.editor.annotations; for (let i=list.length-1;i>=0;i--){ const s=list[i]; if (s.type==='rect' || s.type==='circle'){ const bx = s.x, by=s.y, bw = (s.type==='rect'? s.w : s.w), bh=(s.type==='rect'? s.h : s.h); if (x>=bx && x<=bx+Math.abs(bw) && y>=by && y<=by+Math.abs(bh)) return i; } else if (s.type==='text'){ const w=80, h=20; if (x>=s.x && x<=s.x+w && y>=s.y-16 && y<=s.y+4) return i; } else if (s.type==='arrow'){ if (distanceToSegment({x,y}, {x:s.x1,y:s.y1},{x:s.x2,y:s.y2}) < 8) return i; } }
    return -1;
  }
  function handleHitTest(x,y, selIdx){ if (selIdx===-1) return null; const s = App.state.editor.annotations[selIdx]; const size=8; if (!s) return null; if (s.type==='rect' || s.type==='circle'){ const corners=[{id:'nw',x:s.x,y:s.y},{id:'ne',x:s.x+s.w,y:s.y},{id:'sw',x:s.x,y:s.y+s.h},{id:'se',x:s.x+s.w,y:s.y+s.h}]; for (const c of corners){ if (Math.abs(x-c.x)<size && Math.abs(y-c.y)<size) return c.id; } return null; } if (s.type==='arrow'){ if (Math.hypot(x-s.x1,y-s.y1)<10) return 'start'; if (Math.hypot(x-s.x2,y-s.y2)<10) return 'end'; return null; } return null; }
  function drawSelection(s){ ctx.save(); ctx.setLineDash([6,4]); ctx.strokeStyle = '#0a84ff'; ctx.lineWidth = 1.5; if (s.type==='rect' || s.type==='circle'){ ctx.strokeRect(s.x, s.y, s.w, s.h); const handles=[[s.x,s.y],[s.x+s.w,s.y],[s.x,s.y+s.h],[s.x+s.w,s.y+s.h]]; ctx.setLineDash([]); handles.forEach(([hx,hy])=>{ ctx.fillStyle = '#fff'; ctx.strokeStyle = '#0a84ff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.rect(hx-4, hy-4, 8, 8); ctx.fill(); ctx.stroke(); }); } else if (s.type==='arrow'){ ctx.beginPath(); ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2); ctx.stroke(); const points=[[s.x1,s.y1],[s.x2,s.y2]]; ctx.setLineDash([]); points.forEach(([hx,hy])=>{ ctx.fillStyle='#fff'; ctx.strokeStyle='#0a84ff'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(hx,hy,5,0,Math.PI*2); ctx.fill(); ctx.stroke(); }); } else if (s.type==='text'){ const w=80,h=20; ctx.strokeRect(s.x-2, s.y-16, w, h); } ctx.restore(); }
  function deleteSelected(){ if (selectedShapeIndex===-1) return; App.state.editor.annotations.splice(selectedShapeIndex,1); selectedShapeIndex=-1; pushHistory(); scheduleDraw(true); }
  function pushHistory(){ undoStack.push(JSON.parse(JSON.stringify(App.state.editor.annotations))); if (undoStack.length>50) undoStack.shift(); redoStack.length=0; }
  function undo(){ if (undoStack.length===0) return; const current = JSON.parse(JSON.stringify(App.state.editor.annotations)); redoStack.push(current); const prev = undoStack.pop(); App.state.editor.annotations = prev || []; selectedShapeIndex=-1; scheduleDraw(true); }
  function redo(){ if (redoStack.length===0) return; const next = redoStack.pop(); undoStack.push(JSON.parse(JSON.stringify(App.state.editor.annotations))); App.state.editor.annotations = next || []; selectedShapeIndex=-1; scheduleDraw(true); }
  function clearHistory(){ undoStack.length=0; redoStack.length=0; selectedShapeIndex=-1; }
  // hotkeys
  document.addEventListener('keydown',(e)=>{ const isMac = navigator.platform.toUpperCase().includes('MAC'); const ctrl = isMac ? e.metaKey : e.ctrlKey; const key=e.key.toLowerCase(); if (ctrl && key==='z'){ e.preventDefault(); if (e.shiftKey) redo(); else undo(); } if ((ctrl && key==='y') || (ctrl && e.shiftKey && key==='z')){ e.preventDefault(); redo(); } if (key==='delete' || key==='backspace'){ if (selectedShapeIndex!==-1){ e.preventDefault(); deleteSelected(); } } });

  function distanceToSegment(p, v, w){ const l2 = (v.x-w.x)**2 + (v.y-w.y)**2; if (l2===0) return Math.hypot(p.x-v.x, p.y-v.y); let t = ((p.x - v.x)*(w.x - v.x) + (p.y - v.y)*(w.y - v.y)) / l2; t = Math.max(0, Math.min(1, t)); const proj = { x: v.x + t*(w.x-v.x), y: v.y + t*(w.y-v.y)}; return Math.hypot(p.x - proj.x, p.y - proj.y); }

  App.editor = { init };
})();
