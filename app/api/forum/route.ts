import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface QuestionResult extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  user_id: number;
  username: string;
  created_at: Date;
  answer_count: number;
}

export async function GET() {
  try {
    const [questions] = await pool.query<QuestionResult[]>(`
      SELECT q.*, u.username, 
        (SELECT COUNT(*) FROM forum_answers WHERE question_id = q.id) as answer_count
      FROM forum_questions q
      JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: questions
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch forum questions',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 