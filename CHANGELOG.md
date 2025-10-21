# 更新日志

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2025-10-21

### 新增
- ✨ Markdown 文件实时预览功能
- 🎨 美观的 GitHub 风格样式
- 💻 代码语法高亮支持（基于 highlight.js）
- 🔄 实时渲染，修改文件无需重启服务器
- 🔒 路径安全检查，防止目录遍历攻击
- 🐳 Docker 容器化支持
- 📦 Docker Hub 镜像发布 (`cklx0719/markdown-live-preview`)
- 🗂️ 支持多层级目录结构
- 🚀 零配置，开箱即用
- 📝 完整的文档体系（README、快速入门、Docker 指南等）
- 🛠️ Windows 和 Linux/macOS 启动脚本

### 功能特性
- URL 路径直接映射到 Markdown 文件，无需 `.md` 或 `.html` 后缀
- 支持标准 Markdown 和 GitHub Flavored Markdown (GFM)
- 支持代码块、表格、列表、引用等所有 Markdown 语法
- Docker 目录映射，文件修改实时同步
- 自动创建文档根目录
- 友好的 404 和错误页面

### 技术栈
- Node.js 18 (Alpine Linux)
- Express.js 4.x
- Marked 11.x (Markdown 解析)
- Highlight.js 11.x (代码高亮)
- Docker & Docker Compose

### 文档
- 📖 完整的 README 文档
- 🚀 快速入门指南 (QUICKSTART.md)
- 🐳 Docker 详细指南 (DOCKER.md)
- 🐋 Docker Hub 使用说明 (DOCKER_HUB.md)

[1.0.0]: https://github.com/cklx0719/markdown-live-preview/releases/tag/v1.0.0
