# PyTutor AI

PyTutor AI 是一个面向 Python 初学者的交互式学习应用，提供课程导航、AI
导师、代码编辑器和学习进度保存。

## 本地运行

环境要求：Node.js 20.19+、npm 10+。

1. 安装依赖：

   ```bash
   npm install
   ```

2. 复制环境变量模板并填写 Gemini API Key：

   ```bash
   cp .env.example .env.local
   ```

3. 启动前端开发服务器：

   ```bash
   npm run dev
   ```

4. 构建并检查 TypeScript：

   ```bash
   npm run build
   ```

## 可选：启用 MySQL 后端

1. 在 MySQL 中执行 `schema.sql`。
2. 设置 `DB_HOST`、`DB_USER`、`DB_PASSWORD` 和 `DB_NAME` 环境变量。
3. 将 `api.ts` 中的 `USE_MOCK_BACKEND` 改为 `false`。
4. 启动后端：

   ```bash
   npm run server
   ```

后端默认监听 `http://localhost:3001`。数据库密码不会从源码中读取。
