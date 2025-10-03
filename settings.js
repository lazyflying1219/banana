// settings.js - theme toggle, settings modal and API test
(function(){
  window.App = window.App || {}; const App = window.App; const U = () => App.utils;

  function applyTheme(theme){
    const sunIcon = App.dom.sunIcon; const moonIcon = App.dom.moonIcon;
    if (theme === 'dark') { document.documentElement.setAttribute('data-theme','dark'); if (sunIcon) sunIcon.style.display='none'; if (moonIcon) moonIcon.style.display='block'; }
    else { document.documentElement.removeAttribute('data-theme'); if (sunIcon) sunIcon.style.display='block'; if (moonIcon) moonIcon.style.display='none'; }
  }
  function toggleTheme(){ const current = document.documentElement.getAttribute('data-theme'); const next = current === 'dark' ? 'light' : 'dark'; applyTheme(next); localStorage.setItem('theme', next); }

  function initTheme(){ const savedTheme = localStorage.getItem('theme'); const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; applyTheme(savedTheme || (prefersDark ? 'dark' : 'light')); App.dom.themeBtn && App.dom.themeBtn.addEventListener('click', toggleTheme); }

  function initModelPresets(){ document.querySelectorAll('.preset-btn').forEach(btn=>{ btn.addEventListener('click', ()=>{ const model = btn.dataset.model; if (App.dom.modelNameInput) App.dom.modelNameInput.value = model; }); }); }

  function initApiTest(){ const testBtn = document.getElementById('test-api-btn'); const resBox = document.getElementById('api-test-result'); if (testBtn && resBox){ testBtn.addEventListener('click', async ()=>{ const original = testBtn.textContent; testBtn.textContent='测试中...'; testBtn.disabled=true; resBox.innerHTML = '<div style="color:#007aff;">🔄 正在测试API连接...</div>'; try{ const response = await fetch('/api/generate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt:'测试图片生成：一只可爱的小猫', model: App.dom.modelNameInput ? App.dom.modelNameInput.value.trim() : 'vertexpic2-gemini-2.5-flash-image-preview' }) }); const result = await response.json(); if (response.ok && result.src){ resBox.innerHTML = '<div style="color:#28a745;">✅ API连接成功！图片生成正常</div>'; } else { resBox.innerHTML = `<div style="color:#dc3545;">❌ API测试失败</div><details style="margin-top:10px;"><summary style="cursor:pointer;">查看详细错误</summary><pre style="background:rgba(0,0,0,0.1);padding:8px;border-radius:4px;font-size:11px;margin-top:5px;overflow-x:auto;">${JSON.stringify(result,null,2)}</pre></details>`; } } catch (e) { resBox.innerHTML = `<div style="color:#dc3545;">❌ 网络错误: ${e.message}</div><div style="margin-top:5px;font-size:0.8em;">请检查API地址是否正确</div>`; } testBtn.textContent = original; testBtn.disabled=false; }); } }

  function initSaveSettings(){ const btn = document.getElementById('save-settings-btn'); if (btn){ btn.addEventListener('click', ()=>{ if (App.dom.modelNameInput) localStorage.setItem('modelName', App.dom.modelNameInput.value); App.closeModal && App.closeModal(App.dom.settingsModal); const original = btn.textContent; btn.textContent='已保存'; btn.style.backgroundColor='#28a745'; setTimeout(()=>{ btn.textContent=original; btn.style.backgroundColor=''; }, 1500); }); } const savedModelName = localStorage.getItem('modelName'); if (App.dom.modelNameInput) App.dom.modelNameInput.value = savedModelName || 'vertexpic2-gemini-2.5-flash-image-preview'; }

  function init(){ initTheme(); initModelPresets(); initApiTest(); initSaveSettings(); }

  App.settings = { init, applyTheme };
})();

