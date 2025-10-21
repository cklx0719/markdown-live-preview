FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制应用代码
COPY server.js ./

# 创建 docs 目录
RUN mkdir -p /app/docs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
