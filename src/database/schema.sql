-- HRIS Database Schema for Novem Eco Resort
-- Created: 2026-05-16

-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments Table
CREATE TABLE departments (
  department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_name VARCHAR(100) NOT NULL UNIQUE,
  head_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departments_head_id ON departments(head_id);

-- Roles Table
CREATE TABLE roles (
  role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name VARCHAR(100) NOT NULL UNIQUE,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE employees (
  employee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  work_email VARCHAR(100) NOT NULL UNIQUE,
  department_id UUID NOT NULL REFERENCES departments(department_id),
  role_id UUID NOT NULL REFERENCES roles(role_id),
  manager_id UUID REFERENCES employees(employee_id),
  hire_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  manager VARCHAR(100),
  manager_ute DATE,
  status_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_role_id ON employees(role_id);
CREATE INDEX idx_employees_manager_id ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(status);

-- Job Postings Table
CREATE TABLE job_postings (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_title VARCHAR(100) NOT NULL,
  department_id UUID NOT NULL REFERENCES departments(department_id),
  hiring_manager_id UUID NOT NULL REFERENCES employees(employee_id),
  hiring_manager_id_alt UUID REFERENCES employees(employee_id),
  job_description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  posted_date DATE DEFAULT CURRENT_DATE,
  closed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_postings_department_id ON job_postings(department_id);
CREATE INDEX idx_job_postings_hiring_manager ON job_postings(hiring_manager_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);

-- Applications Table
CREATE TABLE applications (
  application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_name VARCHAR(100) NOT NULL,
  candidate_email VARCHAR(100) NOT NULL,
  job_id UUID NOT NULL REFERENCES job_postings(job_id),
  resume_file VARCHAR(255),
  hire_title DATE,
  resume_file_upload TIMESTAMP,
  application_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(application_status);

-- Leave Requests Table
CREATE TABLE leave_requests (
  leave_request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(employee_id),
  reviewer_id UUID NOT NULL REFERENCES employees(employee_id),
  leave_type VARCHAR(50) DEFAULT 'vacation',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_reviewer_id ON leave_requests(reviewer_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- Performance Reviews Table
CREATE TABLE performance_reviews (
  review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(employee_id),
  reviewer_id UUID NOT NULL REFERENCES employees(employee_id),
  review_cycle VARCHAR(50) DEFAULT 'Q1',
  rating NUMERIC(3,2) CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_performance_reviews_employee_id ON performance_reviews(employee_id);
CREATE INDEX idx_performance_reviews_reviewer_id ON performance_reviews(reviewer_id);
CREATE INDEX idx_performance_reviews_cycle ON performance_reviews(review_cycle);

-- Sample Data
-- Departments
INSERT INTO departments (department_name) VALUES
  ('Human Resources'),
  ('Operations'),
  ('Front Office'),
  ('Housekeeping'),
  ('Food & Beverage'),
  ('Maintenance'),
  ('Marketing');

-- Roles
INSERT INTO roles (role_name, permissions, description) VALUES
  ('HR Manager', ARRAY['read_employees', 'create_employees', 'update_employees', 'manage_leaves', 'manage_reviews'], 'Manages all HR operations'),
  ('Department Head', ARRAY['read_employees', 'approve_leaves', 'create_reviews'], 'Manages department and approves leaves'),
  ('Employee', ARRAY['read_profile', 'request_leave', 'view_reviews'], 'Regular employee'),
  ('Manager', ARRAY['read_employees', 'approve_leaves', 'manage_team', 'create_reviews'], 'Team manager');
