// uploads.js - image-to-image uploads and utility send-to-img2img
(function(){
  window.App = window.App || {}; const App = window.App; const U = () => App.utils;

  function handleFiles(files){
    const maxFiles = 9; const maxSize = 10 * 1024 * 1024; // 10MB
    if (App.state.uploadedFiles.length + files.length > maxFiles){ U().showNotification(`最多只能上传 ${maxFiles} 张图片`, 'error'); return; }
    [...files].forEach(file => {
      if (!file.type.startsWith('image/')) { U().showNotification(`文件 "${file.name}" 不是图片格式`, 'error'); return; }
      if (file.size > maxSize) { U().showNotification(`文件 "${file.name}" 太大，请选择小于 10MB 的图片`, 'error'); return; }
      const reader = new FileReader(); reader.onload = (e)=>{ App.state.uploadedFiles.push({ file, dataUrl: e.target.result }); renderUploadPreviews();}; reader.onerror = ()=> U().showNotification(`读取文件 "${file.name}" 失败`, 'error'); reader.readAsDataURL(file);
    });
  }

  function renderUploadPreviews(){
    const area = App.dom.fileUploadArea; if (!area) return;
    const initialText = area.querySelector('p'); if (initialText) initialText.style.display='none';
    let thumbs = area.querySelector('.upload-thumbs'); if (!thumbs){ thumbs = document.createElement('div'); thumbs.className='upload-thumbs'; area.appendChild(thumbs); }
    thumbs.innerHTML=''; const fragment = document.createDocumentFragment();
    App.state.uploadedFiles.forEach((item,index)=>{
      const wrapper = document.createElement('div'); wrapper.className='upload-thumb-item'; const img = document.createElement('img'); img.decoding='async'; img.src=item.dataUrl; img.alt='preview'; img.loading='lazy'; const removeBtn = document.createElement('button'); removeBtn.className='remove-thumb'; removeBtn.textContent='×'; removeBtn.addEventListener('click',(e)=>{ e.stopPropagation(); App.state.uploadedFiles.splice(index,1); renderUploadPreviews(); if (App.state.uploadedFiles.length===0 && initialText) initialText.style.display='block';}); wrapper.appendChild(img); wrapper.appendChild(removeBtn); fragment.appendChild(wrapper);
    });
    thumbs.appendChild(fragment);
  }

  function init(){
    const area = App.dom.fileUploadArea; const input = App.dom.fileInput; if (!area || !input) return;
    area.addEventListener('click', ()=> input.click());
    area.addEventListener('dragover', (e)=>{ e.preventDefault(); area.classList.add('dragging'); });
    area.addEventListener('dragleave', ()=> area.classList.remove('dragging'));
    area.addEventListener('drop', (e)=>{ e.preventDefault(); area.classList.remove('dragging'); if (e.dataTransfer.files.length>0) handleFiles(e.dataTransfer.files); });
    input.addEventListener('change', (e)=>{ if (e.target.files.length>0) handleFiles(e.target.files); input.value=''; });
  }

  function sendImageToImg2Img(imageSrc, isMultiple=true){
    const processedSrc = U().getProxiedImageUrl(imageSrc);
    const testImg = new Image(); testImg.onload = () => {
      fetch(processedSrc).then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob();}).then(blob=>{
        const file = new File([blob], `image_${Date.now()}.png`, { type: 'image/png' }); const reader = new FileReader(); reader.onload=(e)=>{ if (!isMultiple) App.state.uploadedFiles.length=0; const maxFiles=9; if (App.state.uploadedFiles.length>=maxFiles){ U().showNotification(`最多只能上传 ${maxFiles} 张图片`, 'error'); return;} App.state.uploadedFiles.push({ file, dataUrl: e.target.result }); renderUploadPreviews(); const msg = isMultiple ? `已添加图片到图生图 (${App.state.uploadedFiles.length}/${maxFiles})` : '图片已发送到图生图！'; U().showNotification(msg,'success');}; reader.onerror=()=> U().showNotification('读取图片数据失败，请重试','error'); reader.readAsDataURL(file);
      }).catch(err=>{ U().showNotification('获取图片失败，请重试','error'); console.error(err); });
    };
    testImg.onerror = ()=> U().showNotification('图片加载失败，请重试','error');
    testImg.src = processedSrc;
    // switch to img2img tab
    if (App.dom.tabImageToImage && App.dom.panelImageToImage) App.switchTab(App.dom.tabImageToImage, App.dom.panelImageToImage);
  }

  App.uploads = { init, handleFiles, renderUploadPreviews, sendImageToImg2Img };
})();

