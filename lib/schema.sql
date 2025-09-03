-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rank VARCHAR(50) DEFAULT 'Newbie',
  points INTEGER DEFAULT 0,
  avatar VARCHAR(255),
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  seller_id UUID NOT NULL REFERENCES users(id),
  seller_name VARCHAR(255) NOT NULL,
  seller_avatar VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  rating DECIMAL(3, 1) DEFAULT 0,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  author_name VARCHAR(255) NOT NULL,
  author_rank VARCHAR(50) NOT NULL,
  author_avatar VARCHAR(255),
  department VARCHAR(100) NOT NULL,
  upvotes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  trending BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum post tags table
CREATE TABLE IF NOT EXISTS forum_post_tags (
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (post_id, tag)
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  author_name VARCHAR(255) NOT NULL,
  author_rank VARCHAR(50) NOT NULL,
  author_avatar VARCHAR(255),
  upvotes INTEGER DEFAULT 0,
  is_best_answer BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_message_content TEXT,
  last_message_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_sender_id UUID,
  last_message_is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  action_url VARCHAR(255) NOT NULL,
  sender_id UUID,
  sender_name VARCHAR(255),
  sender_avatar VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
