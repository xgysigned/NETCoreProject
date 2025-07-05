# 图片识别Web应用

一个基于Node.js的图片上传和识别Web应用，支持图片上传、AI识别和结果展示。

## 功能特点

- 📸 **图片上传**: 支持拖拽上传和点击选择，支持JPG、PNG、GIF格式
- 🤖 **AI识别**: 通过webhook调用AI服务识别图片内容（目前为模拟数据）
- 📊 **结果展示**: 美观的结果展示界面，包含置信度可视化
- 📱 **响应式设计**: 适配桌面和移动设备
- 📈 **历史记录**: 保存上传和识别历史
- 🎨 **美观界面**: 蓝白色主题，现代化设计

## 技术栈

- **后端**: Node.js + Express.js
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **文件上传**: Multer
- **样式**: 纯CSS，无框架依赖
- **图标**: Font Awesome

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动应用

```bash
# 生产环境
npm start

# 开发环境（需要安装nodemon）
npm run dev
```

### 3. 访问应用

打开浏览器访问: `http://localhost:3000`

## 项目结构

```
├── app.js                 # 主应用文件
├── package.json          # 项目配置
├── public/              # 静态文件目录
│   ├── index.html       # 主页面
│   ├── styles.css       # 样式文件
│   └── script.js        # 前端逻辑
├── uploads/             # 上传文件存储目录（自动创建）
└── README.md           # 项目说明
```

## API 接口

### 上传图片
- **URL**: `POST /upload`
- **参数**: `image` (multipart/form-data)
- **返回**: 上传结果和识别数据

### 获取所有结果
- **URL**: `GET /api/results`
- **返回**: 所有识别结果的列表

### 获取单个结果
- **URL**: `GET /api/results/:id`
- **返回**: 指定ID的识别结果

### 获取上传的图片
- **URL**: `GET /uploads/:filename`
- **返回**: 上传的图片文件

## 配置Webhook

在`app.js`文件中找到以下代码段，替换为您的实际webhook URL：

```javascript
// 这里是webhook调用的地方（目前留空）
// const webhookUrl = 'https://your-webhook-url.com/analyze';

// 实际webhook调用示例
const response = await axios.post(webhookUrl, {
    image: fs.readFileSync(req.file.path),
    filename: req.file.filename
}, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
```

## 自定义配置

### 端口配置
设置环境变量 `PORT` 来自定义端口：
```bash
export PORT=8080
npm start
```

### 文件大小限制
在`app.js`中修改上传限制：
```javascript
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 修改这里的数值
    }
});
```

## 部署说明

### 本地部署
1. 确保已安装Node.js (版本 >= 14)
2. 运行 `npm install`
3. 运行 `npm start`

### 服务器部署
1. 将项目文件上传到服务器
2. 安装依赖: `npm install --production`
3. 使用PM2或其他进程管理器启动:
   ```bash
   pm2 start app.js --name "image-recognition-app"
   ```

### Docker部署
创建`Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 安全注意事项

1. 在生产环境中设置适当的文件上传限制
2. 验证上传的文件类型和内容
3. 使用HTTPS协议
4. 定期清理上传的文件
5. 设置适当的CORS策略

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 更新日志

### v1.0.0
- 初始版本
- 支持图片上传和识别
- 美观的用户界面
- 历史记录功能

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件

---

© 2024 图片识别Web应用
