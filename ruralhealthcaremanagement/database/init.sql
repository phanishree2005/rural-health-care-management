-- Create Database
CREATE DATABASE IF NOT EXISTS rural_healthcare;
USE rural_healthcare;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    disease VARCHAR(100),
    village VARCHAR(100),
    doctor_assigned VARCHAR(100),
    date_of_visit DATE,
    treatment_details TEXT,
    medicine_cost DOUBLE DEFAULT 0.0,
    consultation_cost DOUBLE DEFAULT 0.0,
    total_cost DOUBLE DEFAULT 0.0,
    contact_number VARCHAR(20)
);

-- Sample Data (Password is 'password123' hashed with BCrypt)
INSERT INTO users (username, password, name, role) VALUES 
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'System Admin', 'ADMIN'),
('doctor1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'Dr. Rajesh Kumar', 'DOCTOR'),
('recp1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'Suresh Kumar', 'RECEPTIONIST');

INSERT INTO patients (patient_id, name, age, gender, disease, village, doctor_assigned, date_of_visit, treatment_details, medicine_cost, consultation_cost, total_cost, contact_number) VALUES 
('PAT-001', 'Rahul Sharma', 35, 'Male', 'Malaria', 'Rampur', 'Dr. Rajesh Kumar', '2026-05-01', 'Antimalarial drugs prescribed', 450.0, 500.0, 950.0, '+91 9876543210'),
('PAT-002', 'Priya Devi', 28, 'Female', 'Typhoid', 'Sonpur', 'Dr. Rajesh Kumar', '2026-05-02', 'Antibiotics and rest', 600.0, 500.0, 1100.0, '+91 9876543211'),
('PAT-003', 'Amit Singh', 42, 'Male', 'Dengue', 'Rampur', 'Dr. Rajesh Kumar', '2026-05-03', 'Fluid replacement therapy', 800.0, 500.0, 1300.0, '+91 9876543212');
