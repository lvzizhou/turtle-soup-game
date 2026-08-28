'use client';
import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';

export default function VoicePanel({ code, playerId, nickname }: { code: string; playerId: string; nickname?: string }) {
 const ref = useRef<Room>(); const audio = useRef<HTMLDivElement>(null); const elements = useRef<HTMLAudioElement[]>([]); const speakerRef = useRef(true);
 const activeTimers = useRef<Map<string, number>>(new Map());
 const [joined, setJoined] = useState(false), [micEnabled, setMicEnabled] = useState(true), [speakerEnabled, setSpeakerEnabled] = useState(true), [speakers, setSpeakers] = useState<{ id: string; label: string }[]>([]), [error, setError] = useState('');
 const clearAudio = () => { elements.current.forEach(el => el.remove()); elements.current = []; };
 const connect = async () => { setError(''); try {
  const r = await fetch('/api/livekit/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room: `turtle-${code}`, identity: playerId, name: nickname }) }), d = await r.json();
  if (!r.ok || !d.url) throw Error(d.error || '语音服务未配置'); const room = new Room(); ref.current = room;
  room.on(RoomEvent.TrackSubscribed, track => { if (track.kind !== Track.Kind.Audio || !audio.current) return; const el = track.attach(); if (el instanceof HTMLAudioElement) { el.muted = !speakerRef.current; el.volume = speakerRef.current ? 1 : 0; elements.current.push(el); } audio.current.appendChild(el); });
  room.on(RoomEvent.ActiveSpeakersChanged, active => {
   const current = new Set(active.map(p => p.identity));
   active.forEach(p => {
    const id = p.identity, label = p.name || p.identity;
    const oldTimer = activeTimers.current.get(id); if (oldTimer) window.clearTimeout(oldTimer);
    activeTimers.current.delete(id);
    setSpeakers(list => list.some(item => item.id === id) ? list : [...list, { id, label }]);
   });
   setSpeakers(list => { list.forEach(item => { if (!current.has(item.id) && !activeTimers.current.has(item.id)) activeTimers.current.set(item.id, window.setTimeout(() => { setSpeakers(now => now.filter(x => x.id !== item.id)); activeTimers.current.delete(item.id); }, 1500)); }); return list; });
  });
  room.on(RoomEvent.TrackUnsubscribed, track => { if (track.kind !== Track.Kind.Audio) return; track.detach().forEach(el => { el.remove(); elements.current = elements.current.filter(item => item !== el); }); });
  room.on(RoomEvent.Disconnected, () => { clearAudio(); activeTimers.current.forEach(timer => window.clearTimeout(timer)); activeTimers.current.clear(); setSpeakers([]); setJoined(false); window.setTimeout(() => { if (document.visibilityState === 'visible') connect(); }, 1200); }); await room.connect(d.url, d.token); await room.localParticipant.setMicrophoneEnabled(true); setMicEnabled(true); speakerRef.current = true; setSpeakerEnabled(true); setJoined(true);
 } catch (e: any) { setError(e.message || '语音连接失败'); } };
 useEffect(() => { connect(); return () => { ref.current?.disconnect(); clearAudio(); activeTimers.current.forEach(timer => window.clearTimeout(timer)); }; }, [code, playerId, nickname]);
 const toggleMic = async () => { if (!ref.current || !joined) return; const next = !micEnabled; await ref.current.localParticipant.setMicrophoneEnabled(next); setMicEnabled(next); };
 const toggleSpeaker = () => { if (!joined) return; const next = !speakerRef.current; speakerRef.current = next; elements.current.forEach(el => { el.muted = !next; el.volume = next ? 1 : 0; }); setSpeakerEnabled(next); };
 return <div className="voice-panel"><div className="voice-actions"><button disabled={!joined} onClick={toggleSpeaker} className={`voice-icon ${speakerEnabled ? '' : 'voice-icon-off'}`} aria-label={speakerEnabled ? '关闭听筒' : '打开听筒'} title={speakerEnabled ? '听筒：已开启' : '听筒：已关闭'}>{speakerEnabled ? '🔊' : '🔇'}</button><button disabled={!joined} onClick={toggleMic} className={`voice-icon ${micEnabled ? '' : 'voice-icon-off'}`} aria-label={micEnabled ? '关闭麦克风' : '打开麦克风'} title={micEnabled ? '麦克风：已开启' : '麦克风：已关闭'}>{micEnabled ? '🎙️' : '🔇'}</button></div><div className="voice-speaker-list" aria-live="polite">{speakers.map(speaker => <div className="voice-speaker" key={speaker.id}><span className="voice-speaking-dot" />{speaker.label}<span>正在说话</span></div>)}</div>{error && <small className="voice-error">{error}</small>}<div ref={audio} /></div>;
}
