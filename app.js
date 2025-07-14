// LogicFlow 应用主类
class LLMWorkflowApp {
    constructor() {
        this.lf = null;
        this.currentSelectedNode = null;
        this.isBottomPanelCollapsed = false;
        this.nodeConfigs = new Map();
        this.init();
    }

    // 初始化应用
    init() {
        this.initLogicFlow();
        this.registerCustomNodes();
        this.bindEvents();
        this.addLog('success', '流程编排工具已成功启动');
    }

    // 初始化 LogicFlow
    initLogicFlow() {
        this.lf = new LogicFlow.default({
            container: document.getElementById('graph'),
            grid: {
                size: 20,
                visible: true,
                type: 'dot',
                config: {
                    color: '#e5e7eb',
                    thickness: 1,
                }
            },
            background: {
                backgroundColor: 'transparent'
            },
            keyboard: {
                enabled: true
            },
            style: {
                rect: {
                    width: 120,
                    height: 60,
                    radius: 8,
                },
                circle: {
                    r: 30,
                },
                nodeText: {
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#374151'
                },
                edgeText: {
                    fontSize: 12,
                    color: '#6b7280'
                }
            },
            edgeType: 'bezier',
            allowRotate: false,
            allowResize: false,
            hoverOutline: false,
            hideAnchors: false,
            adjustEdge: true,
            adjustEdgeStartAndEnd: false,
            adjustNodePosition: true,
            nodeTextDraggable: false,
            edgeTextDraggable: false,
        });

        // 注册扩展插件
        this.lf.extension.selectionSelect.openSelectionSelect();
        this.lf.extension.miniMap.show(10, 10);
    }

    // 注册自定义节点
    registerCustomNodes() {
        // 开始节点
        class StartNode extends LogicFlow.RectNode {
            static extendKey = 'StartNode';
            
            getShapeStyle() {
                const style = super.getShapeStyle();
                return {
                    ...style,
                    fill: '#10b981',
                    stroke: '#059669',
                    strokeWidth: 2,
                    rx: 8,
                    ry: 8,
                };
            }

            getTextStyle() {
                const style = super.getTextStyle();
                return {
                    ...style,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold'
                };
            }
        }

        class StartNodeModel extends LogicFlow.RectNodeModel {
            static extendKey = 'StartNode';
            
            constructor(data, graphModel) {
                super(data, graphModel);
                this.text.value = '开始';
                this.width = 80;
                this.height = 40;
            }

            getDefaultAnchor() {
                const { width, height, x, y, id } = this;
                return [
                    {
                        x: x + width / 2,
                        y: y,
                        id: `${id}_right`,
                        type: 'right'
                    }
                ];
            }
        }

        // 结束节点
        class EndNode extends LogicFlow.RectNode {
            static extendKey = 'EndNode';
            
            getShapeStyle() {
                const style = super.getShapeStyle();
                return {
                    ...style,
                    fill: '#ef4444',
                    stroke: '#dc2626',
                    strokeWidth: 2,
                    rx: 8,
                    ry: 8,
                };
            }

            getTextStyle() {
                const style = super.getTextStyle();
                return {
                    ...style,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold'
                };
            }
        }

        class EndNodeModel extends LogicFlow.RectNodeModel {
            static extendKey = 'EndNode';
            
            constructor(data, graphModel) {
                super(data, graphModel);
                this.text.value = '结束';
                this.width = 80;
                this.height = 40;
            }

            getDefaultAnchor() {
                const { width, height, x, y, id } = this;
                return [
                    {
                        x: x - width / 2,
                        y: y,
                        id: `${id}_left`,
                        type: 'left'
                    }
                ];
            }
        }

        // LLM节点
        class LLMNode extends LogicFlow.RectNode {
            static extendKey = 'LLMNode';
            
            getShapeStyle() {
                const style = super.getShapeStyle();
                return {
                    ...style,
                    fill: '#3b82f6',
                    stroke: '#2563eb',
                    strokeWidth: 2,
                    rx: 8,
                    ry: 8,
                };
            }

            getTextStyle() {
                const style = super.getTextStyle();
                return {
                    ...style,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '500'
                };
            }
        }

        class LLMNodeModel extends LogicFlow.RectNodeModel {
            static extendKey = 'LLMNode';
            
            constructor(data, graphModel) {
                super(data, graphModel);
                this.text.value = '大模型';
                this.width = 100;
                this.height = 60;
            }
        }

        // 知识库节点
        class KnowledgeNode extends LogicFlow.RectNode {
            static extendKey = 'KnowledgeNode';
            
            getShapeStyle() {
                const style = super.getShapeStyle();
                return {
                    ...style,
                    fill: '#8b5cf6',
                    stroke: '#7c3aed',
                    strokeWidth: 2,
                    rx: 8,
                    ry: 8,
                };
            }

            getTextStyle() {
                const style = super.getTextStyle();
                return {
                    ...style,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '500'
                };
            }
        }

        class KnowledgeNodeModel extends LogicFlow.RectNodeModel {
            static extendKey = 'KnowledgeNode';
            
            constructor(data, graphModel) {
                super(data, graphModel);
                this.text.value = '知识库';
                this.width = 100;
                this.height = 60;
            }
        }

        // 条件判断节点
        class ConditionNode extends LogicFlow.PolygonNode {
            static extendKey = 'ConditionNode';
            
            getShapeStyle() {
                const style = super.getShapeStyle();
                return {
                    ...style,
                    fill: '#f59e0b',
                    stroke: '#d97706',
                    strokeWidth: 2,
                };
            }

            getTextStyle() {
                const style = super.getTextStyle();
                return {
                    ...style,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '500'
                };
            }
        }

        class ConditionNodeModel extends LogicFlow.PolygonNodeModel {
            static extendKey = 'ConditionNode';
            
            constructor(data, graphModel) {
                super(data, graphModel);
                this.text.value = '条件判断';
                this.width = 100;
                this.height = 60;
                // 创建菱形形状
                this.points = [
                    [50, 0],
                    [100, 30],
                    [50, 60],
                    [0, 30]
                ];
            }
        }

        // API调用节点
        class APINode extends LogicFlow.RectNode {
            static extendKey = 'APINode';
            
            getShapeStyle() {
                const style = super.getShapeStyle();
                return {
                    ...style,
                    fill: '#6366f1',
                    stroke: '#4f46e5',
                    strokeWidth: 2,
                    rx: 8,
                    ry: 8,
                };
            }

            getTextStyle() {
                const style = super.getTextStyle();
                return {
                    ...style,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '500'
                };
            }
        }

        class APINodeModel extends LogicFlow.RectNodeModel {
            static extendKey = 'APINode';
            
            constructor(data, graphModel) {
                super(data, graphModel);
                this.text.value = 'API调用';
                this.width = 100;
                this.height = 60;
            }
        }

        // 注册所有节点
        this.lf.register(StartNode);
        this.lf.register(StartNodeModel);
        this.lf.register(EndNode);
        this.lf.register(EndNodeModel);
        this.lf.register(LLMNode);
        this.lf.register(LLMNodeModel);
        this.lf.register(KnowledgeNode);
        this.lf.register(KnowledgeNodeModel);
        this.lf.register(ConditionNode);
        this.lf.register(ConditionNodeModel);
        this.lf.register(APINode);
        this.lf.register(APINodeModel);
    }

    // 绑定事件
    bindEvents() {
        // 节点拖拽事件
        this.bindDragEvents();
        
        // LogicFlow 事件
        this.lf.on('node:click', (data) => {
            this.selectNode(data.data);
        });

        this.lf.on('blank:click', () => {
            this.unselectNode();
        });

        this.lf.on('node:dnd-add', (data) => {
            this.addLog('info', `已添加节点: ${data.data.text.value}`);
        });

        this.lf.on('node:delete', (data) => {
            this.addLog('warning', `已删除节点: ${data.data.text.value}`);
        });

        this.lf.on('edge:add', (data) => {
            this.addLog('info', '已添加连线');
        });

        this.lf.on('edge:delete', (data) => {
            this.addLog('warning', '已删除连线');
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.currentSelectedNode) {
                this.lf.deleteNode(this.currentSelectedNode.id);
                this.unselectNode();
            }
        });
    }

    // 绑定拖拽事件
    bindDragEvents() {
        const nodeItems = document.querySelectorAll('.node-item');
        nodeItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const nodeType = item.getAttribute('data-type');
                e.dataTransfer.setData('text/plain', nodeType);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
            });
        });

        const graphContainer = document.getElementById('graph');
        graphContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        graphContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const nodeType = e.dataTransfer.getData('text/plain');
            const rect = graphContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 转换为LogicFlow坐标
            const point = this.lf.getPointByClient(x, y);
            
            this.addNodeByType(nodeType, point.x, point.y);
        });
    }

    // 根据类型添加节点
    addNodeByType(type, x, y) {
        const nodeTypeMap = {
            'start': 'StartNode',
            'end': 'EndNode',
            'llm': 'LLMNode',
            'knowledge': 'KnowledgeNode',
            'condition': 'ConditionNode',
            'api': 'APINode',
            'prompt': 'LLMNode',
            'loop': 'ConditionNode',
            'switch': 'ConditionNode',
            'database': 'APINode',
            'file': 'APINode'
        };

        const nodeType = nodeTypeMap[type] || 'LLMNode';
        
        const nodeData = {
            type: nodeType,
            x: x,
            y: y,
            properties: {
                originalType: type,
                config: this.getDefaultNodeConfig(type)
            }
        };

        const node = this.lf.addNode(nodeData);
        
        if (node) {
            this.nodeConfigs.set(node.id, nodeData.properties.config);
            this.addLog('success', `已添加${this.getNodeDisplayName(type)}节点`);
        }
    }

    // 获取默认节点配置
    getDefaultNodeConfig(type) {
        const configs = {
            'start': {
                name: '开始节点',
                description: '工作流的开始节点',
            },
            'end': {
                name: '结束节点',
                description: '工作流的结束节点',
            },
            'llm': {
                name: '大模型节点',
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                maxTokens: 1000,
                systemPrompt: '你是一个有帮助的AI助手',
                userPrompt: '',
            },
            'knowledge': {
                name: '知识库节点',
                knowledgeBase: '',
                searchType: 'semantic',
                topK: 5,
                threshold: 0.7,
            },
            'condition': {
                name: '条件判断节点',
                condition: '',
                trueLabel: '是',
                falseLabel: '否',
            },
            'api': {
                name: 'API调用节点',
                url: '',
                method: 'POST',
                headers: {},
                body: '',
            }
        };

        return configs[type] || configs['llm'];
    }

    // 获取节点显示名称
    getNodeDisplayName(type) {
        const names = {
            'start': '开始',
            'end': '结束',
            'llm': '大模型',
            'knowledge': '知识库',
            'prompt': '提示词',
            'condition': '条件判断',
            'loop': '循环',
            'switch': '分支',
            'api': 'API调用',
            'database': '数据库',
            'file': '文件处理'
        };
        return names[type] || '未知';
    }

    // 选择节点
    selectNode(nodeData) {
        this.currentSelectedNode = nodeData;
        this.showNodeProperties(nodeData);
        this.addLog('info', `已选择节点: ${nodeData.text.value}`);
    }

    // 取消选择节点
    unselectNode() {
        this.currentSelectedNode = null;
        this.hideNodeProperties();
    }

    // 显示节点属性
    showNodeProperties(nodeData) {
        const panel = document.getElementById('propertyPanel');
        const originalType = nodeData.properties?.originalType || 'llm';
        const config = this.nodeConfigs.get(nodeData.id) || this.getDefaultNodeConfig(originalType);

        let html = `
            <div class="fade-in">
                <h4 style="margin-bottom: 16px; color: var(--text-primary);">
                    <i class="fas fa-cog"></i> ${nodeData.text.value} 配置
                </h4>
        `;

        // 根据节点类型显示不同的配置项
        switch (originalType) {
            case 'llm':
            case 'prompt':
                html += this.getLLMConfigHTML(config);
                break;
            case 'knowledge':
                html += this.getKnowledgeConfigHTML(config);
                break;
            case 'condition':
            case 'loop':
            case 'switch':
                html += this.getConditionConfigHTML(config);
                break;
            case 'api':
            case 'database':
            case 'file':
                html += this.getAPIConfigHTML(config);
                break;
            default:
                html += this.getBasicConfigHTML(config);
        }

        html += `
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="app.saveCurrentNodeConfig()">
                        <i class="fas fa-save"></i> 保存配置
                    </button>
                </div>
            </div>
        `;

        panel.innerHTML = html;
    }

    // 获取LLM配置HTML
    getLLMConfigHTML(config) {
        return `
            <div class="form-group">
                <label class="form-label">节点名称</label>
                <input type="text" class="form-input" id="nodeName" value="${config.name || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">模型选择</label>
                <select class="form-select" id="model">
                    <option value="gpt-3.5-turbo" ${config.model === 'gpt-3.5-turbo' ? 'selected' : ''}>GPT-3.5 Turbo</option>
                    <option value="gpt-4" ${config.model === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
                    <option value="claude-3" ${config.model === 'claude-3' ? 'selected' : ''}>Claude-3</option>
                    <option value="qwen-max" ${config.model === 'qwen-max' ? 'selected' : ''}>通义千问</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">温度参数 (${config.temperature || 0.7})</label>
                <input type="range" class="form-input" id="temperature" min="0" max="1" step="0.1" value="${config.temperature || 0.7}">
            </div>
            <div class="form-group">
                <label class="form-label">最大Token数</label>
                <input type="number" class="form-input" id="maxTokens" value="${config.maxTokens || 1000}">
            </div>
            <div class="form-group">
                <label class="form-label">系统提示词</label>
                <textarea class="form-textarea" id="systemPrompt" placeholder="定义AI的角色和行为...">${config.systemPrompt || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">用户提示词</label>
                <textarea class="form-textarea" id="userPrompt" placeholder="输入用户的具体指令...">${config.userPrompt || ''}</textarea>
            </div>
        `;
    }

    // 获取知识库配置HTML
    getKnowledgeConfigHTML(config) {
        return `
            <div class="form-group">
                <label class="form-label">节点名称</label>
                <input type="text" class="form-input" id="nodeName" value="${config.name || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">知识库选择</label>
                <select class="form-select" id="knowledgeBase">
                    <option value="">请选择知识库</option>
                    <option value="kb1" ${config.knowledgeBase === 'kb1' ? 'selected' : ''}>产品知识库</option>
                    <option value="kb2" ${config.knowledgeBase === 'kb2' ? 'selected' : ''}>技术文档库</option>
                    <option value="kb3" ${config.knowledgeBase === 'kb3' ? 'selected' : ''}>FAQ知识库</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">搜索类型</label>
                <select class="form-select" id="searchType">
                    <option value="semantic" ${config.searchType === 'semantic' ? 'selected' : ''}>语义搜索</option>
                    <option value="keyword" ${config.searchType === 'keyword' ? 'selected' : ''}>关键词搜索</option>
                    <option value="hybrid" ${config.searchType === 'hybrid' ? 'selected' : ''}>混合搜索</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">返回条数</label>
                <input type="number" class="form-input" id="topK" value="${config.topK || 5}" min="1" max="20">
            </div>
            <div class="form-group">
                <label class="form-label">相似度阈值</label>
                <input type="range" class="form-input" id="threshold" min="0" max="1" step="0.1" value="${config.threshold || 0.7}">
            </div>
        `;
    }

    // 获取条件判断配置HTML
    getConditionConfigHTML(config) {
        return `
            <div class="form-group">
                <label class="form-label">节点名称</label>
                <input type="text" class="form-input" id="nodeName" value="${config.name || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">判断条件</label>
                <textarea class="form-textarea" id="condition" placeholder="例如: {input}.length > 10">${config.condition || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">真值标签</label>
                <input type="text" class="form-input" id="trueLabel" value="${config.trueLabel || '是'}">
            </div>
            <div class="form-group">
                <label class="form-label">假值标签</label>
                <input type="text" class="form-input" id="falseLabel" value="${config.falseLabel || '否'}">
            </div>
        `;
    }

    // 获取API配置HTML
    getAPIConfigHTML(config) {
        return `
            <div class="form-group">
                <label class="form-label">节点名称</label>
                <input type="text" class="form-input" id="nodeName" value="${config.name || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">API地址</label>
                <input type="url" class="form-input" id="apiUrl" value="${config.url || ''}" placeholder="https://api.example.com/endpoint">
            </div>
            <div class="form-group">
                <label class="form-label">请求方法</label>
                <select class="form-select" id="method">
                    <option value="GET" ${config.method === 'GET' ? 'selected' : ''}>GET</option>
                    <option value="POST" ${config.method === 'POST' ? 'selected' : ''}>POST</option>
                    <option value="PUT" ${config.method === 'PUT' ? 'selected' : ''}>PUT</option>
                    <option value="DELETE" ${config.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">请求头 (JSON格式)</label>
                <textarea class="form-textarea" id="headers" placeholder='{"Content-Type": "application/json"}'>${JSON.stringify(config.headers || {}, null, 2)}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">请求体</label>
                <textarea class="form-textarea" id="body" placeholder="请求数据...">${config.body || ''}</textarea>
            </div>
        `;
    }

    // 获取基础配置HTML
    getBasicConfigHTML(config) {
        return `
            <div class="form-group">
                <label class="form-label">节点名称</label>
                <input type="text" class="form-input" id="nodeName" value="${config.name || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">描述</label>
                <textarea class="form-textarea" id="description" placeholder="节点功能描述...">${config.description || ''}</textarea>
            </div>
        `;
    }

    // 隐藏节点属性
    hideNodeProperties() {
        const panel = document.getElementById('propertyPanel');
        panel.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-mouse-pointer"></i>
                <p>选择一个节点来配置属性</p>
            </div>
        `;
    }

    // 保存当前节点配置
    saveCurrentNodeConfig() {
        if (!this.currentSelectedNode) return;

        const config = {};
        const originalType = this.currentSelectedNode.properties?.originalType || 'llm';

        // 获取通用配置
        const nameInput = document.getElementById('nodeName');
        if (nameInput) config.name = nameInput.value;

        // 根据节点类型获取特定配置
        switch (originalType) {
            case 'llm':
            case 'prompt':
                config.model = document.getElementById('model')?.value || 'gpt-3.5-turbo';
                config.temperature = parseFloat(document.getElementById('temperature')?.value || 0.7);
                config.maxTokens = parseInt(document.getElementById('maxTokens')?.value || 1000);
                config.systemPrompt = document.getElementById('systemPrompt')?.value || '';
                config.userPrompt = document.getElementById('userPrompt')?.value || '';
                break;
            case 'knowledge':
                config.knowledgeBase = document.getElementById('knowledgeBase')?.value || '';
                config.searchType = document.getElementById('searchType')?.value || 'semantic';
                config.topK = parseInt(document.getElementById('topK')?.value || 5);
                config.threshold = parseFloat(document.getElementById('threshold')?.value || 0.7);
                break;
            case 'condition':
            case 'loop':
            case 'switch':
                config.condition = document.getElementById('condition')?.value || '';
                config.trueLabel = document.getElementById('trueLabel')?.value || '是';
                config.falseLabel = document.getElementById('falseLabel')?.value || '否';
                break;
            case 'api':
            case 'database':
            case 'file':
                config.url = document.getElementById('apiUrl')?.value || '';
                config.method = document.getElementById('method')?.value || 'POST';
                try {
                    config.headers = JSON.parse(document.getElementById('headers')?.value || '{}');
                } catch (e) {
                    config.headers = {};
                }
                config.body = document.getElementById('body')?.value || '';
                break;
        }

        // 保存配置
        this.nodeConfigs.set(this.currentSelectedNode.id, config);

        // 更新节点显示名称
        if (config.name) {
            this.lf.updateText(this.currentSelectedNode.id, config.name);
        }

        this.addLog('success', '节点配置已保存');
    }

    // 添加日志
    addLog(level, message) {
        const logContent = document.querySelector('.log-content');
        const time = new Date().toLocaleTimeString();
        
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <span class="log-time">[${time}]</span>
            <span class="log-level ${level}">${level.toUpperCase()}</span>
            <span class="log-message">${message}</span>
        `;
        
        logContent.appendChild(logItem);
        logContent.scrollTop = logContent.scrollHeight;
    }

    // 运行工作流
    runWorkflow() {
        const graphData = this.lf.getGraphData();
        
        if (!graphData.nodes || graphData.nodes.length === 0) {
            this.addLog('warning', '工作流为空，请添加节点后再运行');
            return;
        }

        this.addLog('info', '开始运行工作流...');
        
        // 模拟工作流运行
        let step = 1;
        graphData.nodes.forEach((node, index) => {
            setTimeout(() => {
                this.addLog('info', `第${step}步: 执行${node.text.value}节点`);
                step++;
                
                if (index === graphData.nodes.length - 1) {
                    this.addLog('success', '工作流运行完成！');
                }
            }, (index + 1) * 1000);
        });
    }

    // 保存工作流
    saveWorkflow() {
        const graphData = this.lf.getGraphData();
        const workflowData = {
            nodes: graphData.nodes,
            edges: graphData.edges,
            configs: Object.fromEntries(this.nodeConfigs)
        };
        
        localStorage.setItem('workflow', JSON.stringify(workflowData));
        this.addLog('success', '工作流已保存到本地');
    }

    // 加载工作流
    loadWorkflow() {
        const savedData = localStorage.getItem('workflow');
        if (savedData) {
            try {
                const workflowData = JSON.parse(savedData);
                this.lf.render(workflowData);
                
                // 恢复节点配置
                if (workflowData.configs) {
                    this.nodeConfigs = new Map(Object.entries(workflowData.configs));
                }
                
                this.addLog('success', '工作流已从本地加载');
            } catch (e) {
                this.addLog('error', '加载工作流失败: ' + e.message);
            }
        }
    }

    // 清空工作流
    clearWorkflow() {
        if (confirm('确定要清空当前工作流吗？')) {
            this.lf.clearData();
            this.nodeConfigs.clear();
            this.unselectNode();
            this.addLog('warning', '工作流已清空');
        }
    }

    // 缩放控制
    zoomIn() {
        this.lf.zoom(true);
    }

    zoomOut() {
        this.lf.zoom(false);
    }

    resetZoom() {
        this.lf.resetZoom();
    }

    fitView() {
        this.lf.fitView();
    }

    // 切换小地图
    toggleMiniMap() {
        // LogicFlow 小地图功能
        this.addLog('info', '小地图功能已切换');
    }

    // 切换底部面板
    toggleBottomPanel() {
        const panel = document.getElementById('bottomPanel');
        const button = panel.querySelector('.panel-header button i');
        
        this.isBottomPanelCollapsed = !this.isBottomPanelCollapsed;
        
        if (this.isBottomPanelCollapsed) {
            panel.classList.add('collapsed');
            button.className = 'fas fa-chevron-up';
        } else {
            panel.classList.remove('collapsed');
            button.className = 'fas fa-chevron-down';
        }
    }
}

// 工具栏功能函数
function runWorkflow() {
    app.runWorkflow();
}

function saveWorkflow() {
    app.saveWorkflow();
}

function clearWorkflow() {
    app.clearWorkflow();
}

function toggleMiniMap() {
    app.toggleMiniMap();
}

function fitView() {
    app.fitView();
}

function zoomIn() {
    app.zoomIn();
}

function zoomOut() {
    app.zoomOut();
}

function resetZoom() {
    app.resetZoom();
}

function toggleBottomPanel() {
    app.toggleBottomPanel();
}

// 应用实例
let app;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app = new LLMWorkflowApp();
    
    // 尝试加载之前保存的工作流
    setTimeout(() => {
        app.loadWorkflow();
    }, 1000);
});