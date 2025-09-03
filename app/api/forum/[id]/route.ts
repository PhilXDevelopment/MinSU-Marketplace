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
}

interface AnswerResult extends RowDataPacket {
  id: number;
  content: string;
  user_id: number;
  username: string;
  created_at: Date;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;

    // Get the question
    const [questions] = await pool.query<QuestionResult[]>(`
      SELECT q.*, u.username
      FROM forum_questions q
      JOIN users u ON q.user_id = u.id
      WHERE q.id = ?
    `, [questionId]);

    if (questions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Question not found'
      }, { status: 404 });
    }

    // Get the answers
    const [answers] = await pool.query<AnswerResult[]>(`
      SELECT a.*, u.username
      FROM forum_answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC
    `, [questionId]);

    return NextResponse.json({
      success: true,
      data: {
        question: questions[0],
        answers
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch question and answers',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 