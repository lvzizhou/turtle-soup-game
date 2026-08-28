'use client';
import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, Track, RemoteTrack } from 'livekit-client';

export default function VoicePanel({ code, playerId, nickname }: { code: string; playerId: string; nickname?: string }) {
 const ref = useRef<Room>(); const audio = useRef<HTMLDivElement>(null); const elements = useRef<HTMLAudioElement[]>([]);
 const [joined, setJoined] = useState(false), [micEnabled, setMicEnabled] = useState(true), [speakerEnabled, setSpeakerEnabled] = useState(true), [status, setStatus] = useState('未加入语音'), [error, setError] = useState('');
 const clearAudio = () => { elements.current.forEach(el => el.remove()); elements.current = []; };
 useEffect(() => () => { ref.current?.disconnect(); clearAudio(); }, []);
 const toggleJoin = async () => { setError(''); if (joined) { ref.current?.disconnect(); ref.current = undefined; clearAudio(); setJoined(false); setStatus('已退出语音'); return; } try {
  setStatus('正在连接…'); const r = await fetch('/api/livekit/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room: `turtle-${code}`, identity: playerId, name: nickname }) }), d = await r.json();
  if (!r.ok || !d.url) throw Error(d.error || '语音服务未配置'); const room = new Room(); ref.current = room;
  room.on(RoomEvent.TrackSubscribed, track => { if (track.kind !== Track.Kind.Audio || !audio.current) return; const el = track.attach(); if (el instanceof HTMLAudioElement) { el.muted = !speakerEnabled; elements.current.push(el); } audio.current.appendChild(el); });
  room.on(RoomEvent.TrackUnsubscribed, track => { if (track.kind !== Track.Kind.Audio) return; track.detach().forEach(el => { el.remove(); elements.current = elements.current.filter(item => item !== el); }); });
  room.on(RoomEvent.Disconnected, () => { clearAudio(); setJoined(false); setStatus('已断开'); }); await room.connect(d.url, d.token); await room.localParticipant.setMicrophoneEnabled(true); setMicEnabled(true); setSpeakerEnabled(true); setJoined(true); setStatus('语音已连接');
 } catch (e: any) { setStatus('连接失败'); setError(e.message || '请检查麦克风权限'); } };
 const toggleMic = async () => { if (!ref.current || !joined) return; const next = !micEnabled; await ref.current.localParticipant.setMicrophoneEnabled(next); setMicEnabled(next); };
 const toggleSpeaker = () => { if (!joined) return; const next = !speakerEnabled; elements.current.forEach(el => { el.muted = !next; }); setSpeakerEnabled(next); };
 return <div className="voice-panel"><span className="voice-status">{status}</span><div className="voice-actions"><button onClick={toggleJoin} className={`${joined ? 'voice-leave' : 'voice-join'} voice-icon`} aria-label={joined ? '退出语音' : '加入语音'} title={joined ? '退出语音' : '加入语音'}>{joined ? '⏏️' : '🎧'}</button>{joined && <><button onClick={toggleMic} className={`voice-icon ${micEnabled ? '' : 'voice-icon-off'}`} aria-label={micEnabled ? '关闭麦克风' : '打开麦克风'} title={micEnabled ? '关闭麦克风' : '打开麦克风'}>{micEnabled ? '🎙️' : '🔇'}</button><button onClick={toggleSpeaker} className={`voice-icon ${speakerEnabled ? '' : 'voice-icon-off'}`} aria-label={speakerEnabled ? '关闭听筒' : '打开听筒'} title={speakerEnabled ? '关闭听筒' : '打开听筒'}>{speakerEnabled ? '🔊' : '🔇'}</button></>}</div>{error && <small className="voice-error">{error}</small>}<div ref={audio} /></div>;
}
