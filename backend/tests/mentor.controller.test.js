const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Mock dependencies
jest.mock('../models/mentor.model');
jest.mock('../models/student.model');
jest.mock('../models/blacklist.model');
jest.mock('../models/feedbackMentorAbet.model');
jest.mock('../models/abetQuestion.model');
jest.mock('../models/feedbackQuestion.model');
jest.mock('../models/feedbackMentor.model');
jest.mock('../models/BreifProgressReport.model');
jest.mock('../models/mentorStuForm2.model');
jest.mock('../libs/nodemailer');
jest.mock('jsonwebtoken');
jest.mock('crypto');

const mentorController = require('../controllers/mentor.controller');
const mentorModel = require('../models/mentor.model');
const studentModel = require('../models/student.model');
const blacklistModel = require('../models/blacklist.model');
const FeedbackABET = require('../models/feedbackMentorAbet.model');
const AbetQuestion = require('../models/abetQuestion.model');
const FeedbackQuestion = require('../models/feedbackQuestion.model');
const FeedbackMentor = require('../models/feedbackMentor.model');
const BriefProgressReport = require('../models/BreifProgressReport.model');
const MentorStuForm2 = require('../models/mentorStuForm2.model');
const sendEmail = require('../libs/nodemailer');

const app = express();
app.use(express.json());

describe('Mentor Controller Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      mentor: {},
      cookies: {},
      headers: {}
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

  describe('registerMentor', () => {
    it('should register a new mentor successfully', async () => {
      mockReq.body = { email: 'mentor@test.com' };

      // Mock validation result
      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      // Mock student model to find tagged mentor
      studentModel.findOne.mockResolvedValue({
        mentorEmail: 'mentor@test.com',
        name: 'John Doe'
      });

      // Mock mentor model
      mentorModel.findOne.mockResolvedValue(null);
      
      const mockMentor = {
        _id: 'mentor123',
        email: 'mentor@test.com',
        save: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      };
      
      mentorModel.mockImplementation(() => mockMentor);
      sendEmail.mockResolvedValue(true);

      await mentorController.registerMentor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password setup link sent.',
        token: 'mockToken'
      });
    });

    it('should return error if mentor not tagged by student', async () => {
      mockReq.body = { email: 'untagged@test.com' };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      studentModel.findOne.mockResolvedValue(null);

      await mentorController.registerMentor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Mentor not found. Please register with the email tagged by a student.'
      });
    });

    it('should return error if mentor already verified', async () => {
      mockReq.body = { email: 'verified@test.com' };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      studentModel.findOne.mockResolvedValue({ mentorEmail: 'verified@test.com' });
      mentorModel.findOne.mockResolvedValue({ 
        email: 'verified@test.com',
        verified: true 
      });

      await mentorController.registerMentor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Mentor is already verified. Kindly Login.'
      });
    });
  });

  describe('setPassword', () => {
    it('should set password successfully with valid token', async () => {
      mockReq.params = { param: 'validToken' };
      mockReq.body = {
        password: 'newPassword123',
        name: 'John Mentor',
        designation: 'Senior Engineer',
        contact: '1234567890'
      };

      const mockDecoded = { _id: 'mentor123' };
      jwt.verify.mockReturnValue(mockDecoded);

      const mockMentor = {
        _id: 'mentor123',
        verified: false,
        save: jest.fn().mockResolvedValue(true)
      };

      mentorModel.findById.mockResolvedValue(mockMentor);
      mentorModel.hashPassword.mockResolvedValue('hashedPassword');

      await mentorController.setPassword(mockReq, mockRes);

      expect(mockMentor.password).toBe('hashedPassword');
      expect(mockMentor.verified).toBe(true);
      expect(mockMentor.name).toBe('John Mentor');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password set successfully. Registration Complete'
      });
    });

    it('should return error for invalid token', async () => {
      mockReq.params = { param: 'invalidToken' };
      mockReq.body = { password: 'password123' };

      jwt.verify.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      await mentorController.setPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized: Invalid token'
      });
    });
  });

  describe('loginMentor', () => {
    it('should login mentor with valid credentials', async () => {
      mockReq.body = {
        email: 'mentor@test.com',
        password: 'password123'
      };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      const mockMentor = {
        _id: 'mentor123',
        email: 'mentor@test.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      };

      mentorModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockMentor)
      });

      await mentorController.loginMentor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Mentor logged in successfully',
        token: 'mockToken'
      });
    });

    it('should return error for invalid credentials', async () => {
      mockReq.body = {
        email: 'mentor@test.com',
        password: 'wrongpassword'
      };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      const mockMentor = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      mentorModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockMentor)
      });

      await mentorController.loginMentor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid Password'
      });
    });
  });

  describe('logoutMentor', () => {
    it('should logout mentor successfully', async () => {
      mockReq.cookies = { token: 'mockToken' };
      mockReq.headers = { authorization: 'Bearer mockToken' };
      
      blacklistModel.create.mockResolvedValue(true);

      await mentorController.logoutMentor(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('token');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged out successfully'
      });
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      mockReq.body = { email: 'mentor@test.com' };

      const mockMentor = {
        _id: 'mentor123',
        name: 'John Mentor',
        email: 'mentor@test.com',
        generateResetToken: jest.fn().mockReturnValue('resetToken'),
        save: jest.fn().mockResolvedValue(true)
      };

      mentorModel.findOne.mockResolvedValue(mockMentor);
      sendEmail.mockResolvedValue(true);

      await mentorController.forgotPassword(mockReq, mockRes);

      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset link sent to your email. Please Check Spam Folder too',
        resetToken: 'resetToken'
      });
    });

    it('should return error if mentor not found', async () => {
      mockReq.body = { email: 'nonexistent@test.com' };
      
      mentorModel.findOne.mockResolvedValue(null);

      await mentorController.forgotPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Mentor not found'
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockReq.body = {
        token: 'validResetToken',
        newPassword: 'newPassword123'
      };

      const mockMentor = {
        _id: 'mentor123',
        resetPasswordToken: 'hashedToken',
        resetPasswordExpires: Date.now() + 3600000,
        save: jest.fn().mockResolvedValue(true)
      };

      crypto.createHash.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hashedToken')
      });

      mentorModel.findOne.mockResolvedValue(mockMentor);
      mentorModel.hashPassword.mockResolvedValue('hashedNewPassword');

      await mentorController.resetPassword(mockReq, mockRes);

      expect(mockMentor.password).toBe('hashedNewPassword');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password successfully reset!'
      });
    });
  });

  describe('getAssignedStudents', () => {
    it('should return assigned students', async () => {
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

      mockReq.mentor = mockMentor;
      mentorModel.findById.mockResolvedValue(mockMentor);
      studentModel.find.mockResolvedValue(mockStudents);

      await mentorController.getAssignedStudents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        studentsAssigned: mockStudents
      });
    });

    it('should return error if no students assigned', async () => {
      const mockMentor = {
        _id: 'mentor123',
        email: 'mentor@test.com'
      };

      mockReq.mentor = mockMentor;
      mentorModel.findById.mockResolvedValue(mockMentor);
      studentModel.find.mockResolvedValue([]);

      await mentorController.getAssignedStudents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'No students assigned.'
      });
    });
  });

  describe('getAbetForm', () => {
    it('should return ABET form with questions and existing responses', async () => {
      mockReq.params = { mentorId: 'mentor123' };

      const mockQuestions = [
        { _id: 'q1', text: 'Question 1' },
        { _id: 'q2', text: 'Question 2' }
      ];

      const mockFeedback = {
        responses: [
          { question: { _id: 'q1' }, levelOfAttainment: 3 }
        ],
        suggestedCourse: 'Advanced Programming',
        overallSatisfaction: 'Satisfied'
      };

      AbetQuestion.find.mockResolvedValue(mockQuestions);
      FeedbackABET.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockFeedback)
      });

      await mentorController.getAbetForm(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        mentorId: 'mentor123',
        suggestedCourse: 'Advanced Programming',
        overallSatisfaction: 'Satisfied',
        questions: [
          { _id: 'q1', text: 'Question 1', selectedValue: 3 },
          { _id: 'q2', text: 'Question 2', selectedValue: null }
        ]
      });
    });
  });

  describe('submitAbetForm', () => {
    it('should submit ABET form successfully', async () => {
      mockReq.params = { mentorId: 'mentor123' };
      mockReq.body = {
        levels: { 'q1': '3', 'q2': '4' },
        suggestedCourse: 'Advanced Programming',
        overallSatisfaction: 'Very Satisfied'
      };

      const mockFeedback = {
        _id: 'feedback123',
        mentor: 'mentor123',
        responses: [
          { question: 'q1', levelOfAttainment: 3 },
          { question: 'q2', levelOfAttainment: 4 }
        ]
      };

      FeedbackABET.findOneAndUpdate.mockResolvedValue(mockFeedback);

      await mentorController.submitAbetForm(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Feedback submitted successfully',
        feedback: mockFeedback
      });
    });

    it('should return error if levels object is missing', async () => {
      mockReq.params = { mentorId: 'mentor123' };
      mockReq.body = { suggestedCourse: 'Test Course' };

      await mentorController.submitAbetForm(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Levels object is required'
      });
    });
  });

  describe('getBriefProgressReport', () => {
    it('should return brief progress report', async () => {
      mockReq.params = { studentId: 'student123' };

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        name: 'John Doe',
        companyDetails: {
          companyName: 'Test Company',
          companyCity: 'Test City'
        },
        createdAt: new Date()
      };

      const mockReport = {
        _id: 'report123',
        student: 'student123',
        progressDetails: 'Good progress'
      };

      studentModel.findById.mockResolvedValue(mockStudent);
      BriefProgressReport.findOne.mockResolvedValue(mockReport);

      await mentorController.getBriefProgressReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          rollNumber: 'CS001',
          studentName: 'John Doe',
          companyName: 'Test Company',
          companyAddress: 'Test City',
          dateOfVisit: mockStudent.createdAt,
          progressReport: mockReport
        }
      });
    });

    it('should return error if student not found', async () => {
      mockReq.params = { studentId: 'invalid123' };

      studentModel.findById.mockResolvedValue(null);

      await mentorController.getBriefProgressReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Student not found'
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

      await mentorController.registerMentor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });
});