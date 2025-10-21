# Markdown 实时预览服务器

一个简洁的 Node.js 服务器，可以将 Markdown 文件实时渲染为网页。

> 🚀 **快速入门**：查看 [QUICKSTART.md](QUICKSTART.md) 获取 3 分钟快速上手指南！

## 📦 Docker Hub 镜像

**Docker Hub**：[cklx0719/markdown-live-preview](https://hub.docker.com/r/cklx0719/markdown-live-preview)

```bash
# 直接使用 Docker Hub 镜像启动
docker run -d -p 3000:3000 -v $(pwd)/docs:/app/docs cklx0719/markdown-live-preview:latest
```

> 🐳 **Docker Hub 使用说明**：查看 [DOCKER_HUB.md](DOCKER_HUB.md) 获取完整的镜像使用指南。

## ✨ 特性

- 📝 自动将 Markdown 转换为 HTML
- 🎨 美观的 GitHub 风格样式
- 💻 代码高亮支持
- 🔄 实时渲染，无需重启
- 🚀 零配置，开箱即用
- 🔒 路径安全检查
- 🐳 Docker 容器化部署

## 🚀 快速开始

> 📚 **Docker 详细使用指南**：查看 [DOCKER.md](DOCKER.md) 获取完整的 Docker 部署、故障排查和优化指南。

### 使用启动脚本（最简单）

**Windows**：
```powershell
.\start.ps1
```

**Linux/macOS**：
```bash
chmod +x start.sh
./start.sh
```

脚本会自动检查环境并提供交互式菜单。

### 方式一：使用 Docker（推荐）

#### 1. 使用 Docker Compose 启动

```bash
docker-compose up -d
```

#### 2. 查看运行状态

```bash
docker-compose ps
```

#### 3. 查看日志

```bash
docker-compose logs -f
```

#### 4. 停止服务

```bash
docker-compose down
```

#### 5. 使用说明

- Markdown 文件放入 `docs` 目录（会自动映射到容器内）
- 访问 `http://localhost:3000/文件路径`
- 例如：`http://localhost:3000/pm/20251020`

### 方式二：本地 Node.js 运行

#### 1. 安装依赖

```bash
npm install
```

#### 2. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

#### 3. 使用

1. 将 Markdown 文件放入 `docs` 目录（服务器启动时会自动创建）
2. 通过浏览器访问对应路径

## 📖 使用示例

假设你的目录结构如下：

```
docs/
├── pm/
│   └── 20251020.md
├── blog/
│   └── article.md
└── README.md
```

访问方式：

- `http://localhost:3000/pm/20251020` → 渲染 `docs/pm/20251020.md`
- `http://localhost:3000/blog/article` → 渲染 `docs/blog/article.md`
- `http://localhost:3000/README` → 渲染 `docs/README.md`

**注意：** URL 中不需要添加 `.md` 扩展名，服务器会自动处理。

## 🛠️ 配置

### 修改端口

**Docker Compose 方式**：

编辑 `docker-compose.yml`：

```yaml
ports:
  - "8080:3000"  # 将宿主机 8080 端口映射到容器 3000 端口
```

**本地运行方式**：

在 `server.js` 中修改 `PORT` 变量，或设置环境变量：

```bash
PORT=8080 npm start
```

### 修改根目录

在 `server.js` 中修改 `MARKDOWN_ROOT` 变量：

```javascript
const MARKDOWN_ROOT = path.join(__dirname, 'docs');
```

## 🐳 Docker 部署

### 本地构建和调试

#### 1. 构建镜像

```bash
docker build -t markdown-live-preview .
```

#### 2. 运行容器

**Linux/macOS**：

```bash
docker run -d \
  --name markdown-server \
  -p 3000:3000 \
  -v $(pwd)/docs:/app/docs \
  markdown-live-preview
```

**Windows PowerShell**：

```powershell
docker run -d `
  --name markdown-server `
  -p 3000:3000 `
  -v ${PWD}/docs:/app/docs `
  markdown-live-preview
```

#### 3. 使用 Docker Compose（推荐）

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down
```

### 目录映射说明

- **容器内路径**：`/app/docs`
- **宿主机路径**：`./docs`（项目根目录下的 docs 文件夹）

这意味着：
- 你在宿主机 `docs` 目录中添加/修改的文件，会立即同步到容器内
- 无需重启容器，直接刷新浏览器即可看到更新

### 生产环境部署

#### 使用 Docker Compose 在服务器上

1. 将项目文件上传到服务器：
   ```bash
   # 仅需要上传这些文件
   - server.js
   - package.json
   - Dockerfile
   - docker-compose.yml
   - docs/ 目录
   ```

2. 在服务器上构建和启动：
   ```bash
   docker-compose up -d
   ```

#### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name xxx.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

配置好 Nginx 后，就可以通过 `http://xxx.com/pm/20251020` 访问你的 Markdown 文件了！

## 👨‍💻 使用 PM2 部署（可选）

如果不使用 Docker，也可以使用 PM2 直接运行：

```bash
npm install -g pm2
pm2 start server.js --name markdown-server
pm2 save
pm2 startup
```

## 📦 依赖

- **express** - Web 服务器框架
- **marked** - Markdown 解析器
- **highlight.js** - 代码高亮

## 🔐 安全特性

- 路径遍历保护
- 文件访问限制在 `docs` 目录内
- 自动路径规范化

## 📝 Markdown 支持

支持标准的 Markdown 语法和 GitHub Flavored Markdown (GFM)：

- ✅ 标题
- ✅ 列表
- ✅ 代码块和行内代码
- ✅ 表格
- ✅ 链接和图片
- ✅ 引用
- ✅ 分割线
- ✅ 粗体、斜体等文本格式

## 📄 许可证

MIT
