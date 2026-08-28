'use client';
import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';

export default function VoicePanel({ code, playerId, nickname }: { code: string; playerId: string; nickname?: string }) {
 const ref = useRef<Room>(); const audio = useRef<HTMLDivElement>(null); const elements = useRef<HTMLAudioElement[]>([]); const speakerRef = useRef(true);
 const [joined, setJoined] = useState(false), [micEnabled, setMicEnabled] = useState(true), [speakerEnabled, setSpeakerEnabled] = useState(true), [speakers, setSpeakers] = useState<string[]>([]), [error, setError] = useState('');
 const clearAudio = () => { elements.current.forEach(el => el.remove()); elements.current = []; };
 const connect = async () => { setError(''); try {
  const r = await fetch('/api/livekit/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room: `turtle-${code}`, identity: playerId, name: nickname }) }), d = await r.json();
  if (!r.ok || !d.url) throw Error(d.error || '语音服务未配置'); const room = new Room(); ref.current = room;
  room.on(RoomEvent.TrackSubscribed, track => { if (track.kind !== Track.Kind.Audio || !audio.current) return; const el = track.attach(); if (el instanceof HTMLAudioElement) { el.muted = !speakerRef.current; el.volume = speakerRef.current ? 1 : 0; elements.current.push(el); } audio.current.appendChild(el); });
  room.on(RoomEvent.ActiveSpeakersChanged, active => { setSpeakers(active.map(p => p.name || p.identity)); });
  room.on(RoomEvent.TrackUnsubscribed, track => { if (track.kind !== Track.Kind.Audio) return; track.detach().forEach(el => { el.remove(); elements.current = elements.current.filter(item => item !== el); }); });
  room.on(RoomEvent.Disconnected, () => { clearAudio(); setSpeakers([]); setJoined(false); window.setTimeout(() => { if (document.visibilityState === 'visible') connect(); }, 1200); }); await room.connect(d.url, d.token); await room.localParticipant.setMicrophoneEnabled(true); setMicEnabled(true); speakerRef.current = true; setSpeakerEnabled(true); setJoined(true);
 } catch (e: any) { setError(e.message || '语音连接失败'); } };
 useEffect(() => { connect(); return () => { ref.current?.disconnect(); clearAudio(); }; }, [code, playerId]);
 const toggleMic = async () => { if (!ref.current || !joined) return; const next = !micEnabled; await ref.current.localParticipant.setMicrophoneEnabled(next); setMicEnabled(next); };
 const toggleSpeaker = () => { if (!joined) return; const next = !speakerRef.current; speakerRef.current = next; elements.current.forEach(el => { el.muted = !next; el.volume = next ? 1 : 0; }); setSpeakerEnabled(next); };
 return <div className="voice-panel"><div className="voice-speaking" aria-live="polite"><span className="voice-speaking-dot" />{joined && speakers.length ? <span>正在说话：{speakers.join('、')}</span> : <span>暂无人说话</span>}</div><div className="voice-actions"><button disabled={!joined} onClick={toggleSpeaker} className={`voice-icon ${speakerEnabled ? '' : 'voice-icon-off'}`} aria-label={speakerEnabled ? '关闭听筒' : '打开听筒'} title={speakerEnabled ? '听筒：已开启' : '听筒：已关闭'}>{speakerEnabled ? '🔊' : '🔇'}</button><button disabled={!joined} onClick={toggleMic} className={`voice-icon ${micEnabled ? '' : 'voice-icon-off'}`} aria-label={micEnabled ? '关闭麦克风' : '打开麦克风'} title={micEnabled ? '麦克风：已开启' : '麦克风：已关闭'}>{micEnabled ? '🎙️' : '🔇'}</button></div>{error && <small className="voice-error">{error}</small>}<div ref={audio} /></div>;
}
