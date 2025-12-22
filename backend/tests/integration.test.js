const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Mock the entire app
jest.mock('../app');
jest.mock('../models/student.model');
jest.mock('../models/admin.model');
jest.mock('../models/mentor.model');

const app = require('../app');
const studentModel = require('../models/student.model');
const adminModel = require('../models/admin.model');
const mentorModel = require('../models/mentor.model');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Student Routes', () => {
    describe('POST /students/register', () => {
      it('should register a new student', async () => {
        const studentData = {
          name: 'John Doe',
          email: 'john@test.com',
          password: 'password123',
          phoneNumber: '1234567890',
          rollNo: 'CS001',
          semesterType: 'Fall',
          classSubgroup: 'A',
          branch: 'CSE',
          trainingArrangedBy: 'College',
          companyName: 'Test Company',
          companyCity: 'Test City'
        };

        studentModel.findOne.mockResolvedValue(null);
        studentModel.hashPassword.mockResolvedValue('hashedPassword');
        
        const mockStudent = {
          ...studentData,
          _id: 'student123',
          save: jest.fn().mockResolvedValue(true),
          generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };
        
        studentModel.mockImplementation(() => mockStudent);

        const response = await request(app)
          .post('/students/register')
          .send(studentData)
          .expect(201);

        expect(response.body).toHaveProperty('message', 'Student registered successfully');
        expect(response.body).toHaveProperty('token');
      });

      it('should return 400 if student already exists', async () => {
        const studentData = {
          email: 'existing@test.com',
          password: 'password123'
        };

        studentModel.findOne.mockResolvedValue({ email: 'existing@test.com' });

        const response = await request(app)
          .post('/students/register')
          .send(studentData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Student already exists');
      });
    });

    describe('POST /students/login', () => {
      it('should login student with valid credentials', async () => {
        const loginData = {
          rollNo: 'CS001',
          password: 'password123'
        };

        const mockStudent = {
          _id: 'student123',
          rollNo: 'CS001',
          comparePassword: jest.fn().mockResolvedValue(true),
          generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };

        studentModel.findOne.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockStudent)
        });

        const response = await request(app)
          .post('/students/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Student logged in successfully');
        expect(response.body).toHaveProperty('token');
      });

      it('should return 400 for invalid credentials', async () => {
        const loginData = {
          rollNo: 'CS001',
          password: 'wrongpassword'
        };

        studentModel.findOne.mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });

        const response = await request(app)
          .post('/students/login')
          .send(loginData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Student not found');
      });
    });

    describe('GET /students/profile', () => {
      it('should return student profile when authenticated', async () => {
        const mockStudent = {
          _id: 'student123',
          name: 'John Doe',
          email: 'john@test.com',
          rollNo: 'CS001'
        };

        // Mock authentication middleware
        const response = await request(app)
          .get('/students/profile')
          .set('Authorization', 'Bearer validToken')
          .expect(200);

        expect(response.body).toHaveProperty('student');
      });

      it('should return 401 when not authenticated', async () => {
        const response = await request(app)
          .get('/students/profile')
          .expect(401);

        expect(response.body).toHaveProperty('message');
      });
    });
  });

  describe('Admin Routes', () => {
    describe('POST /admin/register', () => {
      it('should register a new admin', async () => {
        const adminData = {
          email: 'admin@test.com',
          password: 'password123',
          branch: 'CSE'
        };

        adminModel.findOne.mockResolvedValue(null);
        
        const mockAdmin = {
          ...adminData,
          _id: 'admin123',
          save: jest.fn().mockResolvedValue(true),
          generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };
        
        adminModel.mockImplementation(() => mockAdmin);

        const response = await request(app)
          .post('/admin/register')
          .send(adminData)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Admin created successfully');
      });
    });

    describe('POST /admin/login', () => {
      it('should login admin with valid credentials', async () => {
        const loginData = {
          email: 'admin@test.com',
          password: 'password123'
        };

        const mockAdmin = {
          _id: 'admin123',
          email: 'admin@test.com',
          password: 'password123',
          generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };

        adminModel.findOne.mockResolvedValue(mockAdmin);

        const response = await request(app)
          .post('/admin/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Admin logged in successfully');
      });
    });

    describe('GET /admin/students/under-verification', () => {
      it('should return students under verification', async () => {
        const mockStudents = [
          {
            _id: 'student1',
            name: 'John Doe',
            rollNo: 'CS001',
            mentorverified: false,
            verified: true
          }
        ];

        studentModel.find.mockResolvedValue(mockStudents);

        const response = await request(app)
          .get('/admin/students/under-verification')
          .set('Authorization', 'Bearer adminToken')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('students');
      });
    });
  });

  describe('Mentor Routes', () => {
    describe('POST /mentors/register', () => {
      it('should register a mentor with tagged email', async () => {
        const mentorData = {
          email: 'mentor@test.com'
        };

        // Mock student with tagged mentor
        studentModel.findOne.mockResolvedValue({
          mentorEmail: 'mentor@test.com',
          name: 'John Doe'
        });

        mentorModel.findOne.mockResolvedValue(null);
        
        const mockMentor = {
          email: 'mentor@test.com',
          _id: 'mentor123',
          save: jest.fn().mockResolvedValue(true),
          generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };
        
        mentorModel.mockImplementation(() => mockMentor);

        const response = await request(app)
          .post('/mentors/register')
          .send(mentorData)
          .expect(201);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Password setup link sent.');
      });

      it('should return 404 if mentor email not tagged', async () => {
        const mentorData = {
          email: 'untagged@test.com'
        };

        studentModel.findOne.mockResolvedValue(null);

        const response = await request(app)
          .post('/mentors/register')
          .send(mentorData)
          .expect(404);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toContain('Mentor not found');
      });
    });

    describe('POST /mentors/login', () => {
      it('should login mentor with valid credentials', async () => {
        const loginData = {
          email: 'mentor@test.com',
          password: 'password123'
        };

        const mockMentor = {
          _id: 'mentor123',
          email: 'mentor@test.com',
          comparePassword: jest.fn().mockResolvedValue(true),
          generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };

        mentorModel.findOne.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockMentor)
        });

        const response = await request(app)
          .post('/mentors/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Mentor logged in successfully');
      });
    });

    describe('GET /mentors/assigned-students', () => {
      it('should return assigned students for mentor', async () => {
        const mockMentor = {
          _id: 'mentor123',
          email: 'mentor@test.com'
        };

        const mockStudents = [
          {
            _id: 'student1',
            name: 'John Doe',
            rollNo: 'CS001',
            mentorEmail: 'mentor@test.com'
          }
        ];

        mentorModel.findById.mockResolvedValue(mockMentor);
        studentModel.find.mockResolvedValue(mockStudents);

        const response = await request(app)
          .get('/mentors/assigned-students')
          .set('Authorization', 'Bearer mentorToken')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('studentsAssigned');
      });
    });
  });

  describe('File Upload Routes', () => {
    describe('POST /students/upload/training-letter', () => {
      it('should upload training letter successfully', async () => {
        const response = await request(app)
          .post('/students/upload/training-letter')
          .set('Authorization', 'Bearer studentToken')
          .attach('file', Buffer.from('fake file content'), 'training-letter.pdf')
          .expect(200);

        expect(response.body).toHaveProperty('message', 'File uploaded successfully');
      });

      it('should return 400 if no file uploaded', async () => {
        const response = await request(app)
          .post('/students/upload/training-letter')
          .set('Authorization', 'Bearer studentToken')
          .expect(400);

        expect(response.text).toContain('No files were uploaded');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle server errors gracefully', async () => {
      studentModel.findOne.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/students/login')
        .send({ rollNo: 'CS001', password: 'password123' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication Middleware', () => {
    it('should reject requests without valid token', async () => {
      const response = await request(app)
        .get('/students/profile')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/students/profile')
        .set('Authorization', 'Bearer invalidToken')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});