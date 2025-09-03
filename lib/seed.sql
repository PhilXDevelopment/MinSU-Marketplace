-- Insert sample users
INSERT INTO users (id, name, email, password, rank, points, avatar, is_online)
VALUES 
('11111111-1111-1111-1111-111111111111'::UUID, 'Rhed Maldo', 'maldo.rhed@minsu.edu.ph', 'Kahitanolang011', 'Helper', 75, 'R', true),
('22222222-2222-2222-2222-222222222222'::UUID, 'Jane Smith', 'smith.jane@minsu.edu.ph', 'Password123456', 'Newbie', 25, 'J', false),
('33333333-3333-3333-3333-333333333333'::UUID, 'Mike Johnson', 'johnson.mike@minsu.edu.ph', 'SecurePass789012', 'Expert', 150, 'M', true);

-- Insert sample products
INSERT INTO products (name, price, image, category, condition, description, seller_id, seller_name, seller_avatar, location, status, rating)
VALUES
('Calculus Textbook', 650, '/placeholder.svg?height=300&width=300', 'Books', 'Like New', 'Calculus: Early Transcendentals 8th Edition. Only used for one semester.', '11111111-1111-1111-1111-111111111111'::UUID, 'Rhed Maldo', 'R', 'Main Campus', 'active', 4.8),
('Scientific Calculator', 950, '/placeholder.svg?height=300&width=300', 'Electronics', 'Good', 'Casio FX-991EX. Perfect for engineering and science courses.', '22222222-2222-2222-2222-222222222222'::UUID, 'Jane Smith', 'J', 'North Campus', 'active', 4.5),
('Study Desk', 1200, '/placeholder.svg?height=300&width=300', 'Furniture', 'Used', 'Compact study desk with drawer. Dimensions: 100cm x 60cm.', '33333333-3333-3333-3333-333333333333'::UUID, 'Mike Johnson', 'M', 'South Campus', 'active', 4.2),
('Wireless Headphones', 800, '/placeholder.svg?height=300&width=300', 'Electronics', 'New', 'Noise-cancelling headphones. Great for studying in noisy environments.', '11111111-1111-1111-1111-111111111111'::UUID, 'Rhed Maldo', 'R', 'Main Campus', 'active', 4.9),
('Biology Lab Kit', 450, '/placeholder.svg?height=300&width=300', 'Lab Equipment', 'Like New', 'Complete biology lab kit. Includes microscope slides, petri dishes, and more.', '22222222-2222-2222-2222-222222222222'::UUID, 'Jane Smith', 'J', 'Science Building', 'active', 4.7),
('Engineering Drafting Tools', 350, '/placeholder.svg?height=300&width=300', 'Tools', 'Good', 'Professional drafting set with compass, rulers, and set squares.', '33333333-3333-3333-3333-333333333333'::UUID, 'Mike Johnson', 'M', 'Engineering Building', 'active', 4.3),
('Computer Science Textbooks Bundle', 1500, '/placeholder.svg?height=300&width=300', 'Books', 'Good', 'Set of 5 computer science textbooks. Covers programming, algorithms, and more.', '11111111-1111-1111-1111-111111111111'::UUID, 'Rhed Maldo', 'R', 'CS Department', 'active', 4.6),
('Dorm Refrigerator', 2000, '/placeholder.svg?height=300&width=300', 'Appliances', 'Used', 'Small refrigerator perfect for dorm rooms. 1.7 cubic feet.', '22222222-2222-2222-2222-222222222222'::UUID, 'Jane Smith', 'J', 'Dormitory Area', 'active', 4.4);

-- Insert sample forum posts
INSERT INTO forum_posts (title, content, author_id, author_name, author_rank, author_avatar, department, upvotes, trending)
VALUES
('Help with Calculus Problem', 'I''m struggling with integration by parts. Can someone explain how to solve this problem?', '11111111-1111-1111-1111-111111111111'::UUID, 'Rhed Maldo', 'Helper', 'R', 'Mathematics', 5, false),
('Programming Project Ideas', 'I need ideas for my final year project in Computer Science. Any suggestions?', '22222222-2222-2222-2222-222222222222'::UUID, 'Jane Smith', 'Newbie', 'J', 'Computer Science', 12, true),
('Physics Lab Report Format', 'What is the proper format for a physics lab report? I''m new to this.', '33333333-3333-3333-3333-333333333333'::UUID, 'Mike Johnson', 'Expert', 'M', 'Physics', 8, false);

-- Insert sample forum post tags
INSERT INTO forum_post_tags (post_id, tag)
SELECT id, 'calculus' FROM forum_posts WHERE title = 'Help with Calculus Problem'
UNION ALL
SELECT id, 'math' FROM forum_posts WHERE title = 'Help with Calculus Problem'
UNION ALL
SELECT id, 'programming' FROM forum_posts WHERE title = 'Programming Project Ideas'
UNION ALL
SELECT id, 'project' FROM forum_posts WHERE title = 'Programming Project Ideas'
UNION ALL
SELECT id, 'physics' FROM forum_posts WHERE title = 'Physics Lab Report Format'
UNION ALL
SELECT id, 'lab report' FROM forum_posts WHERE title = 'Physics Lab Report Format';

-- Insert sample forum replies
INSERT INTO forum_replies (post_id, content, author_id, author_name, author_rank, author_avatar, upvotes, is_best_answer)
SELECT 
p.id,
'Integration by parts uses the formula ∫u dv = uv - ∫v du. First, identify u and dv, then apply the formula.',
'33333333-3333-3333-3333-333333333333'::UUID,
'Mike Johnson',
'Expert',
'M',
3,
true
FROM forum_posts p
WHERE p.title = 'Help with Calculus Problem'
UNION ALL
SELECT 
p.id,
'You could create a web app that helps students find study partners on campus.',
'11111111-1111-1111-1111-111111111111'::UUID,
'Rhed Maldo',
'Helper',
'R',
5,
false
FROM forum_posts p
WHERE p.title = 'Programming Project Ideas';

-- Update reply count for posts
UPDATE forum_posts
SET replies = 1
WHERE title = 'Help with Calculus Problem' OR title = 'Programming Project Ideas';

-- Create sample conversations
INSERT INTO conversations (id, created_at)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, CURRENT_TIMESTAMP),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, CURRENT_TIMESTAMP);

-- Add conversation participants
INSERT INTO conversation_participants (conversation_id, user_id)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, '11111111-1111-1111-1111-111111111111'::UUID),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, '22222222-2222-2222-2222-222222222222'::UUID),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, '11111111-1111-1111-1111-111111111111'::UUID),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, '33333333-3333-3333-3333-333333333333'::UUID);

-- Add messages to conversations
INSERT INTO messages (conversation_id, content, sender_id, is_read)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, 'Hi Jane, I saw your listing for the Biology Lab Kit. Is it still available?', '11111111-1111-1111-1111-111111111111'::UUID, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, 'Yes, it''s still available! When would you like to meet?', '22222222-2222-2222-2222-222222222222'::UUID, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, 'Great! How about tomorrow at 3pm in the library?', '11111111-1111-1111-1111-111111111111'::UUID, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, 'Hey Mike, thanks for your help with the calculus problem!', '11111111-1111-1111-1111-111111111111'::UUID, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, 'No problem! Let me know if you have any other questions.', '33333333-3333-3333-3333-333333333333'::UUID, false);

-- Update conversation last messages
UPDATE conversations
SET 
last_message_content = 'Great! How about tomorrow at 3pm in the library?',
last_message_timestamp = CURRENT_TIMESTAMP,
last_message_sender_id = '11111111-1111-1111-1111-111111111111'::UUID,
last_message_is_read = false
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID;

UPDATE conversations
SET 
last_message_content = 'No problem! Let me know if you have any other questions.',
last_message_timestamp = CURRENT_TIMESTAMP,
last_message_sender_id = '33333333-3333-3333-3333-333333333333'::UUID,
last_message_is_read = false
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID;

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, description, action_url, sender_id, sender_name, sender_avatar, is_read)
VALUES
('11111111-1111-1111-1111-111111111111'::UUID, 'message', 'New message from Jane Smith', 'Yes, it''s still available! When would you like to meet?', '/messages/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'::UUID, 'Jane Smith', 'J', true),
('22222222-2222-2222-2222-222222222222'::UUID, 'message', 'New message from Rhed Maldo', 'Great! How about tomorrow at 3pm in the library?', '/messages/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'::UUID, 'Rhed Maldo', 'R', false),
('11111111-1111-1111-1111-111111111111'::UUID, 'forum', 'Your answer was upvoted', 'Jane Smith upvoted your answer', '/forum/question/1', '22222222-2222-2222-2222-222222222222'::UUID, 'Jane Smith', 'J', false),
('33333333-3333-3333-3333-333333333333'::UUID, 'marketplace', 'New inquiry about your listing', 'Someone is interested in your Engineering Drafting Tools', '/marketplace/product/3', '11111111-1111-1111-1111-111111111111'::UUID, 'Rhed Maldo', 'R', false);
