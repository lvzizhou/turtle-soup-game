'use client';

import { useEffect, useState } from 'react';
import VoicePanel from './VoicePanel';

export default function VoiceDock() {
  const [identity, setIdentity] = useState<{ code: string; playerId: string }>();

  useEffect(() => {
    const update = () => {
      const code = localStorage.getItem('turtle-code');
      const playerId = localStorage.getItem('turtle-player');
      const inRoom = Boolean(document.querySelector('section.bg-slate-900'));
      setIdentity(inRoom && code && playerId ? { code, playerId } : undefined);
    };
    update();
    const timer = window.setInterval(update, 500);
    return () => window.clearInterval(timer);
  }, []);

  return identity ? <VoicePanel code={identity.code} playerId={identity.playerId} nickname={localStorage.getItem('turtle-name') || undefined} /> : null;
}
