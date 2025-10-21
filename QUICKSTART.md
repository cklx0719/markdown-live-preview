# 快速入门指南 🚀

## 3 分钟快速上手

### 第一步：启动服务

**Windows 用户**：
```powershell
.\start.ps1
```
选择选项 `1` - 使用 Docker Compose 启动

**Linux/macOS 用户**：
```bash
chmod +x start.sh
./start.sh
```
选择选项 `1` - 使用 Docker Compose 启动

> 💡 如果没有安装 Docker，请先安装 [Docker Desktop](https://docs.docker.com/get-docker/)

### 第二步：添加 Markdown 文件

在 `docs` 目录下创建你的 Markdown 文件：

```bash
docs/
└── my-first-doc.md
```

在 `my-first-doc.md` 中写入内容：

```markdown
# 我的第一篇文档

这是一个测试文档。

## 功能特性

- 支持 Markdown 语法
- 代码高亮
- 美观的样式

## 代码示例

```javascript
console.log('Hello, World!');
```

**粗体文本** 和 *斜体文本*
```

### 第三步：访问网页

打开浏览器，访问：
```
http://localhost:3000/my-first-doc
```

就这么简单！🎉

## 进阶使用

### 创建多级目录

```bash
docs/
├── pm/
│   └── weekly-report.md
├── tech/
│   ├── nodejs.md
│   └── docker.md
└── notes/
    └── ideas.md
```

访问路径：
- `http://localhost:3000/pm/weekly-report`
- `http://localhost:3000/tech/nodejs`
- `http://localhost:3000/tech/docker`
- `http://localhost:3000/notes/ideas`

### 常用命令

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down
```

## 生产环境部署

### 方式一：使用 Nginx 反向代理

1. 在服务器上启动服务：
   ```bash
   docker-compose up -d
   ```

2. 配置 Nginx（`/etc/nginx/sites-available/markdown`）：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. 启用配置：
   ```bash
   sudo ln -s /etc/nginx/sites-available/markdown /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

现在可以通过 `http://your-domain.com/your-doc` 访问！

### 方式二：修改端口

如果想在不同端口运行，编辑 `docker-compose.yml`：

```yaml
ports:
  - "8080:3000"  # 使用 8080 端口
```

## 故障排查

### 问题：Docker 无法启动

**解决方案**：
1. 确保 Docker Desktop 正在运行
2. 检查端口 3000 是否被占用：
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

### 问题：文件更新不生效

**解决方案**：
1. 刷新浏览器（Ctrl+F5 强制刷新）
2. 检查文件路径是否正确
3. 查看容器日志：`docker-compose logs -f`

### 问题：访问显示 404

**解决方案**：
1. 确认文件存在于 `docs` 目录
2. 检查 URL 路径是否与文件路径匹配
3. 注意文件名大小写（Linux 服务器区分大小写）

## 更多帮助

- 📖 [完整文档](README.md)
- 🐳 [Docker 详细指南](DOCKER.md)
- 📁 [项目结构说明](PROJECT_STRUCTURE.md)

## 示例截图说明

访问 `http://localhost:3000/pm/20251020` 会看到：

```
┌─────────────────────────────────────────────────┐
│ 📄 20251020.md                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ # 项目管理文档                                   │
│                                                 │
│ ## 2025年10月20日                               │
│                                                 │
│ ### 今日任务                                     │
│                                                 │
│ 1. ✅ 完成项目初始化                            │
│ 2. ✅ 搭建基础架构                              │
│ 3. 🔄 进行功能测试                              │
│                                                 │
│ （带有代码高亮、表格、列表等完整样式）           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 开始使用

现在就运行 `.\start.ps1`（Windows）或 `./start.sh`（Linux/Mac）开始吧！
