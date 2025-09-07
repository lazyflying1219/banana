// --- 状态变量 ---
const state = {
    allExamples: [],
    currentExamples: [],
    currentIndexOnPage: 0,
    currentPage: 0,
    currentGeneratedImage: null,
    uploadedFiles: [], // { file: File, dataUrl:string }
    currentLightboxIndex: 0,
    currentItemInDetailView: null, // 用于详情视图的状态管理
    selectedRatio: '16:9', // 默认选中的比例
    historyPage: 1,
    favoritesPage: 1,
    currentHistoryItems: [], // 用于存储当前所有历史记录
    currentFavoritesItems: [], // 用于存储当前所有收藏
    currentDetailIndex: -1, // 跟踪详情视图中的当前项目索引
};

// --- 常量 ---
export const ITEMS_PER_PAGE_GALLERY = 15;
export const ITEMS_PER_PAGE_MODAL = 8;
export const ASPECT_RATIOS = {
    '1:1': { label: '1:1', description: '正方形', baseImage: null },
    '16:9': { label: '16:9', description: '宽屏', baseImage: '16_9.png' },
    '9:16': { label: '9:16', description: '竖屏', baseImage: '9_16.png' },
    '4:3': { label: '4:3', description: '标准', baseImage: '4_3.png' },
    '3:4': { label: '3:4', description: '竖版标准', baseImage: '3_4.png' },
    '3:2': { label: '3:2', description: '相机', baseImage: '3_2.png' },
    '2:3': { label: '2:3', description: '竖版相机', baseImage: '2_3.png' }
};

// --- 状态访问和修改函数 ---
export const getState = (key) => state[key];

export const setState = (key, value) => {
    state[key] = value;
    // 你可以在这里添加一些调试或状态变更的钩子
    console.log(`State updated: ${key} =`, value);
};

export default state;
