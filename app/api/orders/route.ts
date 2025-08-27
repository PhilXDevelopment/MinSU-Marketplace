import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface OrderResult extends RowDataPacket {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: Date;
  product_name: string;
  seller_name: string;
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

    const [orders] = await pool.query<OrderResult[]>(`
      SELECT o.*, p.name as product_name, u.username as seller_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u ON p.seller_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 