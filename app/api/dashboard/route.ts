import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface CountResult extends RowDataPacket {
  count: number;
}

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

interface ForumQuestionResult extends RowDataPacket {
  id: number;
  title: string;
  user_id: number;
  username: string;
  created_at: Date;
  answer_count: number;
  upvote_count: number;
  tags: string;
}

interface ActivityResult extends RowDataPacket {
  id: number;
  type: string;
  title: string;
  created_at: Date;
  user_id: number;
  username: string;
  question_id?: number;
  product_id?: number;
  upvote_count?: number;
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

    // Get various statistics
    const [userCount] = await pool.query<CountResult[]>('SELECT COUNT(*) as count FROM users');
    const [productCount] = await pool.query<CountResult[]>('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await pool.query<CountResult[]>('SELECT COUNT(*) as count FROM orders');

    // Get user's recent products
    const [recentProducts] = await pool.query<ProductResult[]>(`
      SELECT p.*, u.name as seller_name 
      FROM products p 
      JOIN users u ON p.seller_id = u.id 
      WHERE p.seller_id = ?
      ORDER BY p.created_at DESC 
      LIMIT 5
    `, [userId]);

    // Get hot topics (forum questions with most answers and upvotes)
    const [hotTopics] = await pool.query<ForumQuestionResult[]>(`
      SELECT q.*, u.username,
        (SELECT COUNT(*) FROM forum_answers WHERE question_id = q.id) as answer_count,
        (SELECT COUNT(*) FROM forum_upvotes WHERE question_id = q.id) as upvote_count,
        GROUP_CONCAT(t.name) as tags
      FROM forum_questions q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN forum_question_tags qt ON q.id = qt.question_id
      LEFT JOIN forum_tags t ON qt.tag_id = t.id
      GROUP BY q.id
      ORDER BY answer_count DESC, upvote_count DESC
      LIMIT 3
    `);

    // Get user's recent activities
    const [recentActivities] = await pool.query<ActivityResult[]>(`
      (
        -- User's forum answers
        SELECT 
          a.id,
          'forum_answer' as type,
          CONCAT('answered a question about ', q.title) as title,
          a.created_at,
          a.user_id,
          u.username,
          q.id as question_id
        FROM forum_answers a
        JOIN forum_questions q ON a.question_id = q.id
        JOIN users u ON a.user_id = u.id
        WHERE a.user_id = ?
      )
      UNION ALL
      (
        -- User's product listings
        SELECT 
          p.id,
          'product_listing' as type,
          CONCAT('listed ', p.name, ' for sale') as title,
          p.created_at,
          p.seller_id as user_id,
          u.username,
          NULL as question_id
        FROM products p
        JOIN users u ON p.seller_id = u.id
        WHERE p.seller_id = ?
      )
      UNION ALL
      (
        -- Upvotes on user's questions
        SELECT 
          u.id,
          'forum_upvote' as type,
          CONCAT('received ', 
            (SELECT COUNT(*) FROM forum_upvotes WHERE question_id = u.question_id),
            ' upvotes on their question'
          ) as title,
          u.created_at,
          q.user_id,
          usr.username,
          u.question_id
        FROM forum_upvotes u
        JOIN forum_questions q ON u.question_id = q.id
        JOIN users usr ON q.user_id = usr.id
        WHERE q.user_id = ?
      )
      ORDER BY created_at DESC
      LIMIT 5
    `, [userId, userId, userId]);

    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          users: userCount[0].count,
          products: productCount[0].count,
          orders: orderCount[0].count
        },
        recentProducts,
        hotTopics,
        recentActivities
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 