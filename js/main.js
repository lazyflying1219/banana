import { elements, applyTheme, initRatioSelector, switchTab, elements, textToImagePanel } from './ui.js';
import { initializeEventListeners } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    // 初始化比例选择器
    initRatioSelector();

    // 初始化事件监听器
    initializeEventListeners();

    // 默认打开文生图
    switchTab(elements.tabTextToImage, elements.textToImagePanel);

    // 调整 header 边距
    const header = document.querySelector('header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.body.style.paddingTop = `${headerHeight + 25}px`;
    }
});