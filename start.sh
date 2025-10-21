#!/bin/bash

# Markdown Live Preview - 启动脚本

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║   📝 Markdown 实时预览服务器                            ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    echo "📖 访问: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 服务未运行，请启动 Docker Desktop 或 Docker 服务"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# 确保 docs 目录存在
if [ ! -d "docs" ]; then
    mkdir -p docs
    echo "✅ 创建 docs 目录"
fi

# 选择启动方式
echo "请选择启动方式:"
echo "1) 使用 Docker Compose 启动（推荐）"
echo "2) 使用 Node.js 本地启动"
echo "3) 仅构建 Docker 镜像"
echo "4) 停止服务"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 使用 Docker Compose 启动服务..."
        docker-compose up -d
        echo ""
        echo "✅ 服务已启动！"
        echo "📍 访问地址: http://localhost:3000"
        echo "📝 示例文档: http://localhost:3000/pm/20251020"
        echo ""
        echo "📊 查看日志: docker-compose logs -f"
        echo "🛑 停止服务: docker-compose down"
        ;;
    2)
        echo ""
        echo "🚀 使用 Node.js 本地启动服务..."
        if [ ! -d "node_modules" ]; then
            echo "📦 安装依赖..."
            npm install
        fi
        echo "🎯 启动服务器..."
        npm start
        ;;
    3)
        echo ""
        echo "🔨 构建 Docker 镜像..."
        docker build -t markdown-live-preview .
        echo ""
        echo "✅ 镜像构建完成！"
        echo "▶️  运行容器: docker run -d -p 3000:3000 -v \$(pwd)/docs:/app/docs markdown-live-preview"
        ;;
    4)
        echo ""
        echo "🛑 停止服务..."
        docker-compose down
        echo "✅ 服务已停止"
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac
