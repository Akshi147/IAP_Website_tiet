const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock dependencies
jest.mock('../models/student.model');
jest.mock('../models/blacklist.model');
jest.mock('../models/fortnightly.model');
jest.mock('../libs/nodemailer');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

const studentController = require('../controllers/student.controller');
const studentModel = require('../models/student.model');
const blacklistModel = require('../models/blacklist.model');
const fortnightlySchema = require('../models/fortnightly.model');
const sendEmail = require('../libs/nodemailer');

const app = express();
app.use(express.json());

describe('Student Controller Tests', () => {
  // AUTH-TC-01, AUTH-TC-02, AUTH-TC-03, AUTH-TC-04, AUTH-TC-12
  // USER-TC-01, USER-TC-06
  // DOC-TC-01, DOC-TC-06, DOC-TC-10
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      student: {},
      file: null,
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('registerStudent', () => {
    it('should register a new student successfully', async () => {
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

      mockReq.body = studentData;

      // Mock validation result
      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      // Mock student model methods
      studentModel.findOne.mockResolvedValue(null);
      studentModel.hashPassword.mockResolvedValue('hashedPassword');
      
      const mockStudent = {
        _id: 'student123',
        ...studentData,
        password: 'hashedPassword',
        save: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      };
      
      studentModel.mockImplementation(() => mockStudent);
      fortnightlySchema.create.mockResolvedValue(true);
      sendEmail.mockResolvedValue(true);

      await studentController.registerStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student registered successfully',
        student: mockStudent,
        token: 'mockToken'
      });
    });

    it('should return error if student already exists', async () => {
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

  describe('loginStudent', () => {
    it('should login student with valid credentials', async () => {
      mockReq.body = {
        rollNo: 'CS001',
        password: 'password123'
      };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        comparePassword: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      };

      studentModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStudent)
      });

      await studentController.loginStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student logged in successfully',
        token: 'mockToken'
      });
    });

    it('should return error for invalid credentials', async () => {
      mockReq.body = {
        rollNo: 'CS001',
        password: 'wrongpassword'
      };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

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

  describe('verifyStudent', () => {
    it('should verify student with valid token', async () => {
      mockReq.params = { param: 'validToken' };
      
      const mockDecoded = { _id: 'student123' };
      jwt.verify.mockReturnValue(mockDecoded);

      const mockStudent = {
        _id: 'student123',
        verified: false,
        save: jest.fn().mockResolvedValue(true)
      };

      studentModel.findById.mockResolvedValue(mockStudent);

      await studentController.verifyStudent(mockReq, mockRes);

      expect(mockStudent.verified).toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student verified successfully',
        student: mockStudent
      });
    });

    it('should return error for invalid token', async () => {
      mockReq.params = { param: 'invalidToken' };
      
      jwt.verify.mockImplementation(() => {
        throw new Error('JsonWebTokenError');
      });

      await studentController.verifyStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('getStudentProfile', () => {
    it('should return student profile', async () => {
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

  describe('logoutStudent', () => {
    it('should logout student successfully', async () => {
      mockReq.cookies = { token: 'mockToken' };
      mockReq.headers = { authorization: 'Bearer mockToken' };
      
      blacklistModel.create.mockResolvedValue(true);

      await studentController.logoutStudent(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('token');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged out successfully'
      });
    });
  });

  describe('uploadFile', () => {
    it('should upload training letter successfully', async () => {
      mockReq.file = { filename: 'training-letter.pdf' };
      mockReq.student = {
        save: jest.fn().mockResolvedValue(true)
      };

      await studentController.uploadFile(mockReq, mockRes);

      expect(mockReq.student.trainingLetter).toBe('training-letter.pdf');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'File uploaded successfully'
      });
    });

    it('should return error if no file uploaded', async () => {
      mockReq.file = null;

      await studentController.uploadFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      mockReq.body = { rollNo: 'CS001' };

      const mockStudent = {
        _id: 'student123',
        name: 'John Doe',
        email: 'john@test.com',
        generateResetToken: jest.fn().mockReturnValue('resetToken'),
        save: jest.fn().mockResolvedValue(true)
      };

      studentModel.findOne.mockResolvedValue(mockStudent);
      sendEmail.mockResolvedValue(true);

      await studentController.forgotPassword(mockReq, mockRes);

      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password reset link sent to your email.Please Check Spam Folder too'
      });
    });

    it('should return error if student not found', async () => {
      mockReq.body = { rollNo: 'INVALID' };
      
      studentModel.findOne.mockResolvedValue(null);

      await studentController.forgotPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student not found'
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockReq.body = {
        token: 'validResetToken',
        newPassword: 'newPassword123'
      };

      const mockStudent = {
        _id: 'student123',
        resetPasswordToken: 'hashedToken',
        resetPasswordExpires: Date.now() + 3600000,
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock crypto hash
      const crypto = require('crypto');
      jest.doMock('crypto', () => ({
        createHash: jest.fn(() => ({
          update: jest.fn().mockReturnThis(),
          digest: jest.fn().mockReturnValue('hashedToken')
        }))
      }));

      studentModel.findOne.mockResolvedValue(mockStudent);
      studentModel.hashPassword.mockResolvedValue('hashedNewPassword');

      await studentController.resetPassword(mockReq, mockRes);

      expect(mockStudent.password).toBe('hashedNewPassword');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password successfully reset!'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      mockReq.body = { email: 'test@test.com' };
      
      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      studentModel.findOne.mockRejectedValue(new Error('Database error'));

      await studentController.registerStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });
  });
});