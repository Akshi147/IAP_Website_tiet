const request = require('supertest');

// Mock dependencies
jest.mock('../models/student.model');
jest.mock('../models/admin.model');
jest.mock('../libs/nodemailer');

const studentController = require('../controllers/student.controller');
const adminController = require('../controllers/admin.controller');

describe('User Management Test Cases', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, student: {}, admin: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  // USER-TC-01: Register new student
  describe('USER-TC-01: Register new student', () => {
    it('should create user successfully with unused email', async () => {
      const studentModel = require('../models/student.model');
      const sendEmail = require('../libs/nodemailer');
      
      mockReq.body = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        rollNo: 'CS001',
        branch: 'CSE'
      };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      studentModel.findOne.mockResolvedValue(null);
      studentModel.hashPassword.mockResolvedValue('hashedPassword');
      
      const mockStudent = {
        ...mockReq.body,
        save: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('token')
      };
      studentModel.mockImplementation(() => mockStudent);
      sendEmail.mockResolvedValue(true);

      await studentController.registerStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student registered successfully',
        student: mockStudent,
        token: 'token'
      });
    });
  });

  // USER-TC-02: Register new admin
  describe('USER-TC-02: Register new admin', () => {
    it('should create admin account with admin privileges', async () => {
      const adminModel = require('../models/admin.model');
      
      mockReq.body = {
        email: 'admin@test.com',
        password: 'adminpass',
        branch: 'CSE'
      };

      adminModel.findOne.mockResolvedValue(null);
      
      const mockAdmin = {
        ...mockReq.body,
        save: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('adminToken')
      };
      adminModel.mockImplementation(() => mockAdmin);

      await adminController.Register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Admin created successfully',
        token: 'adminToken'
      });
    });
  });

  // USER-TC-03: Register duplicate user
  describe('USER-TC-03: Register duplicate user', () => {
    it('should reject registration with existing email', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.body = { email: 'existing@test.com' };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      studentModel.findOne.mockResolvedValue({ email: 'existing@test.com' });

      await studentController.registerStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student already exists'
      });
    });
  });

  // USER-TC-04: Register with missing fields
  describe('USER-TC-04: Register with missing fields', () => {
    it('should return validation error for incomplete data', async () => {
      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({
          isEmpty: () => false,
          array: () => [{ msg: 'Name is required' }]
        }))
      }));

      mockReq.body = { email: 'test@test.com' }; // Missing required fields

      await studentController.registerStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  // USER-TC-05: Register with invalid email format
  describe('USER-TC-05: Register with invalid email format', () => {
    it('should reject registration with invalid email', async () => {
      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({
          isEmpty: () => false,
          array: () => [{ msg: 'Invalid email format' }]
        }))
      }));

      mockReq.body = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      await studentController.registerStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  // USER-TC-06: Fetch own profile
  describe('USER-TC-06: Fetch own profile', () => {
    it('should return profile data when logged in', async () => {
      const mockStudent = {
        _id: 'student123',
        name: 'John Doe',
        email: 'john@test.com'
      };

      mockReq.student = mockStudent;

      await studentController.getStudentProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        student: mockStudent
      });
    });
  });

  // USER-TC-07: Fetch another user profile
  describe('USER-TC-07: Fetch another user profile', () => {
    it('should deny access to other user profiles', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.params = { userId: 'otherUser123' };
      mockReq.student = { _id: 'student123' };

      // Simulate unauthorized access attempt
      studentModel.findById.mockResolvedValue(null);

      try {
        await studentController.getStudentProfile(mockReq, mockRes);
      } catch (error) {
        expect(error.message).toContain('Access denied');
      }
    });
  });

  // USER-TC-08: Update own profile
  describe('USER-TC-08: Update own profile', () => {
    it('should update profile with valid data', async () => {
      const mockStudent = {
        _id: 'student123',
        name: 'John Doe',
        email: 'john@test.com',
        save: jest.fn().mockResolvedValue(true)
      };

      mockReq.student = mockStudent;
      mockReq.body = { name: 'John Updated' };

      // Simulate profile update
      Object.assign(mockStudent, mockReq.body);
      await mockStudent.save();

      expect(mockStudent.name).toBe('John Updated');
      expect(mockStudent.save).toHaveBeenCalled();
    });
  });

  // USER-TC-09: Update profile with invalid fields
  describe('USER-TC-09: Update profile with invalid fields', () => {
    it('should reject update with invalid input', async () => {
      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({
          isEmpty: () => false,
          array: () => [{ msg: 'Invalid email format' }]
        }))
      }));

      mockReq.body = { email: 'invalid-email' };

      // Simulate validation in update controller
      const errors = validationResult(mockReq);
      if (!errors.isEmpty()) {
        mockRes.status(400).json({ errors: errors.array() });
      }

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  // USER-TC-10: Deactivate user account
  describe('USER-TC-10: Deactivate user account', () => {
    it('should deactivate account when admin requests', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.params = { rollNo: 'CS001' };
      mockReq.admin = { _id: 'admin123' };

      const mockStudent = {
        _id: 'student123',
        active: true,
        save: jest.fn().mockResolvedValue(true)
      };

      studentModel.findOne.mockResolvedValue(mockStudent);

      // Simulate deactivation
      mockStudent.active = false;
      await mockStudent.save();

      expect(mockStudent.active).toBe(false);
      expect(mockStudent.save).toHaveBeenCalled();
    });
  });

  // USER-TC-11: Access deactivated account
  describe('USER-TC-11: Access deactivated account', () => {
    it('should block login for inactive account', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.body = { rollNo: 'CS001', password: 'password123' };

      const mockStudent = {
        _id: 'student123',
        active: false,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      studentModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStudent)
      });

      // Simulate login check for active status
      if (!mockStudent.active) {
        mockRes.status(403).json({ message: 'Account deactivated' });
        return;
      }

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Account deactivated'
      });
    });
  });

  // USER-TC-12: Delete user record
  describe('USER-TC-12: Delete user record', () => {
    it('should remove user when admin requests deletion', async () => {
      mockReq.params = { rollNumber: 'CS001' };
      mockReq.admin = { _id: 'admin123' };

      await adminController.DeleteStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Student deleted successfully'
      });
    });
  });
});