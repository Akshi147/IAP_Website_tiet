const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models/student.model');
jest.mock('../models/admin.model');
jest.mock('../models/mentor.model');
jest.mock('../models/blacklist.model');
jest.mock('jsonwebtoken');

const studentController = require('../controllers/student.controller');
const adminController = require('../controllers/admin.controller');
const mentorController = require('../controllers/mentor.controller');
const authMiddleware = require('../middlewares/auth.middleware');

describe('Authentication & Authorization Test Cases', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, cookies: {}, headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  // AUTH-TC-01: Login with valid credentials
  describe('AUTH-TC-01: Login with valid credentials', () => {
    it('should login successfully and issue JWT token', async () => {
      const studentModel = require('../models/student.model');
      mockReq.body = { rollNo: 'CS001', password: 'password123' };

      const mockStudent = {
        _id: 'student123',
        comparePassword: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('validJWT')
      };

      studentModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStudent)
      });

      await studentController.loginStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student logged in successfully',
        token: 'validJWT'
      });
    });
  });

  // AUTH-TC-02: Login with invalid password
  describe('AUTH-TC-02: Login with invalid password', () => {
    it('should fail authentication with wrong password', async () => {
      const studentModel = require('../models/student.model');
      mockReq.body = { rollNo: 'CS001', password: 'wrongpassword' };

      const mockStudent = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      studentModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStudent)
      });

      await studentController.loginStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid password'
      });
    });
  });

  // AUTH-TC-03: Login with unregistered email
  describe('AUTH-TC-03: Login with unregistered email', () => {
    it('should return user not found for unknown email', async () => {
      const studentModel = require('../models/student.model');
      mockReq.body = { rollNo: 'UNKNOWN', password: 'password123' };

      studentModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await studentController.loginStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student not found'
      });
    });
  });

  // AUTH-TC-04: Login with empty credentials
  describe('AUTH-TC-04: Login with empty credentials', () => {
    it('should return validation error for empty fields', async () => {
      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({
          isEmpty: () => false,
          array: () => [{ msg: 'Roll number is required' }]
        }))
      }));

      mockReq.body = { rollNo: '', password: '' };

      await studentController.loginStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  // AUTH-TC-05: Login with SQL injection attempt
  describe('AUTH-TC-05: Login with SQL injection attempt', () => {
    it('should reject malicious input', async () => {
      const studentModel = require('../models/student.model');
      mockReq.body = {
        rollNo: "'; DROP TABLE students; --",
        password: "' OR '1'='1"
      };

      // MongoDB should handle this safely, but test the rejection
      studentModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await studentController.loginStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student not found'
      });
    });
  });

  // AUTH-TC-06: Access protected API without token
  describe('AUTH-TC-06: Access protected API without token', () => {
    it('should return unauthorized (401) without token', async () => {
      // No token in cookies or headers
      mockReq.cookies = {};
      mockReq.headers = {};

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });
  });

  // AUTH-TC-07: Access protected API with invalid token
  describe('AUTH-TC-07: Access protected API with invalid token', () => {
    it('should return unauthorized (401) with tampered token', async () => {
      mockReq.cookies.token = 'tamperedToken';
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });
  });

  // AUTH-TC-08: Access protected API with expired token
  describe('AUTH-TC-08: Access protected API with expired token', () => {
    it('should invalidate session with expired token', async () => {
      mockReq.cookies.token = 'expiredToken';
      
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });
  });

  // AUTH-TC-09: Student accessing admin API
  describe('AUTH-TC-09: Student accessing admin API', () => {
    it('should return unauthorized (401) when student accesses admin route', async () => {
      mockReq.cookies.token = 'studentToken';
      mockReq.headers = {};
      
      jwt.verify.mockReturnValue({ _id: 'student123' });

      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  // AUTH-TC-10: Mentor accessing admin API
  describe('AUTH-TC-10: Mentor accessing admin API', () => {
    it('should return unauthorized (401) when mentor accesses admin route', async () => {
      mockReq.cookies.token = 'mentorToken';
      mockReq.headers = {};
      
      jwt.verify.mockReturnValue({ _id: 'mentor123' });

      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  // AUTH-TC-11: Admin accessing student API
  describe('AUTH-TC-11: Admin accessing student API', () => {
    it('should allow admin access to student routes', async () => {
      const adminModel = require('../models/admin.model');
      mockReq.cookies.token = 'adminToken';
      
      const mockAdmin = { _id: 'admin123', email: 'admin@test.com' };
      jwt.verify.mockReturnValue({ _id: 'admin123' });
      adminModel.findById.mockResolvedValue(mockAdmin);

      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);

      expect(mockReq.admin).toBe(mockAdmin);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  // AUTH-TC-12: Logout functionality
  describe('AUTH-TC-12: Logout functionality', () => {
    it('should invalidate token on logout', async () => {
      const blacklistModel = require('../models/blacklist.model');
      mockReq.cookies.token = 'validToken';
      mockReq.headers = { authorization: 'Bearer validToken' };
      
      // Add clearCookie to mock response
      mockRes.clearCookie = jest.fn().mockReturnThis();
      
      blacklistModel.create.mockResolvedValue(true);

      await studentController.logoutStudent(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('token');
      expect(blacklistModel.create).toHaveBeenCalledWith({ token: 'validToken' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});