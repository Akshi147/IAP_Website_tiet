const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/student.model');
jest.mock('../models/admin.model');
jest.mock('../models/mentor.model');
jest.mock('../models/blacklist.model');

const authMiddleware = require('../middlewares/auth.middleware');
const studentModel = require('../models/student.model');
const adminModel = require('../models/admin.model');
const mentorModel = require('../models/mentor.model');
const blacklistModel = require('../models/blacklist.model');

describe('Authentication Middleware Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      cookies: {},
      headers: {},
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('Student Authentication', () => {
    it('should authenticate valid student token from cookies', async () => {
      const mockToken = 'validStudentToken';
      const mockDecoded = { _id: 'student123' };
      const mockStudent = {
        _id: 'student123',
        name: 'John Doe',
        email: 'john@test.com'
      };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      studentModel.findById.mockResolvedValue(mockStudent);

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(blacklistModel.findOne).toHaveBeenCalledWith({ token: mockToken });
      expect(studentModel.findById).toHaveBeenCalledWith('student123');
      expect(mockReq.student).toBe(mockStudent);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should authenticate valid student token from headers', async () => {
      const mockToken = 'validStudentToken';
      const mockDecoded = { _id: 'student123' };
      const mockStudent = {
        _id: 'student123',
        name: 'John Doe',
        email: 'john@test.com'
      };

      mockReq.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      studentModel.findById.mockResolvedValue(mockStudent);

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(mockReq.student).toBe(mockStudent);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject request with no token', async () => {
      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const mockToken = 'invalidToken';
      mockReq.cookies.token = mockToken;

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Invalid token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with blacklisted token', async () => {
      const mockToken = 'blacklistedToken';
      const mockDecoded = { _id: 'student123' };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue({ token: mockToken });

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Token has been blacklisted'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request if student not found', async () => {
      const mockToken = 'validToken';
      const mockDecoded = { _id: 'nonexistent123' };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      studentModel.findById.mockResolvedValue(null);

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Admin Authentication', () => {
    it('should authenticate valid admin token', async () => {
      const mockToken = 'validAdminToken';
      const mockDecoded = { _id: 'admin123' };
      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@test.com',
        branch: 'CSE'
      };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      adminModel.findById.mockResolvedValue(mockAdmin);

      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(mockReq.admin).toBe(mockAdmin);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject admin request with no token', async () => {
      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject admin request with invalid token', async () => {
      const mockToken = 'invalidAdminToken';
      mockReq.cookies.token = mockToken;

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Invalid token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request if admin not found', async () => {
      const mockToken = 'validToken';
      const mockDecoded = { _id: 'nonexistent123' };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      adminModel.findById.mockResolvedValue(null);

      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Admin not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Mentor Authentication', () => {
    it('should authenticate valid mentor token', async () => {
      const mockToken = 'validMentorToken';
      const mockDecoded = { _id: 'mentor123' };
      const mockMentor = {
        _id: 'mentor123',
        email: 'mentor@test.com',
        name: 'John Mentor'
      };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      mentorModel.findById.mockResolvedValue(mockMentor);

      await authMiddleware.authMentor(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(mockReq.mentor).toBe(mockMentor);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject mentor request with no token', async () => {
      await authMiddleware.authMentor(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject mentor request with blacklisted token', async () => {
      const mockToken = 'blacklistedMentorToken';
      const mockDecoded = { _id: 'mentor123' };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue({ token: mockToken });

      await authMiddleware.authMentor(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Token has been blacklisted'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Token Extraction', () => {
    it('should extract token from cookies first', async () => {
      const cookieToken = 'cookieToken';
      const headerToken = 'headerToken';

      mockReq.cookies.token = cookieToken;
      mockReq.headers.authorization = `Bearer ${headerToken}`;

      const mockDecoded = { _id: 'student123' };
      const mockStudent = { _id: 'student123' };

      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      studentModel.findById.mockResolvedValue(mockStudent);

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(cookieToken, process.env.JWT_SECRET);
    });

    it('should extract token from headers if no cookie', async () => {
      const headerToken = 'headerToken';
      mockReq.headers.authorization = `Bearer ${headerToken}`;

      const mockDecoded = { _id: 'student123' };
      const mockStudent = { _id: 'student123' };

      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockResolvedValue(null);
      studentModel.findById.mockResolvedValue(mockStudent);

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(headerToken, process.env.JWT_SECRET);
    });

    it('should handle malformed authorization header', async () => {
      mockReq.headers.authorization = 'InvalidFormat';

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: No token provided'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle JWT verification errors', async () => {
      const mockToken = 'expiredToken';
      mockReq.cookies.token = mockToken;

      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Invalid token'
      });
    });

    it('should handle database errors', async () => {
      const mockToken = 'validToken';
      const mockDecoded = { _id: 'student123' };

      mockReq.cookies.token = mockToken;
      jwt.verify.mockReturnValue(mockDecoded);
      blacklistModel.findOne.mockRejectedValue(new Error('Database error'));

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      const mockToken = 'validToken';
      mockReq.cookies.token = mockToken;

      jwt.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Invalid token'
      });
    });
  });

  describe('Multiple Role Authentication', () => {
    it('should handle different user roles correctly', async () => {
      const studentToken = 'studentToken';
      const adminToken = 'adminToken';
      const mentorToken = 'mentorToken';

      // Test student authentication
      mockReq.cookies.token = studentToken;
      jwt.verify.mockReturnValue({ _id: 'student123' });
      blacklistModel.findOne.mockResolvedValue(null);
      studentModel.findById.mockResolvedValue({ _id: 'student123' });

      await authMiddleware.authStudent(mockReq, mockRes, mockNext);
      expect(mockReq.student).toBeDefined();

      // Reset mocks
      jest.clearAllMocks();

      // Test admin authentication
      mockReq.cookies.token = adminToken;
      jwt.verify.mockReturnValue({ _id: 'admin123' });
      blacklistModel.findOne.mockResolvedValue(null);
      adminModel.findById.mockResolvedValue({ _id: 'admin123' });

      await authMiddleware.authAdmin(mockReq, mockRes, mockNext);
      expect(mockReq.admin).toBeDefined();

      // Reset mocks
      jest.clearAllMocks();

      // Test mentor authentication
      mockReq.cookies.token = mentorToken;
      jwt.verify.mockReturnValue({ _id: 'mentor123' });
      blacklistModel.findOne.mockResolvedValue(null);
      mentorModel.findById.mockResolvedValue({ _id: 'mentor123' });

      await authMiddleware.authMentor(mockReq, mockRes, mockNext);
      expect(mockReq.mentor).toBeDefined();
    });
  });
});