# Docker 部署快速指南

## 前置要求

1. 安装 Docker Desktop（Windows/Mac）或 Docker Engine（Linux）
2. 确保 Docker 服务正在运行

### 检查 Docker 是否运行

```bash
docker --version
docker-compose --version
```

## 快速开始

### 1. 启动服务

```bash
# 构建并启动服务（首次运行）
docker-compose up -d

# 如果只是重启服务（已构建过）
docker-compose restart
```

### 2. 查看服务状态

```bash
# 查看运行状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail=100
```

### 3. 管理服务

```bash
# 停止服务（保留容器）
docker-compose stop

# 启动已停止的服务
docker-compose start

# 停止并删除容器
docker-compose down

# 停止并删除容器、网络、镜像
docker-compose down --rmi all
```

### 4. 重新构建

当你修改了代码（如 `server.js`）后：

```bash
# 重新构建并启动
docker-compose up -d --build

# 或者分步执行
docker-compose build
docker-compose up -d
```

## 访问服务

服务启动后，访问：
- **本地访问**：`http://localhost:3000`
- **示例文档**：`http://localhost:3000/pm/20251020`

## 文件管理

### 添加新文档

只需将 Markdown 文件放入 `docs` 目录：

```bash
docs/
├── pm/
│   ├── 20251020.md
│   └── 20251021.md    # 新文件
├── blog/
│   └── article.md
```

无需重启容器，直接访问：`http://localhost:3000/pm/20251021`

### 目录结构

```
项目根目录/
├── docs/              # Markdown 文件目录（映射到容器）
├── server.js          # 服务器代码
├── package.json       # 依赖配置
├── Dockerfile         # Docker 镜像配置
└── docker-compose.yml # Docker Compose 配置
```

## 修改端口

编辑 `docker-compose.yml`：

```yaml
ports:
  - "8080:3000"  # 改为宿主机 8080 端口
```

然后重启服务：

```bash
docker-compose down
docker-compose up -d
```

## 故障排查

### 1. 端口被占用

```bash
# Windows 查看端口占用
netstat -ano | findstr :3000

# 修改 docker-compose.yml 中的端口映射
ports:
  - "3001:3000"  # 使用其他端口
```

### 2. 容器无法启动

```bash
# 查看详细日志
docker-compose logs markdown-server

# 查看容器状态
docker ps -a

# 删除旧容器重新创建
docker-compose down
docker-compose up -d
```

### 3. 文件映射不生效

```bash
# 确认 docs 目录存在
ls docs

# Windows 确保 Docker Desktop 有文件共享权限
# 设置 -> Resources -> File Sharing -> 添加项目路径
```

### 4. 重置所有内容

```bash
# 停止并删除所有内容
docker-compose down -v --rmi all

# 重新构建
docker-compose up -d --build
```

## 生产环境部署

### 服务器部署步骤

1. **上传文件到服务器**

```bash
# 需要上传的文件
server.js
package.json
Dockerfile
docker-compose.yml
docs/  # 你的 Markdown 文件
```

2. **在服务器上构建和运行**

```bash
# SSH 登录服务器
ssh user@your-server.com

# 进入项目目录
cd /path/to/project

# 启动服务
docker-compose up -d
```

3. **配置 Nginx 反向代理**

创建 Nginx 配置文件 `/etc/nginx/sites-available/markdown`:

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

4. **配置 SSL（可选但推荐）**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 性能优化

### 1. 限制容器资源

编辑 `docker-compose.yml`：

```yaml
services:
  markdown-server:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

### 2. 使用多阶段构建（高级）

如需优化镜像大小，可以修改 `Dockerfile` 使用多阶段构建。

## 常用命令速查

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 重新构建
docker-compose up -d --build

# 进入容器
docker-compose exec markdown-server sh

# 查看容器状态
docker-compose ps
```

## 更多信息

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
