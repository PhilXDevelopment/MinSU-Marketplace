USE rumiecollegemarketplace;

-- Insert sample users
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', '$2a$10$example_hash'), -- Password should be hashed in production
('jane_smith', 'jane@example.com', '$2a$10$example_hash'),
('admin_user', 'admin@example.com', '$2a$10$example_hash');

-- Insert sample products
INSERT INTO products (name, description, price, seller_id) VALUES
('Textbook: Introduction to Computer Science', 'Used textbook in good condition', 45.99, 1),
('Scientific Calculator', 'TI-84 Plus, like new', 75.00, 1),
('Lab Coat', 'Size M, never used', 25.50, 2);

-- Insert sample orders
INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES
(2, 1, 1, 45.99, 'completed'),
(3, 2, 1, 75.00, 'pending');

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, message) VALUES
(1, 2, 'Is the textbook still available?'),
(2, 1, 'Yes, it is!');

-- Insert sample notifications
INSERT INTO notifications (user_id, message, is_read) VALUES
(1, 'Your product has been purchased!', false),
(2, 'Your order has been shipped', true);

-- Insert sample forum questions
INSERT INTO forum_questions (user_id, title, content) VALUES
(1, 'Best study tips for finals?', 'Looking for advice on how to prepare for upcoming finals.'),
(2, 'Where to find cheap textbooks?', 'Any recommendations for affordable textbook sources?');

-- Insert sample forum answers
INSERT INTO forum_answers (question_id, user_id, content) VALUES
(1, 2, 'Start studying early and make a schedule!'),
(1, 3, 'Practice with past papers if available.');

-- Insert sample admin user
INSERT INTO admin (username, email, password) VALUES
('admin', 'admin@rumiecollege.com', '$2a$10$example_hash');

-- Insert sample settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'Rumie College Marketplace'),
('maintenance_mode', 'false');

-- Insert sample analytics
INSERT INTO analytics (event_type, event_data) VALUES
('page_view', '{"page": "home", "user_id": 1}'),
('product_view', '{"product_id": 1, "user_id": 2}'); 