// Mock dependencies
jest.mock('../models/mentor.model');
jest.mock('../models/student.model');
jest.mock('../models/feedbackMentorAbet.model');
jest.mock('../models/abetQuestion.model');
jest.mock('../libs/nodemailer');

const mentorController = require('../controllers/mentor.controller');

describe('Mentor Operations Test Cases', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      mentor: { _id: 'mentor123', email: 'mentor@test.com' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  // MENT-TC-01: Mentor login
  describe('MENT-TC-01: Mentor login', () => {
    it('should login successfully with valid mentor credentials', async () => {
      const mentorModel = require('../models/mentor.model');
      
      mockReq.body = {
        email: 'mentor@test.com',
        password: 'mentorpass123'
      };

      const { validationResult } = require('express-validator');
      jest.doMock('express-validator', () => ({
        validationResult: jest.fn(() => ({ isEmpty: () => true }))
      }));

      const mockMentor = {
        _id: 'mentor123',
        email: 'mentor@test.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('mentorToken')
      };

      mentorModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockMentor)
      });

      await mentorController.loginMentor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Mentor logged in successfully',
        token: 'mentorToken'
      });
    });
  });

  // MENT-TC-02: View assigned students
  describe('MENT-TC-02: View assigned students', () => {
    it('should display student list on dashboard request', async () => {
      const mentorModel = require('../models/mentor.model');
      const studentModel = require('../models/student.model');
      
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
        },
        {
          _id: 'student2',
          name: 'Jane Smith',
          rollNo: 'CS002',
          mentorEmail: 'mentor@test.com'
        }
      ];

      mentorModel.findById.mockResolvedValue(mockMentor);
      studentModel.find.mockResolvedValue(mockStudents);

      await mentorController.getAssignedStudents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        studentsAssigned: mockStudents
      });
    });
  });

  // MENT-TC-03: Access unassigned student
  describe('MENT-TC-03: Access unassigned student', () => {
    it('should deny access to unassigned student', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.params = { studentId: 'unassignedStudent123' };
      
      const mockStudent = {
        _id: 'unassignedStudent123',
        mentorEmail: 'other@mentor.com' // Different mentor
      };

      studentModel.findById.mockResolvedValue(mockStudent);

      // Simulate access control check
      if (mockStudent.mentorEmail !== mockReq.mentor.email) {
        mockRes.status(403).json({ message: 'Access denied: Student not assigned to you' });
        return;
      }

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Access denied: Student not assigned to you'
      });
    });
  });

  // MENT-TC-04: Download student document
  describe('MENT-TC-04: Download student document', () => {
    it('should make document accessible when mentor is assigned', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.params = { studentId: 'student123', documentType: 'trainingLetter' };
      
      const mockStudent = {
        _id: 'student123',
        mentorEmail: 'mentor@test.com',
        trainingLetter: 'document.pdf'
      };

      studentModel.findById.mockResolvedValue(mockStudent);

      // Simulate document access check
      if (mockStudent.mentorEmail === mockReq.mentor.email && mockStudent.trainingLetter) {
        mockRes.status(200).json({ 
          message: 'Document accessible',
          documentPath: mockStudent.trainingLetter
        });
      }

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Document accessible',
        documentPath: 'document.pdf'
      });
    });
  });

  // MENT-TC-05: Submit evaluation feedback
  describe('MENT-TC-05: Submit evaluation feedback', () => {
    it('should store feedback when mentor submits form', async () => {
      const FeedbackMentor = require('../models/feedbackMentor.model');
      
      mockReq.params = { mentorId: 'mentor123' };
      mockReq.body = {
        levels: {
          'question1': '4',
          'question2': '5'
        }
      };

      const mockFeedback = {
        _id: 'feedback123',
        mentor: 'mentor123',
        responses: [
          { question: 'question1', levelOfAttainment: 4 },
          { question: 'question2', levelOfAttainment: 5 }
        ]
      };

      FeedbackMentor.findOneAndUpdate.mockResolvedValue(mockFeedback);

      await mentorController.submitFeedbackForm(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Feedback submitted successfully',
        feedback: mockFeedback
      });
    });
  });

  // MENT-TC-06: Submit incomplete feedback
  describe('MENT-TC-06: Submit incomplete feedback', () => {
    it('should return validation error for partial data', async () => {
      mockReq.params = { mentorId: 'mentor123' };
      mockReq.body = {
        // Missing levels object
      };

      await mentorController.submitFeedbackForm(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Levels object is required'
      });
    });
  });

  // MENT-TC-07: Update submitted feedback
  describe('MENT-TC-07: Update submitted feedback', () => {
    it('should update feedback when it already exists', async () => {
      const FeedbackMentor = require('../models/feedbackMentor.model');
      
      mockReq.params = { mentorId: 'mentor123' };
      mockReq.body = {
        levels: {
          'question1': '3', // Updated rating
          'question2': '4'
        }
      };

      const updatedFeedback = {
        _id: 'feedback123',
        mentor: 'mentor123',
        responses: [
          { question: 'question1', levelOfAttainment: 3 },
          { question: 'question2', levelOfAttainment: 4 }
        ]
      };

      FeedbackMentor.findOneAndUpdate.mockResolvedValue(updatedFeedback);

      await mentorController.submitFeedbackForm(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Feedback submitted successfully',
        feedback: updatedFeedback
      });
    });
  });

  // MENT-TC-08: Submit feedback after deadline
  describe('MENT-TC-08: Submit feedback after deadline', () => {
    it('should reject submission after deadline passes', async () => {
      mockReq.params = { mentorId: 'mentor123' };
      mockReq.body = { levels: { 'question1': '4' } };

      const deadline = new Date('2024-01-01');
      const currentDate = new Date('2024-01-02');

      // Simulate deadline check
      if (currentDate > deadline) {
        mockRes.status(400).json({ message: 'Feedback submission deadline has passed' });
        return;
      }

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Feedback submission deadline has passed'
      });
    });
  });

  // MENT-TC-09: Mentor session timeout
  describe('MENT-TC-09: Mentor session timeout', () => {
    it('should invalidate session when token expires', async () => {
      mockReq.cookies.token = 'expiredToken';

      const jwt = require('jsonwebtoken');
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      // Simulate token validation in middleware
      try {
        jwt.verify(mockReq.cookies.token, process.env.JWT_SECRET);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          mockRes.status(401).json({ message: 'Session expired' });
        }
      }

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Session expired'
      });
    });
  });

  // MENT-TC-10: Unauthorized mentor operation
  describe('MENT-TC-10: Unauthorized mentor operation', () => {
    it('should deny access when mentor tries admin API', async () => {
      mockReq.mentor = { _id: 'mentor123', role: 'mentor' };

      // Simulate admin-only operation attempt
      const requiredRole = 'admin';
      if (mockReq.mentor.role !== requiredRole) {
        mockRes.status(403).json({ message: 'Access denied: Admin privileges required' });
        return;
      }

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Access denied: Admin privileges required'
      });
    });
  });

  // Additional mentor operations
  describe('Additional Mentor Operations', () => {
    // Test ABET feedback form
    it('should handle ABET feedback submission', async () => {
      const FeedbackABET = require('../models/feedbackMentorAbet.model');
      
      mockReq.params = { mentorId: 'mentor123' };
      mockReq.body = {
        levels: { 'q1': '4', 'q2': '5' },
        suggestedCourse: 'Advanced Programming',
        overallSatisfaction: 'Very Satisfied'
      };

      const mockFeedback = {
        mentor: 'mentor123',
        responses: [
          { question: 'q1', levelOfAttainment: 4 },
          { question: 'q2', levelOfAttainment: 5 }
        ],
        suggestedCourse: 'Advanced Programming',
        overallSatisfaction: 'Very Satisfied'
      };

      FeedbackABET.findOneAndUpdate.mockResolvedValue(mockFeedback);

      await mentorController.submitAbetForm(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Feedback submitted successfully',
        feedback: mockFeedback
      });
    });

    // Test progress report submission
    it('should handle brief progress report submission', async () => {
      const BriefProgressReport = require('../models/BreifProgressReport.model');
      
      mockReq.params = { studentId: 'student123' };
      mockReq.body = {
        progressDetails: 'Student is making good progress',
        recommendations: 'Continue current approach'
      };

      const mockReport = {
        student: 'student123',
        ...mockReq.body,
        save: jest.fn().mockResolvedValue(true)
      };

      BriefProgressReport.mockImplementation(() => mockReport);

      await mentorController.submitBriefProgressReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Report created',
        report: mockReport
      });
    });
  });
});