import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface MessageResult extends RowDataPacket {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  sender_name: string;
  receiver_name: string;
  created_at: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    const [messages] = await pool.query<MessageResult[]>(`
      SELECT m.*, 
        s.username as sender_name,
        r.username as receiver_name
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      JOIN users r ON m.receiver_id = r.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC
    `, [userId, userId]);

    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch messages',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 