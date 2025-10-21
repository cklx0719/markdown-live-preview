# Docker Hub 镜像使用说明

## 📦 镜像信息

- **Docker Hub 仓库**：[cklx0719/markdown-live-preview](https://hub.docker.com/r/cklx0719/markdown-live-preview)
- **最新版本**：`cklx0719/markdown-live-preview:latest`
- **稳定版本**：`cklx0719/markdown-live-preview:1.0.0`
- **镜像大小**：约 150MB（基于 node:18-alpine）

## 🚀 快速使用

### 方式一：使用 Docker Compose（推荐）

项目已配置为直接从 Docker Hub 拉取镜像：

```bash
# 直接启动（会自动拉取镜像）
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方式二：直接使用 Docker 命令

**Windows PowerShell**：
```powershell
docker run -d `
  --name markdown-server `
  -p 3000:3000 `
  -v ${PWD}/docs:/app/docs `
  cklx0719/markdown-live-preview:latest
```

**Linux/macOS**：
```bash
docker run -d \
  --name markdown-server \
  -p 3000:3000 \
  -v $(pwd)/docs:/app/docs \
  cklx0719/markdown-live-preview:latest
```

## 📖 使用步骤

### 1. 创建文档目录

在任意位置创建一个目录来存放你的 Markdown 文件：

```bash
mkdir markdown-docs
cd markdown-docs
mkdir -p docs/pm
```

### 2. 添加 Markdown 文件

在 `docs` 目录下创建 Markdown 文件：

```bash
# 创建示例文档
echo "# 我的第一篇文档\n\n这是一个测试。" > docs/test.md
echo "# 项目管理\n\n## 进度报告" > docs/pm/report.md
```

### 3. 启动容器

```bash
docker run -d \
  --name markdown-server \
  -p 3000:3000 \
  -v $(pwd)/docs:/app/docs \
  cklx0719/markdown-live-preview:latest
```

### 4. 访问网页

打开浏览器访问：
- `http://localhost:3000/test`
- `http://localhost:3000/pm/report`

## 🌐 生产环境部署

### 在任何服务器上部署

#### 1. 创建项目目录

```bash
mkdir -p /var/www/markdown-server/docs
cd /var/www/markdown-server
```

#### 2. 创建 docker-compose.yml

```yaml
services:
  markdown-server:
    image: cklx0719/markdown-live-preview:latest
    container_name: markdown-live-preview
    ports:
      - "3000:3000"
    volumes:
      - ./docs:/app/docs
    environment:
      - PORT=3000
      - NODE_ENV=production
    restart: unless-stopped
```

#### 3. 启动服务

```bash
docker-compose up -d
```

#### 4. 配置 Nginx 反向代理

创建 `/etc/nginx/sites-available/markdown`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

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

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/markdown /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. 配置 SSL（推荐）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

现在访问：`https://your-domain.com/your-doc`

## 🔄 版本管理

### 使用特定版本

```bash
# 使用 1.0.0 版本
docker run -d \
  --name markdown-server \
  -p 3000:3000 \
  -v $(pwd)/docs:/app/docs \
  cklx0719/markdown-live-preview:1.0.0
```

### 更新到最新版本

```bash
# 停止并删除旧容器
docker-compose down

# 拉取最新镜像
docker-compose pull

# 启动新容器
docker-compose up -d
```

或者使用 Docker 命令：

```bash
# 拉取最新镜像
docker pull cklx0719/markdown-live-preview:latest

# 停止并删除旧容器
docker stop markdown-server
docker rm markdown-server

# 启动新容器
docker run -d \
  --name markdown-server \
  -p 3000:3000 \
  -v $(pwd)/docs:/app/docs \
  cklx0719/markdown-live-preview:latest
```

## 🛠️ 本地构建

如果你想在本地构建镜像：

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/markdown-live-preview.git
cd markdown-live-preview
```

### 2. 构建镜像

```bash
docker build -t cklx0719/markdown-live-preview:latest .
```

### 3. 推送到 Docker Hub（需要登录）

```bash
# 登录 Docker Hub
docker login

# 推送镜像
docker push cklx0719/markdown-live-preview:latest
```

### 4. 修改 docker-compose.yml 使用本地构建

编辑 `docker-compose.yml`，注释 `image` 并取消注释 `build`：

```yaml
services:
  markdown-server:
    # image: cklx0719/markdown-live-preview:latest
    build: .
    # ... 其他配置
```

然后运行：

```bash
docker-compose up -d --build
```

## 🎯 镜像特性

- ✅ **轻量级**：基于 Alpine Linux，镜像仅约 150MB
- ✅ **安全**：最小化依赖，减少攻击面
- ✅ **高效**：使用 Node.js 18 LTS
- ✅ **生产就绪**：优化的生产环境配置
- ✅ **自动重启**：配置了 `restart: unless-stopped`

## 📊 目录映射说明

| 容器内路径 | 宿主机路径 | 说明 |
|-----------|-----------|------|
| `/app/docs` | `./docs` | Markdown 文件存放目录 |

文件映射特性：
- ✅ 在宿主机 `docs` 目录添加/修改文件，容器内立即生效
- ✅ 无需重启容器
- ✅ 支持子目录结构

## 🔧 环境变量

| 变量名 | 默认值 | 说明 |
|-------|-------|------|
| `PORT` | `3000` | 服务监听端口 |
| `NODE_ENV` | `production` | Node.js 运行模式 |

修改端口示例：

```yaml
environment:
  - PORT=8080
  - NODE_ENV=production
ports:
  - "8080:8080"  # 注意同步修改端口映射
```

## 📝 URL 路径映射

| 文件路径 | URL 访问 |
|---------|---------|
| `docs/README.md` | `/README` |
| `docs/pm/20251020.md` | `/pm/20251020` |
| `docs/blog/tech/article.md` | `/blog/tech/article` |

**规则**：
- URL 中可省略 `.md` 扩展名
- 支持多层目录
- 大小写敏感（Linux 服务器）

## 🐛 故障排查

### 镜像拉取失败

如果网络问题导致拉取失败，可以配置 Docker 代理：

**Windows Docker Desktop**：
1. 打开 Docker Desktop
2. 设置 -> Resources -> Proxies
3. 启用 Manual proxy configuration
4. 设置代理地址

**Linux**：
编辑 `/etc/docker/daemon.json`：

```json
{
  "proxies": {
    "http-proxy": "http://proxy.example.com:8080",
    "https-proxy": "http://proxy.example.com:8080"
  }
}
```

重启 Docker：
```bash
sudo systemctl restart docker
```

### 容器无法访问

检查端口是否正确映射：

```bash
docker ps
docker logs markdown-server
```

### 文件更新不生效

1. 确认目录映射正确：
   ```bash
   docker inspect markdown-server | grep Mounts -A 10
   ```

2. 强制刷新浏览器（Ctrl+F5）

## 📚 相关文档

- 📖 [项目主文档](README.md)
- 🚀 [快速入门指南](QUICKSTART.md)
- 🐳 [Docker 详细指南](DOCKER.md)
- 📁 [项目结构说明](PROJECT_STRUCTURE.md)

## 🔗 相关链接

- **Docker Hub**：https://hub.docker.com/r/cklx0719/markdown-live-preview
- **GitHub**：（添加你的 GitHub 仓库地址）

## 📄 许可证

MIT License

---

**享受使用 Markdown 实时预览服务器！** 🎉
