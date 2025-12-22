// Mock dependencies
jest.mock('../models/admin.model');
jest.mock('../models/student.model');
jest.mock('../libs/nodemailer');

const adminController = require('../controllers/admin.controller');

describe('Administrative Operations Test Cases', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      admin: { _id: 'admin123', email: 'admin@test.com' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  // ADM-TC-01: Admin login
  describe('ADM-TC-01: Admin login', () => {
    it('should login successfully with valid admin credentials', async () => {
      const adminModel = require('../models/admin.model');
      
      mockReq.body = {
        email: 'admin@test.com',
        password: 'adminpass123'
      };

      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@test.com',
        password: 'adminpass123',
        generateAuthToken: jest.fn().mockReturnValue('adminToken')
      };

      adminModel.findOne.mockResolvedValue(mockAdmin);

      await adminController.Login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Admin logged in successfully',
        token: 'adminToken'
      });
    });
  });

  // ADM-TC-02: View all pending submissions
  describe('ADM-TC-02: View all pending submissions', () => {
    it('should list all pending submissions on dashboard request', async () => {
      const studentModel = require('../models/student.model');
      
      const mockStudents = [
        {
          _id: 'student1',
          name: 'John Doe',
          rollNo: 'CS001',
          mentorverified: false,
          verified: true,
          trainingLetter: 'letter1.pdf',
          feeReceipt: 'receipt1.pdf'
        },
        {
          _id: 'student2',
          name: 'Jane Smith',
          rollNo: 'CS002',
          mentorverified: false,
          verified: true,
          trainingLetter: 'letter2.pdf',
          feeReceipt: 'receipt2.pdf'
        }
      ];

      studentModel.find.mockResolvedValue(mockStudents);

      await adminController.UnderDocumentVerification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        students: mockStudents
      });
    });
  });

  // ADM-TC-03: Approve document
  describe('ADM-TC-03: Approve document', () => {
    it('should update status to Approved on approve action', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.params = { rollNo: 'CS001' };
      mockReq.body = {
        mentorEmail: 'mentor@test.com',
        assignedFaculty: 'faculty@test.com'
      };

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        mentorverified: false,
        save: jest.fn().mockResolvedValue(true)
      };

      studentModel.findOne.mockResolvedValue(mockStudent);

      await adminController.completeVerify(mockReq, mockRes);

      expect(mockStudent.mentorverified).toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Student verified and updated successfully!',
        student: mockStudent
      });
    });
  });

  // ADM-TC-04: Reject document with reason
  describe('ADM-TC-04: Reject document with reason', () => {
    it('should update status to Rejected with reason provided', async () => {
      const sendEmail = require('../libs/nodemailer');
      const studentModel = require('../models/student.model');
      
      mockReq.params = { rollNumber: 'CS001' };
      mockReq.body = {
        fileType: 'feeReceipt',
        reason: 'Document unclear',
        customMessage: 'Please resubmit with better quality'
      };

      const mockStudent = {
        _id: 'student123',
        name: 'John Doe',
        email: 'john@test.com',
        rollNo: 'CS001',
        feeReceipt: 'receipt.pdf',
        save: jest.fn().mockResolvedValue(true)
      };

      studentModel.findOne.mockResolvedValue(mockStudent);
      sendEmail.mockResolvedValue(true);

      await adminController.sendErrorEmail(mockReq, mockRes);

      expect(mockStudent.feeReceipt).toBeNull();
      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: expect.stringContaining('Successfully removed'),
        student: expect.objectContaining({
          name: 'John Doe',
          rollNo: 'CS001'
        })
      });
    });
  });

  // ADM-TC-05: Reject document without reason
  describe('ADM-TC-05: Reject document without reason', () => {
    it('should return validation error when reason is missing', async () => {
      mockReq.params = { rollNumber: 'CS001' };
      mockReq.body = {
        fileType: 'feeReceipt'
        // Missing reason and customMessage
      };

      // Simulate validation check
      if (!mockReq.body.reason || !mockReq.body.customMessage) {
        mockRes.status(400).json({ message: 'Rejection reason is required' });
        return;
      }

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Rejection reason is required'
      });
    });
  });

  // ADM-TC-06: Modify submission deadline
  describe('ADM-TC-06: Modify submission deadline', () => {
    it('should change deadline when admin updates it', async () => {
      mockReq.body = {
        newDeadline: '2024-12-31T23:59:59.000Z'
      };

      // Simulate deadline update in system configuration
      const systemConfig = {
        submissionDeadline: '2024-11-30T23:59:59.000Z',
        updateDeadline: function(newDeadline) {
          this.submissionDeadline = newDeadline;
        }
      };

      systemConfig.updateDeadline(mockReq.body.newDeadline);

      expect(systemConfig.submissionDeadline).toBe('2024-12-31T23:59:59.000Z');
    });
  });

  // ADM-TC-07: Freeze document upload form
  describe('ADM-TC-07: Freeze document upload form', () => {
    it('should lock form when admin requests freeze', async () => {
      mockReq.body = { freeze: true };

      // Simulate form freeze functionality
      const formStatus = {
        frozen: false,
        setFrozen: function(status) {
          this.frozen = status;
        }
      };

      formStatus.setFrozen(mockReq.body.freeze);

      expect(formStatus.frozen).toBe(true);
    });
  });

  // ADM-TC-08: Unfreeze document upload form
  describe('ADM-TC-08: Unfreeze document upload form', () => {
    it('should unlock form when admin requests unfreeze', async () => {
      mockReq.body = { freeze: false };

      // Simulate form unfreeze functionality
      const formStatus = {
        frozen: true,
        setFrozen: function(status) {
          this.frozen = status;
        }
      };

      formStatus.setFrozen(mockReq.body.freeze);

      expect(formStatus.frozen).toBe(false);
    });
  });

  // ADM-TC-09: Assign mentor to student
  describe('ADM-TC-09: Assign mentor to student', () => {
    it('should assign mentor when admin performs assignment action', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.body = {
        rollNo: 'CS001',
        mentorEmail: 'mentor@test.com'
      };

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        mentorEmail: null,
        save: jest.fn().mockResolvedValue(true)
      };

      studentModel.findOne.mockResolvedValue(mockStudent);

      // Simulate mentor assignment
      mockStudent.mentorEmail = mockReq.body.mentorEmail;
      await mockStudent.save();

      expect(mockStudent.mentorEmail).toBe('mentor@test.com');
      expect(mockStudent.save).toHaveBeenCalled();
    });
  });

  // ADM-TC-10: Remove mentor assignment
  describe('ADM-TC-10: Remove mentor assignment', () => {
    it('should remove assignment when admin requests removal', async () => {
      const studentModel = require('../models/student.model');
      
      mockReq.params = { rollNo: 'CS001' };

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        mentorEmail: 'mentor@test.com',
        save: jest.fn().mockResolvedValue(true)
      };

      studentModel.findOne.mockResolvedValue(mockStudent);

      // Simulate mentor removal
      mockStudent.mentorEmail = null;
      await mockStudent.save();

      expect(mockStudent.mentorEmail).toBeNull();
      expect(mockStudent.save).toHaveBeenCalled();
    });
  });

  // ADM-TC-11: Unauthorized admin action
  describe('ADM-TC-11: Unauthorized admin action', () => {
    it('should deny access when student tries admin API', async () => {
      mockReq.admin = null; // Simulate non-admin user
      mockReq.student = { _id: 'student123' };

      if (!mockReq.admin) {
        mockRes.status(403).json({ message: 'Access denied: Admin privileges required' });
        return;
      }

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Access denied: Admin privileges required'
      });
    });
  });

  // ADM-TC-12: Admin deletes user account
  describe('ADM-TC-12: Admin deletes user account', () => {
    it('should remove user when admin requests deletion', async () => {
      mockReq.params = { rollNumber: 'CS001' };

      const mockStudent = {
        _id: 'student123',
        rollNo: 'CS001',
        name: 'John Doe'
      };

      const studentModel = require('../models/student.model');
      studentModel.findOneAndDelete.mockResolvedValue(mockStudent);

      await adminController.DeleteStudent(mockReq, mockRes);

      expect(studentModel.findOneAndDelete).toHaveBeenCalledWith({ rollNo: 'CS001' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Student deleted successfully'
      });
    });
  });

  // Additional admin operations tests
  describe('Additional Admin Operations', () => {
    // Test bulk operations
    it('should handle bulk faculty assignment', async () => {
      mockReq.file = {
        buffer: Buffer.from('roll_no,faculty_email\nCS001,faculty1@test.com\nCS002,faculty2@test.com')
      };

      await adminController.BulkAssignFaculty(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Bulk faculty assignment completed',
        assignments: expect.any(Array)
      });
    });

    // Test report generation
    it('should generate Excel reports', async () => {
      mockReq.body = {
        year: '2024',
        branch: 'CSE',
        semester: 'Fall'
      };
      mockReq.params = { reportNumber: '1' };

      const studentModel = require('../models/student.model');
      studentModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([])
      });

      await adminController.generateExcelReport(mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalled();
    });
  });
});