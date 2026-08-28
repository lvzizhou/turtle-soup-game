import { Difficulty, Player, Question, RoomStatus, StoryPayload } from './types';
type Room = { id: string; code: string; hostId: string; status: RoomStatus; theme: string; difficulty: Difficulty; story?: StoryPayload; hintIndex: number; players: Player[]; questions: Question[]; createdAt: string };
// Keep one store across Next.js route modules during development.
const globalStore = globalThis as typeof globalThis & { __turtleRooms?: Map<string, Room> };
const rooms = globalStore.__turtleRooms ?? (globalStore.__turtleRooms = new Map<string, Room>());
function createRoomCode() { let code = ''; do { code = String(Math.floor(100000 + Math.random() * 900000)); } while (rooms.has(code)); return code; }
export function createRoom(theme: string, difficulty: Difficulty, nickname: string, requestedCode?: string) { const id = crypto.randomUUID(); const pid = crypto.randomUUID(); const code = requestedCode || createRoomCode(); if (rooms.has(code)) throw new Error('该邀请码已被占用，请换一个'); const room: Room = { id, code, hostId: pid, status: 'waiting', theme, difficulty, hintIndex: 0, players: [{id: pid, nickname, isHost: true}], questions: [], createdAt: new Date().toISOString() }; rooms.set(code, room); return { room, playerId: pid }; }
export function getRoom(code: string) { return rooms.get(code); }
export function restoreRoom(room: Room) { rooms.set(room.code, room); return room; }
export type StoredRoom = Room;
export function joinRoom(code: string, nickname: string) { const room = getRoom(code); if (!room) throw new Error('邀请码不存在'); if (room.status === 'finished') throw new Error('本局已结束，请让房主创建新房间'); if (room.players.some(p => p.nickname === nickname)) throw new Error('昵称已被使用'); const id = crypto.randomUUID(); room.players.push({id, nickname, isHost:false}); return { room, playerId:id }; }
export function setStory(code: string, story: StoryPayload) { const room = getRoom(code); if (!room) throw new Error('房间不存在'); room.story = story; room.hintIndex = 0; room.status = 'playing'; return room; }
export function nextHint(code: string) { const room = getRoom(code); if (!room?.story) throw new Error('游戏尚未开始'); const hint = room.story.keyFacts[room.hintIndex++]; if (!hint) throw new Error('没有更多提示了'); return hint; }
export function addQuestion(code: string, playerId: string, content: string, answerType: any) { const room = getRoom(code); if (!room) throw new Error('房间不存在'); const p = room.players.find(x=>x.id===playerId); if (!p) throw new Error('玩家不存在'); const q: Question = {id:crypto.randomUUID(),playerId,nickname:p.nickname,content,answerType,answerText:answerType,createdAt:new Date().toISOString()}; room.questions.push(q); return q; }
export function finishRoom(code: string, playerId: string) { const room=getRoom(code); if(!room) throw new Error('房间不存在'); if(room.hostId!==playerId) throw new Error('只有房主可以结束游戏'); room.status='finished'; return room; }
