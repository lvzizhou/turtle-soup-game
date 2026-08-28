import { NextResponse } from 'next/server';
import { nextHint } from '@/lib/store';
export async function POST(_:Request,{params}:{params:{code:string}}){try{return NextResponse.json({hint:nextHint(params.code)})}catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
