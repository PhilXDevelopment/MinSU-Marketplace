import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ProductResult extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  image: string;
  seller_id: number;
  created_at: Date;
  updated_at: Date;
  seller_name: string;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const [rows] = await pool.query<ProductResult[]>(
      `SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.id = ? LIMIT 1`,
      [productId]
    );
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    const product = rows[0];
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 