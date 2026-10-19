CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255), 
    notify_time DATETIME,
    is_complete BOOLEAN DEFAULT FALSE,
    type ENUM('Personal', 'Shared') DEFAULT 'Personal', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (title, description, type) VALUES 
('Belajar PHP Modular', 'Memecah file HTML menjadi PHP', 'Personal'),
('Kerja Kelompok Web', 'Mengerjakan tugas E04 bersama tim', 'Shared');