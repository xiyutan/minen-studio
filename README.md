# Minen Studio

Minen Studio（Minen 工坊）是一个支持 Agnes AI API 的跨端 AI 创作工具，支持聊天、图片生成和视频生成。项目使用 Next.js App Router、TypeScript、Tailwind CSS、shadcn/ui 和 Zustand。

## 功能

- 聊天：流式响应、多轮对话、本地历史记录
- 图片生成：文生图、尺寸选择、历史画廊、下载图片
- 视频生成：异步任务、进度轮询、视频播放、下载视频
- 设置：支持通过环境变量或浏览器本地配置 Agnes AI API Key
- 多端体验：桌面侧栏、移动底部导航、PWA manifest

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Zustand
- Lucide React

## 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## API Key

推荐在 `.env.local` 中配置：

```env
AGNES_API_KEY=your_api_key_here
```

也可以在应用的 `/settings` 页面配置 API Key。页面配置会保存在浏览器 `localStorage`，不会写入服务端。

## 来源与关系声明

Minen Studio 支持 Agnes AI 提供的 API 能力，用于提供聊天、图片生成和视频生成体验。Minen Studio 是独立构建的应用，不是 Agnes AI 官方产品，也不代表 Agnes AI 官方背书、赞助、认证或运营，除非后续获得明确书面授权。

Agnes AI、相关模型名称、接口能力和服务条款归其对应权利方所有。使用本项目时，应自行遵守 Agnes AI 平台的 API 使用规则、内容政策、计费规则以及适用法律法规。

## 免责声明

- 本项目按“现状”提供，不承诺生成内容的准确性、完整性、可用性、原创性或适用于特定用途。
- AI 生成内容可能包含错误、不准确、侵权、偏见或不适合公开发布的内容，发布、商用或再分发前请自行审核。
- 用户应自行确认输入素材、提示词和生成结果是否拥有必要权利，并自行承担由使用、下载、发布或传播内容产生的责任。
- 上游 API 的可用性、响应速度、价格、模型效果和内容政策可能变化，本项目不对第三方服务中断或变更承担责任。
- 本说明不构成法律、财务、医疗或其他专业意见；如用于商业发布、上架或面向公众运营，请咨询专业人士。

## 常用命令

```bash
npm run lint
npm exec tsc -- --noEmit
npm run build
npm start
```

## 数据和媒体保存位置

- 聊天历史：浏览器 `localStorage`，key 为 `chat_history`
- 图片历史：浏览器 `localStorage`，key 为 `image_gallery`
- 视频历史：浏览器 `localStorage`，key 为 `video_history`
- 图片/视频文件：默认不保存到项目目录，应用只保存上游接口返回的远端 URL；用户点击下载后，文件会进入浏览器默认下载目录

## 多端打包建议

当前项目包含 `/app/api/*` 服务端代理路由，用来保护 API Key、处理长请求和流式响应。因此它不适合直接改成纯静态导出。推荐路线：

1. Web/PWA：部署完整 Next.js 服务，用户可在桌面和移动浏览器中使用，也可安装到主屏幕。
2. 桌面端：用 Electron 或 Tauri 加载已部署的 Web/PWA 地址，或内置启动 Next.js 服务。
3. 移动端：用 Capacitor 包装已部署 Web/PWA 地址；如需上架和离线能力，再补服务工作线程、图标和启动图。
4. 纯静态托管：需要先把上游 API 调用迁到客户端直连，或拆出独立后端服务，否则图片、视频、聊天功能会失效。

更多说明见 `docs/multi-platform.md`。
