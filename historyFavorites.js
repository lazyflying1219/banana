// historyFavorites.js - favorites and history management
(function(){
  window.App = window.App || {}; const App = window.App; const U = () => App.utils;

  async function addToHistory(imageData){
    try {
      const historyItem = { prompt: imageData.prompt || '', model: imageData.model || (App.dom.modelNameInput?.value || ''), src: imageData.src, thumbnail: imageData.src, timestamp: Date.now(), id: imageData.id || `gen_${Date.now()}` };
      await window.addToHistoryDB(historyItem);
    } catch (e) { console.error('Failed to add to history', e); }
  }

  async function getFavorites(){ return await window.getFavoritesDB(); }
  async function getHistory(){ return await window.getHistoryDB(); }

  async function toggleFavorite(item, type){
    const itemId = item.id || item.title || item.src; if (!itemId) return;
    const favorites = await getFavorites();
    const exists = favorites.find(f=> f.id===itemId);
    if (exists){ await window.deleteFromFavoritesDB(itemId); }
    else {
      const favoriteItem = { ...item, type: type==='detail' ? (item.sourceType || 'history') : type, id: itemId, timestamp: Date.now(), favoriteDate: new Date().toLocaleDateString() };
      if (!favoriteItem.thumbnail && favoriteItem.src) favoriteItem.thumbnail = favoriteItem.src;
      await window.addToFavoritesDB(favoriteItem);
    }
    if (type==='template') updateTemplateFavoriteIcon();
    else if (type==='result') updateResultFavoriteIcon();
  }

  async function updateFavoriteIcon(button, item){ if (!button || !item) return; const itemId = item.id || item.title || item.src; const favorites = await getFavorites(); const isFavorited = favorites.some(f=> f.id===itemId); button.classList.toggle('favorited', isFavorited); }
  async function updateTemplateFavoriteIcon(){ const example = App.state.currentExamples[App.state.currentIndexOnPage]; const btn = App.dom.favoriteTemplateBtn; if (example && btn) await updateFavoriteIcon(btn, example); }
  async function updateResultFavoriteIcon(){ const btn = App.dom.favoriteResultBtn; if (App.state.currentGeneratedImage && btn) await updateFavoriteIcon(btn, App.state.currentGeneratedImage); }

  async function loadFavorites(){ try { const favorites = await getFavorites(); renderGrid(App.dom.favoritesGrid, favorites, '暂无收藏', 'favorites'); } catch (e){ console.error('加载收藏失败', e); App.dom.favoritesGrid.innerHTML = '<p>无法加载收藏。</p>'; } }
  async function loadHistory(){ try { const history = await getHistory(); renderGrid(App.dom.historyGrid, history, '暂无历史记录', 'history'); } catch (e){ console.error('加载历史失败', e); App.dom.historyGrid.innerHTML = '<p>无法加载历史记录。</p>'; } }

  async function deleteItem(itemId, type){ if (!confirm('确定要删除这个项目吗？')) return; if (type==='favorites') { await window.deleteFromFavoritesDB(itemId); loadFavorites(); } else { await window.deleteFromHistoryDB(itemId); loadHistory(); } }
  async function clearAllHistory(){ if (!confirm('确定要清空所有历史记录吗？此操作不可恢复。')) return; await window.clearHistoryDB(); loadHistory(); }
  async function clearAllFavorites(){ if (!confirm('确定要清空所有收藏吗？此操作不可恢复。')) return; await window.clearFavoritesDB(); loadFavorites(); }

  function renderGrid(gridElement, items, emptyText, type){
    gridElement.innerHTML = '';
    if (!items || items.length===0){ const emptyDiv = document.createElement('div'); emptyDiv.style.cssText='text-align:center;color:var(--text-color-secondary);padding:40px;'; emptyDiv.innerHTML = `<div style="font-size:3em;margin-bottom:10px;">${type==='favorites' ? '💝':'📝'}</div><p>${emptyText}</p>`; gridElement.appendChild(emptyDiv); return; }
    const actions = document.createElement('div'); actions.className='grid-actions'; actions.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding:10px;background:rgba(120,120,128,0.1);border-radius:8px;'; const info=document.createElement('span'); info.style.color='var(--text-color-secondary)'; info.textContent=`共 ${items.length} 项`; const clearBtn=document.createElement('button'); clearBtn.className='clear-all-btn'; clearBtn.style.cssText='background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:.85em;cursor:pointer;'; clearBtn.textContent = type==='favorites' ? '清空收藏':'清空历史'; clearBtn.addEventListener('click', (e)=>{ e.stopPropagation(); type==='favorites' ? clearAllFavorites() : clearAllHistory(); }); actions.appendChild(info); actions.appendChild(clearBtn); gridElement.appendChild(actions);
    const fragment = document.createDocumentFragment();
    const maxItems = 100; const limited = items.slice(0, maxItems);
    limited.forEach(item=>{
      const gridItem = document.createElement('div'); gridItem.className='grid-item'; gridItem.style.position='relative';
      const img = document.createElement('img'); img.decoding='async'; const imgSrc = type==='history' ? item.thumbnail : (item.thumbnail || item.src || ''); img.alt='Image'; img.src = U().getProxiedImageUrl(imgSrc); img.onerror = function(){ this.style.display='none'; const icon=document.createElement('div'); icon.innerHTML='🖼️'; icon.style.cssText='display:flex;align-items:center;justify-content:center;width:100%;height:100px;font-size:2em;background-color:var(--bg-color);border-radius:var(--border-radius-small);'; this.parentNode.appendChild(icon); };
      const p = document.createElement('p'); p.title=item.prompt||''; p.textContent=item.prompt||'';
      // add timestamp line
      const timeInfo = document.createElement('div'); timeInfo.className='time-info'; const ts = item.timestamp || item.id; if (ts){ const date = new Date(typeof ts === 'number' ? ts : parseInt(ts, 10)); timeInfo.textContent = date.toLocaleString(); }
      const deleteBtn = document.createElement('button'); deleteBtn.className='delete-item-btn'; deleteBtn.innerHTML='×'; deleteBtn.style.cssText='position:absolute;top:5px;right:5px;background:rgba(220,53,69,0.9);color:white;border:none;border-radius:50%;width:24px;height:24px;font-size:16px;line-height:1;cursor:pointer;display:none;z-index:10;'; gridItem.addEventListener('mouseenter',()=> deleteBtn.style.display='block'); gridItem.addEventListener('mouseleave',()=> deleteBtn.style.display='none'); deleteBtn.addEventListener('click', (e)=>{ e.stopPropagation(); const id = type==='history' ? item.id : (item.id || item.title || item.src); deleteItem(id, type); });
      img.addEventListener('click', ()=>{
        const fullSrc = type==='history' ? item.src : (item.src || item.thumbnail); const processedSrc = U().getProxiedImageUrl(fullSrc);
        App.dom.historyDetailImage.src = processedSrc; App.dom.historyDetailPrompt.textContent = item.prompt || '';
        const titleElement = document.getElementById('history-detail-title'); if (titleElement) titleElement.textContent = type==='favorites' ? '收藏详情' : '历史记录详情';
        App.state.currentItemInDetailView = { ...item, src: fullSrc, id: item.id || item.title || item.src, sourceType: type };
        // Bind download on the fly
        App.dom.downloadHistoryDetailBtn.onclick = () => { const link = document.createElement('a'); link.href = processedSrc; link.download = `nano-banana-${type}-${App.state.currentItemInDetailView.id}.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
        };
        App.openModal(App.dom.historyDetailModal);
      });
      const imageContainer=document.createElement('div'); imageContainer.className='grid-item-image-container'; imageContainer.appendChild(img);
      const contentContainer=document.createElement('div'); contentContainer.className='grid-item-content'; contentContainer.appendChild(p); contentContainer.appendChild(timeInfo);
      gridItem.appendChild(imageContainer); gridItem.appendChild(contentContainer); gridItem.appendChild(deleteBtn); fragment.appendChild(gridItem);
    });
    gridElement.appendChild(fragment);
    if (items.length>maxItems){ const moreInfo = document.createElement('p'); moreInfo.style.textAlign='center'; moreInfo.style.color='var(--text-color-secondary)'; moreInfo.textContent = `显示了前 ${maxItems} 项，共 ${items.length} 项`; gridElement.appendChild(moreInfo); }
  }

  function init(){
    // favorite buttons inside detail modal
    const favBtn = App.dom.favoriteHistoryDetailBtn;
    if (favBtn && !favBtn.dataset.eventBound){ favBtn.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); if (App.state.currentItemInDetailView){ toggleFavorite(App.state.currentItemInDetailView, 'detail').then(()=> updateFavoriteIcon(favBtn, App.state.currentItemInDetailView)); } }); favBtn.dataset.eventBound='true'; }
    // send to img2img from detail
    const sendBtn = document.getElementById('send-history-to-img2img-btn');
    if (sendBtn && !sendBtn.dataset.eventBound){ sendBtn.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); const item = App.state.currentItemInDetailView; if (item && item.src && App.uploads && App.uploads.sendImageToImg2Img){ App.uploads.sendImageToImg2Img(item.src, true); App.closeModal(App.dom.historyDetailModal);} }); sendBtn.dataset.eventBound='true'; }
    // export buttons
    const exportFavoritesBtn = document.getElementById('export-favorites-btn'); if (exportFavoritesBtn && !exportFavoritesBtn.dataset.eventBound){ exportFavoritesBtn.addEventListener('click', async ()=>{ try{ const favorites = await getFavorites(); const filename = `nano-banana-favorites-${new Date().toISOString().split('T')[0]}.json`; exportData(favorites, filename);}catch(e){ console.error('导出收藏失败',e); U().showNotification('导出收藏失败，请重试','error'); } }); exportFavoritesBtn.dataset.eventBound='true'; }
    const exportHistoryBtn = document.getElementById('export-history-btn'); if (exportHistoryBtn && !exportHistoryBtn.dataset.eventBound){ exportHistoryBtn.addEventListener('click', async ()=>{ try{ const history = await getHistory(); const filename = `nano-banana-history-${new Date().toISOString().split('T')[0]}.json`; exportData(history, filename);}catch(e){ console.error('导出历史失败',e); U().showNotification('导出历史记录失败，请重试','error'); } }); exportHistoryBtn.dataset.eventBound='true'; }
  }

  function exportData(data, filename){ const jsonStr = JSON.stringify(data, null, 2); const blob = new Blob([jsonStr], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); }

  App.historyFavorites = { init, addToHistory, toggleFavorite, updateTemplateFavoriteIcon, updateResultFavoriteIcon, loadFavorites, loadHistory };
})();
