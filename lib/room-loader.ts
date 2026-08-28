import { getRoom, restoreRoom } from './store';
import { supabase } from './supabase';

export async function loadRoom(code: string) {
  const cached = getRoom(code);
  if (cached) return cached;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return undefined;
  const { data } = await supabase.from('rooms').select('*').eq('room_code', code).single();
  if (!data) return undefined;
  const { data: players } = await supabase.from('players').select('id,nickname,is_host').eq('room_id', data.id);
  return restoreRoom({ id:data.id, code:data.room_code, hostId:data.host_player_id, status:data.status, theme:data.theme, difficulty:data.difficulty, story:data.story_data || undefined, hintIndex:0, players:(players || []).map(p=>({id:p.id,nickname:p.nickname,isHost:p.is_host})), questions:[], createdAt:data.created_at });
}
