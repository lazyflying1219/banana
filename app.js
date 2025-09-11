// app.js - App bootstrap and high-level orchestration
(function () {
  window.App = window.App || {};
  const App = window.App;

  App.state = {
    // gallery
    allExamples: [],
    currentExamples: [],
    currentPage: 0,
    itemsPerPage: 15,
    currentIndexOnPage: 0,

    // generation
    currentGeneratedImage: null,

    // image-to-image uploads
    uploadedFiles: [], // { file: File, dataUrl: string }

    // lightbox
    currentLightboxIndex: -1,

    // ratio selection (default)
    selectedRatio: '16:9',

    // editor
    editor: {
      baseImageDataUrl: null,
      annotations: [], // {x,y,w,h,color,label}
      refImages: [], // dataUrls
      canvasSize: { width: 0, height: 0 },
    },
  };

  // cache DOM on init
  App.dom = {};

  function cacheDom() {
    const $ = (id) => document.getElementById(id);
    App.dom = {
      // tabs and panels
      tabTextToImage: $('tab-text-to-image'),
      tabImageToImage: $('tab-image-to-image'),
      tabImageEditor: $('tab-image-editor'),
      panelTextToImage: $('text-to-image-panel'),
      panelImageToImage: $('image-to-image-panel'),
      panelImageEditor: $('image-editor-panel'),

      // prompts
      promptInputText: $('prompt-input-text'),
      promptInputImage: $('prompt-input-image'),
      promptInputEditor: $('prompt-input-editor'),

      // generate
      generateBtn: document.querySelector('.generate-button'),

      // header buttons
      settingsBtn: $('settings-btn'),
      favoritesBtn: $('favorites-btn'),
      historyBtn: $('history-btn'),
      themeBtn: $('theme-btn'),
      sunIcon: document.querySelector('.theme-icon-sun'),
      moonIcon: document.querySelector('.theme-icon-moon'),

      // results
      imageDisplayContainer: $('image-display-container'),
      imageDisplay: $('image-display'),
      imageActions: $('image-actions'),
      favoriteResultBtn: $('favorite-result-btn'),

      // gallery
      promptDisplayArea: $('prompt-display-area'),
      thumbnailTrack: $('thumbnail-track'),
      carouselPrev: $('carousel-prev'),
      carouselNext: $('carousel-next'),
      galleryPromptTitle: $('gallery-prompt-title'),
      galleryPromptAuthor: $('gallery-prompt-author'),
      selectTemplateBtn: $('select-template-btn'),
      favoriteTemplateBtn: $('favorite-template-btn'),

      // modals
      settingsModal: $('settings-modal'),
      favoritesModal: $('favorites-modal'),
      historyModal: $('history-modal'),
      closeModalBtn: $('close-modal-btn'),
      closeFavoritesModalBtn: $('close-favorites-modal-btn'),
      closeHistoryModalBtn: $('close-history-modal-btn'),
      favoritesGrid: $('favorites-grid'),
      historyGrid: $('history-grid'),

      // history detail modal
      historyDetailModal: $('history-detail-modal'),
      closeHistoryDetailModalBtn: $('close-history-detail-modal-btn'),
      downloadHistoryDetailBtn: $('download-history-detail-btn'),
      favoriteHistoryDetailBtn: $('favorite-history-detail-btn'),
      historyDetailImage: $('history-detail-image'),
      historyDetailPrompt: $('history-detail-prompt'),

      // file upload (image-to-image)
      fileUploadArea: document.querySelector('.file-upload-area'),
      fileInput: $('image-input'),
      modelNameInput: $('model-name'),

      // lightbox
      lightboxModal: $('lightbox-modal'),
      lightboxImage: $('lightbox-image'),
      lightboxClose: $('lightbox-close'),
      lightboxPrev: $('lightbox-prev'),
      lightboxNext: $('lightbox-next'),
    };
  }

  function setupTabs() {
    const { tabTextToImage, tabImageToImage, tabImageEditor,
            panelTextToImage, panelImageToImage, panelImageEditor,
            promptInputText, promptInputImage, promptInputEditor } = App.dom;

    function switchTab(activeTab, activePanel) {
      [tabTextToImage, tabImageToImage, tabImageEditor].forEach(t => t && t.classList.remove('active'));
      [panelTextToImage, panelImageToImage, panelImageEditor].forEach(p => p && p.classList.remove('active'));
      activeTab.classList.add('active');
      activePanel.classList.add('active');

      const activeType = activeTab.id === 'tab-text-to-image'
        ? 'text_to_image'
        : activeTab.id === 'tab-image-to-image'
          ? 'image_to_image'
          : 'text_to_image'; // editor falls back to text prompts for gallery

      App.state.allExamples = (window.promptExamples && window.promptExamples[activeType]) || [];
      App.state.currentPage = 0;
      if (App.gallery && App.gallery.loadPage) App.gallery.loadPage(0);

      // Focus corresponding prompt input
      const target = activeTab.id === 'tab-text-to-image'
        ? promptInputText
        : activeTab.id === 'tab-image-to-image'
          ? promptInputImage
          : promptInputEditor;
      if (target) target.focus();
    }

    App.switchTab = switchTab;

    tabTextToImage && tabTextToImage.addEventListener('click', () => switchTab(tabTextToImage, panelTextToImage));
    tabImageToImage && tabImageToImage.addEventListener('click', () => switchTab(tabImageToImage, panelImageToImage));
    tabImageEditor && tabImageEditor.addEventListener('click', () => switchTab(tabImageEditor, panelImageEditor));
  }

  function setupModals() {
    const { settingsModal, favoritesModal, historyModal, historyDetailModal,
            settingsBtn, favoritesBtn, historyBtn, closeModalBtn,
            closeFavoritesModalBtn, closeHistoryModalBtn, closeHistoryDetailModalBtn } = App.dom;

    const openModal = (modal) => modal && modal.classList.remove('hidden');
    const closeModal = (modal) => modal && modal.classList.add('hidden');
    App.openModal = openModal;
    App.closeModal = closeModal;

    settingsBtn && settingsBtn.addEventListener('click', () => openModal(settingsModal));
    closeModalBtn && closeModalBtn.addEventListener('click', () => closeModal(settingsModal));
    favoritesBtn && favoritesBtn.addEventListener('click', () => { App.historyFavorites && App.historyFavorites.loadFavorites(); openModal(favoritesModal); });
    closeFavoritesModalBtn && closeFavoritesModalBtn.addEventListener('click', () => closeModal(favoritesModal));
    historyBtn && historyBtn.addEventListener('click', () => { App.historyFavorites && App.historyFavorites.loadHistory(); openModal(historyModal); });
    closeHistoryModalBtn && closeHistoryModalBtn.addEventListener('click', () => closeModal(historyModal));
    closeHistoryDetailModalBtn && closeHistoryDetailModalBtn.addEventListener('click', () => closeModal(historyDetailModal));

    ;[settingsModal, favoritesModal, historyModal, historyDetailModal].forEach(modal => {
      modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });
  }

  function setupLightboxZoomPan() {
    const img = App.dom.lightboxImage;
    const modal = App.dom.lightboxModal;
    if (!img || !modal) return;

    const state = { scale: 1, x: 0, y: 0, panning: false, startX: 0, startY: 0, lastX: 0, lastY: 0 };
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const apply = () => { img.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`; };
    const reset = () => { state.scale = 1; state.x = 0; state.y = 0; apply(); };

    const onWheel = (e) => {
      if (!modal || modal.classList.contains('hidden')) return;
      e.preventDefault();
      const rect = img.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const prevScale = state.scale;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const nextScale = clamp(prevScale * factor, 1, 6);
      if (nextScale === prevScale) return;
      // keep mouse point stable (origin at 0,0)
      state.x -= (mouseX) * (nextScale - prevScale);
      state.y -= (mouseY) * (nextScale - prevScale);
      state.scale = nextScale;
      apply();
    };

    const onPointerDown = (e) => {
      if (state.scale <= 1) return; // only pan when zoomed
      e.preventDefault();
      img.setPointerCapture(e.pointerId);
      state.panning = true;
      state.startX = e.clientX;
      state.startY = e.clientY;
      state.lastX = state.x;
      state.lastY = state.y;
    };
    const onPointerMove = (e) => {
      if (!state.panning) return;
      e.preventDefault();
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      state.x = state.lastX + dx;
      state.y = state.lastY + dy;
      apply();
    };
    const onPointerUp = (e) => {
      if (!state.panning) return;
      state.panning = false;
      try { img.releasePointerCapture(e.pointerId); } catch(_) {}
    };

    const onDblClick = () => reset();

    // Bind events once
    if (!img.dataset.zoomBound) {
      img.classList.add('zoomable');
      img.addEventListener('wheel', onWheel, { passive: false });
      img.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp, { passive: true });
      img.addEventListener('dblclick', onDblClick);
      img.dataset.zoomBound = 'true';
    }

    // Reset when open/close
    const openObserver = new MutationObserver(() => { if (!modal.classList.contains('hidden')) reset(); });
    openObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
  }

  function setupGenerate() {
    const { generateBtn } = App.dom;
    if (!generateBtn) return;
    generateBtn.addEventListener('click', () => {
      const { tabTextToImage, tabImageToImage, tabImageEditor,
              promptInputText, promptInputImage, promptInputEditor } = App.dom;
      const activeMode = tabImageEditor.classList.contains('active') ? 'editor'
        : tabImageToImage.classList.contains('active') ? 'img2img'
        : 'txt2img';

      const prompt = activeMode === 'txt2img' ? (promptInputText?.value || '')
        : activeMode === 'img2img' ? (promptInputImage?.value || '')
        : (promptInputEditor?.value || '');

      if (!App.generate || !App.generate.startGeneration) return;
      App.generate.startGeneration({ mode: activeMode, prompt });
    });
  }

  function adjustLayout() {
    const header = document.querySelector('header');
    if (header) {
      const headerHeight = header.offsetHeight;
      document.body.style.paddingTop = `${headerHeight + 25}px`;
    }
  }

  function setupResultsDelegation() {
    const resultsContainer = App.dom.imageActions || document.body;
    const { currentGeneratedImage } = App.state;
    resultsContainer.addEventListener('click', (event) => {
      const target = event.target.closest('button');
      if (!target) return;
      if (target.id === 'favorite-result-btn') {
        event.preventDefault(); event.stopPropagation();
        if (App.state.currentGeneratedImage) {
          App.historyFavorites && App.historyFavorites.toggleFavorite(App.state.currentGeneratedImage, 'result').then(() => {
            App.historyFavorites.updateResultFavoriteIcon && App.historyFavorites.updateResultFavoriteIcon();
          });
        }
      }
      if (target.id === 'download-result-btn') {
        event.preventDefault(); event.stopPropagation();
        const img = App.state.currentGeneratedImage;
        if (img && img.src) {
          let imageUrl = img.src;
          if (imageUrl.startsWith('//')) imageUrl = window.location.protocol + imageUrl;
          else if (imageUrl.startsWith('/')) imageUrl = window.location.origin + imageUrl;
          const link = document.createElement('a');
          link.href = imageUrl; link.download = `nano-banana-${Date.now()}.png`; link.target = '_blank';
          document.body.appendChild(link); link.click(); document.body.removeChild(link);
        }
      }
      if (target.id === 'send-to-img2img-btn') {
        event.preventDefault(); event.stopPropagation();
        const img = App.state.currentGeneratedImage;
        if (img && img.src && App.uploads && App.uploads.sendImageToImg2Img) {
          App.uploads.sendImageToImg2Img(img.src, true);
        }
      }
    });
  }

  function setupCleanup() {
    window.addEventListener('beforeunload', () => {
      if (App.gallery && App.gallery.cleanup) App.gallery.cleanup();
      // clear uploads
      App.state.uploadedFiles.length = 0;
      App.state.currentExamples.length = 0;
      App.state.allExamples.length = 0;
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (App.gallery && App.gallery.cleanup) App.gallery.cleanup();
      }
    });
  }

  function init() {
    cacheDom();
    App.utils && App.utils.init && App.utils.init();
    setupTabs();
    setupModals();
    App.settings && App.settings.init && App.settings.init();
    App.gallery && App.gallery.init && App.gallery.init();
    App.uploads && App.uploads.init && App.uploads.init();
    App.historyFavorites && App.historyFavorites.init && App.historyFavorites.init();
    App.editor && App.editor.init && App.editor.init();
    adjustLayout();
    setupGenerate();
    setupResultsDelegation();
    setupLightboxZoomPan();
    setupCleanup();

    // default tab
    if (App.dom.tabTextToImage && App.dom.panelTextToImage) {
      App.switchTab(App.dom.tabTextToImage, App.dom.panelTextToImage);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
