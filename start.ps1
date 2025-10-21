# Markdown Live Preview - 启动脚本 (Windows)

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║   📝 Markdown 实时预览服务器                            ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 检查 Docker 是否安装
try {
    docker --version | Out-Null
    Write-Host "✅ Docker 已安装" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker 未安装，请先安装 Docker Desktop" -ForegroundColor Red
    Write-Host "📖 访问: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Yellow
    exit 1
}

# 检查 Docker 是否运行
try {
    docker info | Out-Null
    Write-Host "✅ Docker 服务正在运行" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker 服务未运行，请启动 Docker Desktop" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 确保 docs 目录存在
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" | Out-Null
    Write-Host "✅ 创建 docs 目录" -ForegroundColor Green
}

# 选择启动方式
Write-Host "请选择启动方式:" -ForegroundColor Yellow
Write-Host "1) 使用 Docker Compose 启动（推荐）"
Write-Host "2) 使用 Node.js 本地启动"
Write-Host "3) 仅构建 Docker 镜像"
Write-Host "4) 停止服务"
Write-Host "5) 查看服务日志"
Write-Host ""
$choice = Read-Host "请输入选项 (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 使用 Docker Compose 启动服务..." -ForegroundColor Cyan
        docker-compose up -d
        Write-Host ""
        Write-Host "✅ 服务已启动！" -ForegroundColor Green
        Write-Host "📍 访问地址: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "📝 示例文档: http://localhost:3000/pm/20251020" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 常用命令:" -ForegroundColor Cyan
        Write-Host "   查看日志: docker-compose logs -f"
        Write-Host "   停止服务: docker-compose down"
        Write-Host "   重启服务: docker-compose restart"
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 使用 Node.js 本地启动服务..." -ForegroundColor Cyan
        if (-not (Test-Path "node_modules")) {
            Write-Host "📦 安装依赖..." -ForegroundColor Yellow
            npm install
        }
        Write-Host "🎯 启动服务器..." -ForegroundColor Cyan
        npm start
    }
    "3" {
        Write-Host ""
        Write-Host "🔨 构建 Docker 镜像..." -ForegroundColor Cyan
        docker build -t markdown-live-preview .
        Write-Host ""
        Write-Host "✅ 镜像构建完成！" -ForegroundColor Green
        Write-Host "▶️  运行容器命令:" -ForegroundColor Yellow
        Write-Host "   docker run -d -p 3000:3000 -v `${PWD}/docs:/app/docs markdown-live-preview"
    }
    "4" {
        Write-Host ""
        Write-Host "🛑 停止服务..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ 服务已停止" -ForegroundColor Green
    }
    "5" {
        Write-Host ""
        Write-Host "📊 查看服务日志..." -ForegroundColor Cyan
        docker-compose logs -f
    }
    default {
        Write-Host "❌ 无效选项" -ForegroundColor Red
        exit 1
    }
}
