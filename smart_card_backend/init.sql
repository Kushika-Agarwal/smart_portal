CREATE DATABASE IF NOT EXISTS smart_card;
USE smart_card;

CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otp_codes (
    mobile VARCHAR(15),
    otp_hash VARCHAR(255),
    expires_at DATETIME
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query_number VARCHAR(20),
    application_id VARCHAR(100) NOT NULL,
    payment_transfer_no VARCHAR(100) NOT NULL,
    urc_code VARCHAR(100) NOT NULL,
    query_text VARCHAR(300) NOT NULL,
    status VARCHAR(50) DEFAULT 'Submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_response TEXT,
    responded_at TIMESTAMP NULL,
    user_email VARCHAR(255)
);