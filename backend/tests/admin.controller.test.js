const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Mock dependencies
jest.mock('../models/admin.model');
jest.mock('../models/student.model');
jest.mock('../models/blacklist.model');
jest.mock('../libs/nodemailer');
jest.mock('exceljs');
jest.mock('moment');

const adminController = require('../controllers/admin.controller');
const AdminModel = require('../models/admin.model');
const StudentModel = require('../models/student.model');
const blacklistModel = require('../models/blacklist.model');
const sendEmail = require('../libs/nodemailer');
const ExcelJS = require('exceljs');
const moment = require('moment');

const app = express();
app.use(express.json());

describe('Admin Controller Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      admin: {},
      file: null,
      cookies: {},
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('Register', () => {
    it('should register a new admin successfully', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'password123',
        branch: 'CSE'
      };

      mockReq.body = adminData;

      AdminModel.findOne.mockResolvedValue(null);
      
      const mockAdmin = {
        _id: 'admin123',
        ...adminData,
        save: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      };
      
      AdminModel.mockImplementation(() => mockAdmin);

      await adminController.Register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Admin created successfully',
        token: 'mockToken'
      });
      expect(mockRes.cookie).toHaveBeenCalledWith('token', 'mockToken');
    });

    it('should return error if admin already exists', async () => {
      mockReq.body = {
        email: 'existing@test.com',
        password: 'password123',
        branch: 'CSE'
      };

      AdminModel.findOne.mockResolvedValue({ email: 'existing@test.com' });

      await adminController.Register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin already exists'
      });
    });
  });

  describe('Login', () => {
    it('should login admin with valid credentials', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        password: 'password123'
      };

      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@test.com',
        password: 'password123',
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      };

      AdminModel.findOne.mockResolvedValue(mockAdmin);

      await adminController.Login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Admin logged in successfully',
        token: 'mockToken'
      });
    });

    it('should return error for invalid credentials', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };

      const mockAdmin = {
        email: 'admin@test.com',
        password: 'correctpassword'
      };

      AdminModel.findOne.mockResolvedValue(mockAdmin);

      await adminController.Login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid password'
      });
    });

    it('should return error if admin not found', async () => {
      mockReq.body = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      AdminModel.findOne.mockResolvedValue(null);

      await adminController.Login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin not found'
      });
    });
  });

  describe('Logout', () => {
    it('should logout admin successfully', async () => {
      mockReq.cookies = { token: 'mockToken' };
      mockReq.headers = { authorization: 'Bearer mockToken' };
      
      blacklistModel.create.mockResolvedValue(true);

      await adminController.Logout(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('token');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Admin logged out successfully'
      });
    });
  });

  describe('GetProfile', () => {
    it('should return admin profile', async () => {
      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@test.com',
        branch: 'CSE'
      };

      mockReq.admin = mockAdmin;

      await adminController.GetProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Admin found',
        admin: mockAdmin
      });
    });

    it('should return error if admin not found', async () => {
      mockReq.admin = null;

      await adminController.GetProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin not found'
      });
    });
  });

  describe('ForgotPassword', () => {
    it('should send password reset email', async () => {
      mockReq.body = { email: 'admin@test.com' };

      const mockAdmin = {
        email: 'admin@test.com',
        password: 'password123'
      };

      AdminModel.findOne.mockResolvedValue(mockAdmin);
      sendEmail.mockResolvedValue(true);

      await adminController.ForgotPassword(mockReq, mockRes);

      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset link sent to your email'
      });
    });

    it('should return error if admin not found', async () => {
      mockReq.body = { email: 'nonexistent@test.com' };
      
      AdminModel.findOne.mockResolvedValue(null);

      await adminController.ForgotPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin not found'
      });
    });
  });

  describe('ChangePassword', () => {
    it('should change password successfully', async () => {
      mockReq.body = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword'
      };

      const mockAdmin = {
        password: 'oldpassword',
        email: 'admin@test.com',
        save: jest.fn().mockResolvedValue(true)
      };

      mockReq.admin = mockAdmin;
      moment.mockReturnValue({
        format: jest.fn().mockReturnValue('January 1st 2024, 12:00:00 PM')
      });
      sendEmail.mockResolvedValue(true);

      await adminController.ChangePassword(mockReq, mockRes);

      expect(mockAdmin.password).toBe('newpassword');
      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password changed successfully, and email notification sent.'
      });
    });

    it('should return error for invalid current password', async () => {
      mockReq.body = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword'
      };

      const mockAdmin = {
        password: 'correctpassword'
      };

      mockReq.admin = mockAdmin;

      await adminController.ChangePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid current password'
      });
    });

    it('should return error if new password is same as current', async () => {
      mockReq.body = {
        currentPassword: 'password123',
        newPassword: 'password123'
      };

      const mockAdmin = {
        password: 'password123'
      };

      mockReq.admin = mockAdmin;

      await adminController.ChangePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'New password cannot be the same as the current password'
      });
    });
  });

  describe('UnderDocumentVerification', () => {
    it('should return students under document verification', async () => {
      const mockStudents = [
        {
          _id: 'student1',
          name: 'John Doe',
          rollNo: 'CS001',
          mentorverified: false,
          verified: true,
          trainingLetter: 'letter1.pdf',
          feeReceipt: 'receipt1.pdf'
        }
      ];

      StudentModel.find.mockResolvedValue(mockStudents);

      await adminController.UnderDocumentVerification(mockReq, mockRes);

      expect(StudentModel.find).toHaveBeenCalledWith({
        mentorverified: false,
        verified: true,
        trainingLetter: { $ne: null },
        feeReceipt: { $ne: null }
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        students: mockStudents
      });
    });
  });

  describe('DeleteStudent', () => {
    it('should delete student successfully', async () => {
      mockReq.params = { rollNumber: 'CS001' };

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        name: 'John Doe'
      };

      StudentModel.findOneAndDelete.mockResolvedValue(mockStudent);

      await adminController.DeleteStudent(mockReq, mockRes);

      expect(StudentModel.findOneAndDelete).toHaveBeenCalledWith({ rollNo: 'CS001' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Student deleted successfully'
      });
    });

    it('should return error if student not found', async () => {
      mockReq.params = { rollNumber: 'INVALID' };

      StudentModel.findOneAndDelete.mockResolvedValue(null);

      await adminController.DeleteStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Student not found'
      });
    });
  });

  describe('generateExcelReport', () => {
    it('should generate excel report successfully', async () => {
      mockReq.body = {
        year: '2024',
        branch: 'CSE',
        semester: 'Fall',
        faculty: 'faculty@test.com',
        semesterType: 'Project Semester'
      };
      mockReq.params = { reportNumber: '1' };

      const mockStudents = [
        {
          rollNo: 'CS001',
          name: 'John Doe',
          email: 'john@test.com',
          phoneNumber: '1234567890',
          branch: 'CSE',
          classSubgroup: 'A'
        }
      ];

      StudentModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStudents)
      });

      const mockWorkbook = {
        addWorksheet: jest.fn().mockReturnValue({
          addRow: jest.fn()
        }),
        xlsx: {
          write: jest.fn().mockResolvedValue(true)
        }
      };

      ExcelJS.Workbook.mockImplementation(() => mockWorkbook);

      await adminController.generateExcelReport(mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should return error for invalid report number', async () => {
      mockReq.params = { reportNumber: '10' };
      mockReq.body = { year: '2024' };

      await adminController.generateExcelReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid report number'
      });
    });
  });

  describe('VerifyPhase2', () => {
    it('should verify phase2 for student', async () => {
      mockReq.params = { rollNo: 'CS001' };

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        phase3verified: false,
        save: jest.fn().mockResolvedValue(true)
      };

      StudentModel.findOne.mockResolvedValue(mockStudent);

      await adminController.VerifyPhase2(mockReq, mockRes);

      expect(mockStudent.phase3verified).toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Student verified successfully'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      mockReq.body = { email: 'test@test.com' };
      
      AdminModel.findOne.mockRejectedValue(new Error('Database error'));

      await adminController.Register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error'
      });
    });
  });
});