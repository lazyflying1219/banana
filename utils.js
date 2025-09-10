// utils.js - shared helpers, ratios, proxy URL helpers, notifications
(function(){
  window.App = window.App || {};
  const App = window.App;

  const ASPECT_RATIOS = {
    '1:1': { label: '1:1', description: '正方形', baseImage: null },
    '16:9': { label: '16:9', description: '宽屏', baseImage: '16_9.png' },
    '9:16': { label: '9:16', description: '竖屏', baseImage: '9_16.png' },
    '4:3': { label: '4:3', description: '标准', baseImage: '4_3.png' },
    '3:4': { label: '3:4', description: '竖版标准', baseImage: '3_4.png' },
    '3:2': { label: '3:2', description: '相机', baseImage: '3_2.png' },
    '2:3': { label: '2:3', description: '竖版相机', baseImage: '2_3.png' }
  };

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed; top: 80px; right: 20px; background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007aff'}; color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; font-size: 14px; max-width: 300px; opacity: 0; transform: translateX(100%); transition: all 0.3s ease;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(0)'; }, 50);
    setTimeout(() => { notification.style.opacity = '0'; notification.style.transform = 'translateX(100%)'; setTimeout(() => notification.remove(), 300); }, 3000);
  }

  async function getProxiedImageUrlWithCache(originalUrl) {
    if (!originalUrl) return originalUrl;
    if (originalUrl.startsWith('data:')) return originalUrl;
    if (originalUrl.startsWith('/') && !originalUrl.startsWith('//')) return originalUrl;
    if (originalUrl.startsWith('blob:')) return originalUrl;
    if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://') || originalUrl.startsWith('//')) {
      try {
        const cachedImage = await window.getCachedImage(originalUrl);
        if (cachedImage) return cachedImage;
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            let mimeType = (img.src.includes('.png') || img.src.includes('.webp')) ? 'image/png' : 'image/jpeg';
            let quality = mimeType === 'image/png' ? 1.0 : 0.8;
            const dataUrl = canvas.toDataURL(mimeType, quality);
            await window.cacheImage(originalUrl, dataUrl);
          } catch {}
        };
        img.src = proxyUrl;
        return proxyUrl;
      } catch (e) {
        return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
      }
    }
    return originalUrl;
  }

  function getProxiedImageUrl(originalUrl) {
    if (!originalUrl) return originalUrl;
    if (originalUrl.startsWith('data:')) return originalUrl;
    if (originalUrl.startsWith('/') && !originalUrl.startsWith('//')) return originalUrl;
    if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://') || originalUrl.startsWith('//')) {
      return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    }
    if (originalUrl.startsWith('blob:')) return originalUrl;
    return originalUrl;
  }

  function handleRatioSelection(ratio, buttonElement) {
    document.querySelectorAll('.ratio-button').forEach(btn => btn.classList.remove('selected'));
    buttonElement.classList.add('selected');
    App.state.selectedRatio = ratio;
    preloadBaseImage(ratio);
  }

  function preloadBaseImage(ratio) {
    const config = ASPECT_RATIOS[ratio];
    if (config && config.baseImage) {
      const img = new Image();
      img.src = config.baseImage;
    }
  }

  function initRatioSelector() {
    const ratioContainer = document.getElementById('ratio-buttons-container');
    if (!ratioContainer) return;
    ratioContainer.innerHTML = '';
    Object.entries(ASPECT_RATIOS).forEach(([ratio, config]) => {
      const button = document.createElement('button');
      button.className = 'ratio-button';
      button.dataset.ratio = ratio;
      const label = document.createElement('div'); label.className = 'ratio-label'; label.textContent = config.label;
      const description = document.createElement('div'); description.className = 'ratio-description'; description.textContent = config.description;
      button.appendChild(label); button.appendChild(description);
      if (ratio === App.state.selectedRatio) button.classList.add('selected');
      button.addEventListener('click', () => handleRatioSelection(ratio, button));
      ratioContainer.appendChild(button);
    });
  }

  function init() {
    initRatioSelector();
  }

  App.utils = {
    init,
    ASPECT_RATIOS,
    showNotification,
    getProxiedImageUrl,
    getProxiedImageUrlWithCache,
  };
})();

