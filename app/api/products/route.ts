import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ProductResult extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  seller_id: number;
  seller_name: string;
  created_at: Date;
  updated_at: Date;
}

export async function GET() {
  try {
    const [products] = await pool.query<ProductResult[]>(`
      SELECT p.*, u.name as seller_name 
      FROM products p 
      JOIN users u ON p.seller_id = u.id 
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, category, condition, location, image, seller_id } = body;
    if (!name || !description || !price || !category || !condition || !location || !image || !seller_id) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products (name, description, price, category, \`condition\`, location, image, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, category, condition, location, image, seller_id]
    );
    return NextResponse.json({ success: true, productId: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create product', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 