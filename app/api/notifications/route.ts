import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface NotificationResult extends RowDataPacket {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
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

    const [notifications] = await pool.query<NotificationResult[]>(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

    return NextResponse.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 