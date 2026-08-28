export type Difficulty = 'easy' | 'normal' | 'hard';
export type AnswerType = '是' | '不是' | '是或不是' | '无关';
export type RoomStatus = 'waiting' | 'generating' | 'playing' | 'finished';
export type StoryPayload = { surface: string; truth: string; keyFacts: string[]; ending: string; difficulty: string; storyId?: string };
export type Player = { id: string; nickname: string; isHost: boolean };
export type Question = { id: string; playerId: string; nickname: string; content: string; answerType?: AnswerType; answerText?: string; createdAt: string };
