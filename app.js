const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 确保uploads目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置multer用于文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // 只允许图片文件
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件！'), false);
        }
    }
});

// 存储处理结果的数组
let results = [];

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 图片上传路由
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有上传文件' });
        }

        console.log('File uploaded:', req.file.filename);
        
        // 这里是webhook调用的地方（目前留空）
        // const webhookUrl = 'https://your-webhook-url.com/analyze';
        
        // 模拟webhook调用 - 在实际应用中，这里应该是真实的webhook调用
        const mockResult = await simulateWebhookCall(req.file);
        
        // 存储结果
        const result = {
            id: Date.now(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            result: mockResult,
            timestamp: new Date().toISOString()
        };
        
        results.push(result);
        
        res.json({ success: true, data: result });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: '上传失败: ' + error.message });
    }
});

// 模拟webhook调用函数
async function simulateWebhookCall(file) {
    // 这里模拟一个异步的图片识别过程
    // 在实际应用中，这应该是对真实webhook的调用
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockResults = [
                { type: '物体', confidence: 0.95, label: '猫' },
                { type: '物体', confidence: 0.87, label: '桌子' },
                { type: '场景', confidence: 0.92, label: '室内' },
                { type: '颜色', confidence: 0.89, label: '棕色' }
            ];
            
            // 随机选择一些结果
            const randomResults = mockResults.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
            
            resolve({
                success: true,
                detections: randomResults,
                message: '图片识别完成'
            });
        }, 2000); // 模拟2秒的处理时间
    });
}

// 获取所有结果
app.get('/api/results', (req, res) => {
    res.json(results);
});

// 获取单个结果
app.get('/api/results/:id', (req, res) => {
    const result = results.find(r => r.id == req.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: '结果未找到' });
    }
});

// 获取上传的图片
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).json({ error: '文件未找到' });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制（最大10MB）' });
        }
    }
    res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});