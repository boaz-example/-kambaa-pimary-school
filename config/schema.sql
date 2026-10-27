-- ==========================================
-- ACK KAMBAA PRIMARY SCHOOL DATABASE
-- ==========================================

DROP DATABASE IF EXISTS ack_kambaa;

CREATE DATABASE ack_kambaa
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ack_kambaa;

-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','teacher','parent') NOT NULL,
    phone VARCHAR(20),
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- CLASSES TABLE
-- ==========================================

CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL UNIQUE,
    class_teacher_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_class_teacher
    FOREIGN KEY (class_teacher_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- ==========================================
-- SUBJECTS TABLE
-- ==========================================

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SAMPLE DATA
-- ==========================================

INSERT INTO classes (class_name) VALUES
('Grade 1'),
('Grade 2'),
('Grade 3'),
('Grade 4'),
('Grade 5'),
('Grade 6'),
('Grade 7'),
('Grade 8');

INSERT INTO subjects (subject_name) VALUES
('Mathematics'),
('English'),
('Kiswahili'),
('Science'),
('Social Studies'),
('CRE'),
('Agriculture'),
('Creative Arts'),
('Music'),
('Physical Education');
-- ==========================================
-- ADMISSIONS TABLE
-- ==========================================

CREATE TABLE admissions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NULL,
    gender ENUM('male','female') NULL,

    requested_class_id INT NULL,

    parent_name VARCHAR(150) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(150) NULL,

    status ENUM('pending','accepted','rejected')
        DEFAULT 'pending',

    reviewed_by INT NULL,
    reviewed_at DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admission_class
        FOREIGN KEY (requested_class_id)
        REFERENCES classes(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_admission_reviewer
        FOREIGN KEY (reviewed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);