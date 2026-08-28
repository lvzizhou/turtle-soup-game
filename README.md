# 海龟汤 · 在线游戏

Next.js MVP，支持昵称+房间码多人房间、AI 生成汤面和四选一裁判。未配置模型 Key 时自动使用内置 DemoProvider，可直接体验完整流程。

## 运行

```bash
npm install
copy .env.example .env.local
npm run dev
```

配置 `LLM_PROVIDER=openai` 和 `LLM_API_KEY` 后，可接入 Groq、OpenAI 兼容网关或硅基流动。`supabase/schema.sql` 提供生产环境数据库表结构；房间、玩家、问题、换题和结束状态会同步写入 Supabase，浏览器通过 Realtime 即时更新。

## 公网部署

本地 `localhost` 只允许同一台电脑访问。当前版本已完成 Supabase 持久化与 Realtime，可部署至公网：

1. 将仓库推送至 GitHub，确认 `.env.local` 没有被提交。
2. 在 Vercel 导入该仓库，配置 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`LLM_PROVIDER`、`LLM_API_KEY`、`LLM_BASE_URL` 与 `LLM_MODEL`。

部署完成后，朋友访问 Vercel 提供的 HTTPS 域名，输入六位邀请码即可加入。部署后需要在 Supabase 的 Authentication → URL Configuration 中将 Vercel 域名加入 Site URL / Redirect URLs。
