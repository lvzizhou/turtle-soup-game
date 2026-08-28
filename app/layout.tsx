import './globals.css';
import type { Metadata } from 'next';
import VoiceDock from '../components/VoiceDock';

export const metadata: Metadata = {
  title: '海龟汤 · 在线游戏',
  description: '和朋友一起在线推理海龟汤',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}<VoiceDock /></body></html>;
}
