// gallery.js - inspiration gallery, lazy loading, preview, lightbox
(function(){
  window.App = window.App || {};
  const App = window.App;
  const U = () => App.utils;

  let galleryPreviewer = null;
  let previewInterval = null;

  function cleanupPreviewInterval(){ if (previewInterval) { clearInterval(previewInterval); previewInterval = null; } }
  function cleanup(){ cleanupPreviewInterval(); if (galleryPreviewer) { galleryPreviewer.classList.remove('visible'); galleryPreviewer.innerHTML=''; } }

  function ensurePreviewer() {
    if (!galleryPreviewer) {
      galleryPreviewer = document.createElement('div');
      galleryPreviewer.className = 'thumbnail-previewer';
      document.body.appendChild(galleryPreviewer);
    }
  }

  function updateGalleryDisplay(indexOnPage){
    const example = App.state.currentExamples[indexOnPage]; if (!example) return;
    App.dom.promptDisplayArea.textContent = example.prompt || '';
    App.dom.galleryPromptTitle.textContent = example.title || '';
    App.dom.galleryPromptAuthor.textContent = `by ${example.author || 'N/A'}`;
    App.dom.thumbnailTrack.querySelectorAll('.thumbnail-item').forEach((item,i)=> item.classList.toggle('active', i===indexOnPage));
    App.state.currentIndexOnPage = indexOnPage;
    if (App.historyFavorites && App.historyFavorites.updateTemplateFavoriteIcon) App.historyFavorites.updateTemplateFavoriteIcon();
  }

  async function openLightbox(index){
    updateGalleryDisplay(index);
    await updateLightboxImage(index);
    App.dom.lightboxModal.classList.remove('hidden');
    document.body.style.overflow='hidden';
  }
  function closeLightbox(){ App.dom.lightboxModal.classList.add('hidden'); document.body.style.overflow=''; }
  async function showNextImage(){ if (App.state.currentLightboxIndex < App.state.currentExamples.length -1) await updateLightboxImage(App.state.currentLightboxIndex + 1); }
  async function showPrevImage(){ if (App.state.currentLightboxIndex > 0) await updateLightboxImage(App.state.currentLightboxIndex - 1); }
  function handleKeydown(e){ if (!App.dom.lightboxModal.classList.contains('hidden')) { if (e.key==='Escape') closeLightbox(); if (App.state.currentLightboxIndex>=0){ if (e.key==='ArrowRight') showNextImage(); if (e.key==='ArrowLeft') showPrevImage(); } } }

  async function updateLightboxImage(index){
    const example = App.state.currentExamples[index]; if (!example) return;
    const highResImage = (example.outputImages && example.outputImages) || example.thumbnail;
    try { App.dom.lightboxImage.src = await U().getProxiedImageUrlWithCache(highResImage); }
    catch { App.dom.lightboxImage.src = U().getProxiedImageUrl(highResImage); }
    App.dom.lightboxImage.alt = example.title || '';
    App.state.currentLightboxIndex = index;
    App.dom.lightboxPrev.style.display = index>0 ? 'flex' : 'none';
    App.dom.lightboxNext.style.display = index < App.state.currentExamples.length -1 ? 'flex' : 'none';
  }

  function loadPage(page){
    ensurePreviewer(); cleanup();
    const start = page * App.state.itemsPerPage; const end = start + App.state.itemsPerPage;
    App.state.currentExamples = App.state.allExamples.slice(start, end);
    const { thumbnailTrack, promptDisplayArea, galleryPromptTitle, galleryPromptAuthor } = App.dom;
    thumbnailTrack.innerHTML = '';
    if (App.state.currentExamples.length === 0){ promptDisplayArea.textContent = '该分类下暂无灵感...'; galleryPromptTitle.textContent = '空空如也'; galleryPromptAuthor.textContent = ''; return; }
    const fragment = document.createDocumentFragment();
    App.state.currentExamples.forEach((example, index) => {
      const item = document.createElement('div'); item.className='thumbnail-item'; item.dataset.id = example.id || example.title || `${index}`;
      if (example.thumbnail && (example.thumbnail.startsWith('http') || example.thumbnail.startsWith('data:image') || example.thumbnail.startsWith('/'))){
        const img = document.createElement('img'); img.decoding='async'; img.alt = example.title || ''; img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4NSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODUiIGhlaWdodD0iODUiIGZpbGw9IiNlYWVhZWEiLz48L3N2Zz4='; img.dataset.src = example.thumbnail;
        img.onerror = function(){ this.style.display='none'; const iconDiv = document.createElement('div'); iconDiv.innerHTML='🖼️'; iconDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;width:85px;height:85px;font-size:2em;background-color:var(--bg-color);border-radius:var(--border-radius-small);'; this.parentNode.appendChild(iconDiv); };
        fragment.appendChild(item); item.appendChild(img);
      } else {
        item.innerHTML = '🖼️'; item.style.cssText = 'display:flex;align-items:center;justify-content:center;font-size:2em;background-color:var(--bg-color)'; fragment.appendChild(item);
      }
      // click opens lightbox
      item.addEventListener('click', () => openLightbox(index));
      // desktop hover preview
      if (window.matchMedia('(min-width: 1025px) and (hover: hover)').matches){
        item.addEventListener('mouseenter', async (e) => {
          cleanupPreviewInterval();
          const currentElement = e.currentTarget;
          const imagesToShow = [...(example.inputImages || []), ...(example.outputImages || [])].filter(Boolean);
          if (imagesToShow.length === 0 && example.thumbnail) imagesToShow.push(example.thumbnail);
          let proxiedImages = [];
          try { proxiedImages = await Promise.all(imagesToShow.map(async url => { try { return await U().getProxiedImageUrlWithCache(url);} catch { return U().getProxiedImageUrl(url);} })); } catch { proxiedImages = imagesToShow.map(url => U().getProxiedImageUrl(url)); }
          const maxPreviewImages = 3; const limited = proxiedImages.slice(0, maxPreviewImages);
          galleryPreviewer.innerHTML='';
          limited.forEach(src => { const img = document.createElement('img'); img.decoding='async'; img.loading='lazy'; img.onerror = () => img.remove(); img.src = src; galleryPreviewer.appendChild(img); });
          const previewImages = galleryPreviewer.querySelectorAll('img');
          if (previewImages.length>0){ let currentPreviewIndex = 0; let imagesLoaded = 0; const checkAll = ()=>{ imagesLoaded++; if (imagesLoaded === previewImages.length){ previewImages[0].classList.add('active-preview'); if (previewImages.length>1){ previewInterval = setInterval(()=>{ previewImages[currentPreviewIndex] && previewImages[currentPreviewIndex].classList.remove('active-preview'); currentPreviewIndex = (currentPreviewIndex+1)%previewImages.length; previewImages[currentPreviewIndex] && previewImages[currentPreviewIndex].classList.add('active-preview'); }, 1500);} const rect=currentElement.getBoundingClientRect(); const previewerHeight = galleryPreviewer.offsetHeight; const spaceBelow = window.innerHeight - rect.bottom; const spaceAbove = rect.top; let topPosition = window.scrollY + rect.top; if (spaceBelow < previewerHeight && spaceAbove > previewerHeight) { topPosition = window.scrollY + rect.bottom - previewerHeight; } galleryPreviewer.style.left = `${rect.right + 15}px`; galleryPreviewer.style.top = `${topPosition}px`; galleryPreviewer.classList.add('visible'); } };
            previewImages.forEach(img => { if (img.complete) { checkAll(); } else { img.onload = checkAll; img.onerror = checkAll; } });
          }
        });
        item.addEventListener('mouseleave', () => cleanup());
      }
    });
    App.dom.thumbnailTrack.appendChild(fragment);
    // observe lazy images
    const imagesToLoad = App.dom.thumbnailTrack.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver(async (entries, obs) => {
      for (const entry of entries){ if (entry.isIntersecting){ const img = entry.target; const src = img.dataset.src; if (src){ try { img.src = await U().getProxiedImageUrlWithCache(src); } catch { img.src = U().getProxiedImageUrl(src);} img.removeAttribute('data-src'); } obs.unobserve(img);} }
    }, { rootMargin: '0px 0px 200px 0px' });
    imagesToLoad.forEach(img => observer.observe(img));
    updateGalleryDisplay(0); updatePaginationButtons();
  }

  function updatePaginationButtons(){
    const totalPages = Math.ceil(App.state.allExamples.length / App.state.itemsPerPage);
    App.dom.carouselPrev.disabled = App.state.currentPage === 0;
    App.dom.carouselNext.disabled = App.state.currentPage >= totalPages - 1;
  }

  function init(){
    // arrows
    if (App.dom.carouselPrev && !App.dom.carouselPrev.dataset.listenerAdded){
      App.dom.carouselPrev.addEventListener('click', ()=>{ if (App.state.currentPage>0){ App.state.currentPage--; loadPage(App.state.currentPage);} });
      App.dom.carouselPrev.dataset.listenerAdded = 'true';
    }
    if (App.dom.carouselNext && !App.dom.carouselNext.dataset.listenerAdded){
      App.dom.carouselNext.addEventListener('click', ()=>{ if (App.state.currentPage < Math.ceil(App.state.allExamples.length/App.state.itemsPerPage)-1){ App.state.currentPage++; loadPage(App.state.currentPage);} });
      App.dom.carouselNext.dataset.listenerAdded = 'true';
    }
    // select template button
    if (App.dom.selectTemplateBtn && !App.dom.selectTemplateBtn.dataset.listenerAdded){
      App.dom.selectTemplateBtn.addEventListener('click', ()=>{
        const ex = App.state.currentExamples[App.state.currentIndexOnPage]; if (!ex) return;
        const activeTab = document.querySelector('.tabs button.active');
        let target = App.dom.promptInputText;
        if (activeTab && activeTab.id === 'tab-image-to-image') target = App.dom.promptInputImage;
        if (activeTab && activeTab.id === 'tab-image-editor') target = App.dom.promptInputEditor;
        if (target){ target.value = ex.prompt || ''; target.focus(); }
      });
      App.dom.selectTemplateBtn.dataset.listenerAdded = 'true';
    }

    // favorite template
    if (App.dom.favoriteTemplateBtn && !App.dom.favoriteTemplateBtn.dataset.listenerAdded){
      App.dom.favoriteTemplateBtn.addEventListener('click', async (e)=>{
        e.preventDefault(); e.stopPropagation();
        const ex = App.state.currentExamples[App.state.currentIndexOnPage]; if (!ex) return;
        if (App.historyFavorites && App.historyFavorites.toggleFavorite){
          await App.historyFavorites.toggleFavorite(ex, 'template');
          App.historyFavorites.updateTemplateFavoriteIcon && App.historyFavorites.updateTemplateFavoriteIcon();
        }
      });
      App.dom.favoriteTemplateBtn.dataset.listenerAdded = 'true';
    }

    // lightbox events
    if (App.dom.lightboxClose && !App.dom.lightboxClose.dataset.listenerAdded){ App.dom.lightboxClose.addEventListener('click', closeLightbox); App.dom.lightboxClose.dataset.listenerAdded = 'true'; }
    if (App.dom.lightboxModal && !App.dom.lightboxModal.dataset.listenerAdded){ App.dom.lightboxModal.addEventListener('click',(e)=>{ if (e.target===App.dom.lightboxModal) closeLightbox(); }); App.dom.lightboxModal.dataset.listenerAdded='true'; }
    if (App.dom.lightboxImage && !App.dom.lightboxImage.dataset.listenerAdded){ App.dom.lightboxImage.addEventListener('click',(e)=> e.stopPropagation()); App.dom.lightboxImage.dataset.listenerAdded='true'; }
    const lightboxContent = document.querySelector('.lightbox-content');
    if (lightboxContent && !lightboxContent.dataset.listenerAdded){ lightboxContent.addEventListener('click',(e)=> e.stopPropagation()); lightboxContent.dataset.listenerAdded='true'; }
    if (App.dom.lightboxPrev && !App.dom.lightboxPrev.dataset.listenerAdded){ App.dom.lightboxPrev.addEventListener('click',(e)=>{ e.stopPropagation(); showPrevImage(); }); App.dom.lightboxPrev.dataset.listenerAdded='true'; }
    if (App.dom.lightboxNext && !App.dom.lightboxNext.dataset.listenerAdded){ App.dom.lightboxNext.addEventListener('click',(e)=>{ e.stopPropagation(); showNextImage(); }); App.dom.lightboxNext.dataset.listenerAdded='true'; }
    if (!document.body.dataset.keydownListenerAdded){ document.addEventListener('keydown', handleKeydown); document.body.dataset.keydownListenerAdded='true'; }
  }

  App.gallery = { init, loadPage, cleanup, updateGalleryDisplay };
})();
