import { NextResponse } from 'next/server';
import { getRoom } from '@/lib/store';
import { supabase } from '@/lib/supabase';

// This intentionally exposes only data visible to players; the answer stays server-only.
export async function GET(_: Request, { params }: { params: { code: string } }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data: dbRoom } = await supabase.from('rooms').select('*').eq('room_code', params.code).single();
    if (dbRoom) {
      const { data: players } = await supabase.from('players').select('id,nickname,is_host').eq('room_id', dbRoom.id);
      const story = dbRoom.story_data as any;
      return NextResponse.json({ room: { id: dbRoom.id, code: dbRoom.room_code, hostId: dbRoom.host_player_id, status: dbRoom.status, theme: dbRoom.theme, difficulty: dbRoom.difficulty, hintIndex: 0, players: (players || []).map(p => ({ id:p.id, nickname:p.nickname, isHost:p.is_host })), publicSurface: dbRoom.public_surface, revealedStory: dbRoom.status === 'finished' ? story : undefined, hasStory: Boolean(story) } });
    }
  }
  const room = getRoom(params.code);
  if (!room) return NextResponse.json({ error: '房间不存在' }, { status: 404 });
  const { story, ...safeRoom } = room;
  return NextResponse.json({ room: {
    ...safeRoom,
    publicSurface: story?.surface,
    revealedStory: room.status === 'finished' ? story : undefined,
    hasStory: Boolean(story),
  } });
}
