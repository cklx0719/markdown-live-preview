const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置 Markdown 根目录
const MARKDOWN_ROOT = path.join(__dirname, 'docs');

// 配置 marked 使用 highlight.js 进行代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error(err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// HTML 模板
function generateHTML(content, title) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            line-height: 1.6;
            color: #333;
            background-color: #f6f8fa;
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .markdown-body {
            font-size: 16px;
        }
        
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4,
        .markdown-body h5,
        .markdown-body h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
            color: #1f2328;
        }
        
        .markdown-body h1 {
            font-size: 2em;
            border-bottom: 1px solid #d8dee4;
            padding-bottom: 0.3em;
        }
        
        .markdown-body h2 {
            font-size: 1.5em;
            border-bottom: 1px solid #d8dee4;
            padding-bottom: 0.3em;
        }
        
        .markdown-body h3 {
            font-size: 1.25em;
        }
        
        .markdown-body p {
            margin-bottom: 16px;
        }
        
        .markdown-body a {
            color: #0969da;
            text-decoration: none;
        }
        
        .markdown-body a:hover {
            text-decoration: underline;
        }
        
        .markdown-body ul,
        .markdown-body ol {
            margin-bottom: 16px;
            padding-left: 2em;
        }
        
        .markdown-body li {
            margin-bottom: 4px;
        }
        
        .markdown-body code {
            background-color: #f6f8fa;
            padding: 0.2em 0.4em;
            border-radius: 6px;
            font-size: 85%;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        }
        
        .markdown-body pre {
            background-color: #0d1117;
            padding: 16px;
            border-radius: 6px;
            overflow: auto;
            margin-bottom: 16px;
        }
        
        .markdown-body pre code {
            background-color: transparent;
            padding: 0;
            color: #e6edf3;
            font-size: 14px;
        }
        
        .markdown-body blockquote {
            border-left: 4px solid #d0d7de;
            padding-left: 16px;
            color: #656d76;
            margin-bottom: 16px;
        }
        
        .markdown-body table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }
        
        .markdown-body table th,
        .markdown-body table td {
            border: 1px solid #d0d7de;
            padding: 8px 12px;
        }
        
        .markdown-body table th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
        
        .markdown-body img {
            max-width: 100%;
            height: auto;
        }
        
        .markdown-body hr {
            border: 0;
            border-top: 1px solid #d0d7de;
            margin: 24px 0;
        }
        
        .file-path {
            color: #656d76;
            font-size: 14px;
            margin-bottom: 20px;
            padding: 8px 12px;
            background-color: #f6f8fa;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="file-path">📄 ${title}</div>
        <div class="markdown-body">
            ${content}
        </div>
    </div>
</body>
</html>`;
}

// 确保 Markdown 根目录存在
async function ensureDocsDir() {
  try {
    await fs.access(MARKDOWN_ROOT);
  } catch (error) {
    await fs.mkdir(MARKDOWN_ROOT, { recursive: true });
    console.log(`✅ 创建 Markdown 根目录: ${MARKDOWN_ROOT}`);
  }
}

// 处理所有路径请求
app.get('*', async (req, res) => {
  try {
    // 解析请求路径
    let requestPath = decodeURIComponent(req.path);
    
    // 移除开头的斜杠
    if (requestPath.startsWith('/')) {
      requestPath = requestPath.substring(1);
    }
    
    // 如果是根路径，显示欢迎页面
    if (!requestPath) {
      return res.send(generateHTML(
        '<h1>Markdown 实时预览服务器</h1><p>请在 URL 中指定 Markdown 文件路径。</p><p>例如: <code>/pm/20251020</code></p>',
        '欢迎'
      ));
    }
    
    // 构建完整的文件路径
    let filePath = path.join(MARKDOWN_ROOT, requestPath);
    
    // 如果路径不包含扩展名，添加 .md
    if (!path.extname(filePath)) {
      filePath += '.md';
    }
    
    // 安全检查：防止路径遍历攻击
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(MARKDOWN_ROOT)) {
      return res.status(403).send('访问被拒绝');
    }
    
    // 读取 Markdown 文件
    const markdownContent = await fs.readFile(filePath, 'utf-8');
    
    // 转换为 HTML
    const htmlContent = marked(markdownContent);
    
    // 获取文件名作为标题
    const fileName = path.basename(filePath);
    
    // 发送 HTML 响应
    res.send(generateHTML(htmlContent, fileName));
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send(generateHTML(
        `<h1>404 - 文件未找到</h1><p>请求的文件不存在: <code>${req.path}</code></p>`,
        '404'
      ));
    } else {
      console.error('错误:', error);
      res.status(500).send(generateHTML(
        `<h1>500 - 服务器错误</h1><p>${error.message}</p>`,
        '错误'
      ));
    }
  }
});

// 启动服务器
async function start() {
  await ensureDocsDir();
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 Markdown 实时预览服务器已启动                      ║
║                                                          ║
║   📁 Markdown 根目录: ${MARKDOWN_ROOT.padEnd(30)} ║
║   🌐 服务地址: http://localhost:${PORT.toString().padEnd(27)} ║
║                                                          ║
║   使用方法:                                              ║
║   1. 将 .md 文件放入 docs 目录                          ║
║   2. 访问 http://localhost:${PORT}/文件路径              ║
║      例如: http://localhost:${PORT}/pm/20251020          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
  });
}

start().catch(console.error);
