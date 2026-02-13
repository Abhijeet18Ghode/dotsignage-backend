-- Seed data for Digital Signage System
-- Phase-1 MVP

-- Insert default admin user (password: admin123)
-- Note: In production, hash this password properly
INSERT INTO users (email, password_hash) VALUES 
('admin@signage.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq');

-- Insert sample screens
INSERT INTO screens (name, device_code, location) VALUES 
('Lobby Screen', 'LOBBY001', 'Main Lobby'),
('Cafeteria Screen', 'CAFE001', 'Employee Cafeteria'),
('Conference Room A', 'CONF001', 'Conference Room A');

-- Insert sample media
INSERT INTO media (name, file_path, file_type, duration) VALUES 
('Welcome Image', 'media/welcome.jpg', 'image', 10),
('Company Video', 'media/company-intro.mp4', 'video', 30),
('Announcements', 'media/announcements.jpg', 'image', 8);

-- Insert sample playlist
INSERT INTO playlists (name, description) VALUES 
('Default Playlist', 'Default content for all screens');

-- Link media to playlist
INSERT INTO playlist_media (playlist_id, media_id, order_index) 
SELECT 
    p.id,
    m.id,
    ROW_NUMBER() OVER (ORDER BY m.created_at) - 1
FROM playlists p, media m 
WHERE p.name = 'Default Playlist';

-- Assign playlist to screens
INSERT INTO screen_assignments (screen_id, playlist_id)
SELECT s.id, p.id 
FROM screens s, playlists p 
WHERE p.name = 'Default Playlist';