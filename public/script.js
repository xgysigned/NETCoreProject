// DOM元素
const uploadArea = document.getElementById('uploadArea');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const statusSection = document.getElementById('statusSection');
const resultsSection = document.getElementById('resultsSection');
const historyContainer = document.getElementById('historyContainer');
const previewImage = document.getElementById('previewImage');
const detectionResults = document.getElementById('detectionResults');
const processTime = document.getElementById('processTime');
const fileName = document.getElementById('fileName');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadHistory();
});

// 设置事件监听器
function setupEventListeners() {
    // 点击上传按钮
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // 点击上传区域
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // 文件选择变化
    fileInput.addEventListener('change', handleFileSelect);

    // 拖拽事件
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // 防止页面默认的拖拽行为
    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', e => e.preventDefault());
}

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        uploadFile(file);
    }
}

// 处理拖拽悬停
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

// 处理拖拽离开
function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

// 处理拖拽放下
function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            uploadFile(file);
        } else {
            showError('请选择图片文件！');
        }
    }
}

// 上传文件
async function uploadFile(file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        showError('请选择图片文件！');
        return;
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
        showError('文件大小不能超过10MB！');
        return;
    }

    try {
        // 显示加载状态
        showStatus();
        
        // 创建FormData
        const formData = new FormData();
        formData.append('image', file);

        // 发送请求
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // 显示结果
            showResults(result.data);
            // 更新历史记录
            loadHistory();
        } else {
            showError(result.error || '上传失败，请重试！');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showError('网络错误，请检查连接后重试！');
    }
}

// 显示加载状态
function showStatus() {
    statusSection.style.display = 'block';
    resultsSection.style.display = 'none';
    statusSection.classList.add('fade-in');
    
    // 滚动到状态区域
    statusSection.scrollIntoView({ behavior: 'smooth' });
}

// 显示结果
function showResults(data) {
    statusSection.style.display = 'none';
    resultsSection.style.display = 'block';
    resultsSection.classList.add('fade-in');

    // 设置图片预览
    previewImage.src = `/uploads/${data.filename}`;
    previewImage.alt = data.originalName;

    // 设置文件信息
    fileName.textContent = data.originalName;
    processTime.textContent = new Date(data.timestamp).toLocaleString();

    // 显示识别结果
    displayDetectionResults(data.result);

    // 滚动到结果区域
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// 显示识别结果
function displayDetectionResults(result) {
    detectionResults.innerHTML = '';

    if (result.success && result.detections && result.detections.length > 0) {
        result.detections.forEach(detection => {
            const detectionItem = document.createElement('div');
            detectionItem.className = 'detection-item';
            
            detectionItem.innerHTML = `
                <div class="type">${detection.type}</div>
                <div class="label">${detection.label}</div>
                <div class="confidence">置信度: ${(detection.confidence * 100).toFixed(1)}%</div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${detection.confidence * 100}%"></div>
                </div>
            `;
            
            detectionResults.appendChild(detectionItem);
        });
    } else {
        detectionResults.innerHTML = `
            <div class="detection-item">
                <div class="label">暂无识别结果</div>
                <div class="confidence">请检查图片内容或稍后重试</div>
            </div>
        `;
    }
}

// 加载历史记录
async function loadHistory() {
    try {
        const response = await fetch('/api/results');
        const results = await response.json();

        if (results.length > 0) {
            displayHistory(results);
        } else {
            showNoHistory();
        }
    } catch (error) {
        console.error('Failed to load history:', error);
        showNoHistory();
    }
}

// 显示历史记录
function displayHistory(results) {
    historyContainer.innerHTML = '';
    
    // 按时间倒序排序
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    results.forEach(result => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = () => showHistoryResult(result);
        
        const detectionText = result.result.detections && result.result.detections.length > 0
            ? result.result.detections.map(d => d.label).join(', ')
            : '无识别结果';
        
        historyItem.innerHTML = `
            <img src="/uploads/${result.filename}" alt="${result.originalName}">
            <div class="history-item-details">
                <h4>${result.originalName}</h4>
                <p>识别内容: ${detectionText}</p>
                <p>时间: ${new Date(result.timestamp).toLocaleString()}</p>
            </div>
        `;
        
        historyContainer.appendChild(historyItem);
    });
}

// 显示无历史记录
function showNoHistory() {
    historyContainer.innerHTML = `
        <div class="no-history">
            <i class="fas fa-clock"></i>
            <p>暂无历史记录</p>
        </div>
    `;
}

// 显示历史记录结果
function showHistoryResult(data) {
    showResults(data);
}

// 显示错误信息
function showError(message) {
    statusSection.style.display = 'none';
    resultsSection.style.display = 'none';
    
    // 创建错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'status-card fade-in';
    errorDiv.style.background = '#fff5f5';
    errorDiv.style.borderLeft = '4px solid #e53e3e';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="color: #e53e3e; font-size: 3em; margin-bottom: 20px;"></i>
        <h3 style="color: #e53e3e;">上传失败</h3>
        <p style="color: #666;">${message}</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #e53e3e; color: white; border: none; border-radius: 5px; cursor: pointer;">重试</button>
    `;
    
    const statusCard = statusSection.querySelector('.status-card');
    statusCard.innerHTML = errorDiv.innerHTML;
    statusSection.style.display = 'block';
    
    // 3秒后自动隐藏错误信息
    setTimeout(() => {
        statusSection.style.display = 'none';
    }, 3000);
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}