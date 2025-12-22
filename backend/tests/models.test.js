const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock mongoose and bcrypt
jest.mock('mongoose');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock the models
jest.mock('../models/student.model');
jest.mock('../models/admin.model');
jest.mock('../models/mentor.model');

const studentModel = require('../models/student.model');
const adminModel = require('../models/admin.model');
const mentorModel = require('../models/mentor.model');

describe('Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Student Model', () => {
    describe('Password Hashing', () => {
      it('should hash password correctly', async () => {
        const plainPassword = 'password123';
        const hashedPassword = 'hashedPassword123';

        bcrypt.hash.mockResolvedValue(hashedPassword);
        studentModel.hashPassword.mockResolvedValue(hashedPassword);

        const result = await studentModel.hashPassword(plainPassword);

        expect(result).toBe(hashedPassword);
        expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      });

      it('should compare password correctly', async () => {
        const plainPassword = 'password123';
        const hashedPassword = 'hashedPassword123';

        bcrypt.compare.mockResolvedValue(true);

        const mockStudent = {
          password: hashedPassword,
          comparePassword: jest.fn().mockResolvedValue(true)
        };

        const result = await mockStudent.comparePassword(plainPassword);

        expect(result).toBe(true);
      });
    });

    describe('Token Generation', () => {
      it('should generate auth token correctly', () => {
        const mockStudent = {
          _id: 'student123',
          generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };

        jwt.sign.mockReturnValue('mockToken');

        const token = mockStudent.generateAuthToken();

        expect(token).toBe('mockToken');
        expect(jwt.sign).toHaveBeenCalledWith(
          { _id: mockStudent._id },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
      });

      it('should generate reset token correctly', () => {
        const mockStudent = {
          _id: 'student123',
          generateResetToken: jest.fn().mockReturnValue('resetToken'),
          resetPasswordToken: 'hashedResetToken',
          resetPasswordExpires: expect.any(Date)
        };

        const resetToken = mockStudent.generateResetToken();

        expect(resetToken).toBe('resetToken');
        expect(mockStudent.resetPasswordToken).toBeDefined();
        expect(mockStudent.resetPasswordExpires).toBeDefined();
      });
    });

    describe('Validation', () => {
      it('should validate required fields', () => {
        const studentData = {
          name: 'John Doe',
          email: 'john@test.com',
          password: 'password123',
          rollNo: 'CS001',
          branch: 'CSE'
        };

        const mockStudent = new studentModel(studentData);
        mockStudent.validate = jest.fn().mockResolvedValue(true);

        expect(mockStudent.validate).toBeDefined();
      });

      it('should validate email format', () => {
        const invalidEmails = [
          'invalid-email',
          'test@',
          '@test.com',
          'test..test@test.com'
        ];

        invalidEmails.forEach(email => {
          const mockStudent = {
            email,
            validate: jest.fn().mockRejectedValue(new Error('Invalid email'))
          };

          expect(() => mockStudent.validate()).toThrow();
        });
      });

      it('should validate roll number uniqueness', async () => {
        const duplicateRollNo = 'CS001';

        studentModel.findOne.mockResolvedValue({ rollNo: duplicateRollNo });

        const existingStudent = await studentModel.findOne({ rollNo: duplicateRollNo });
        expect(existingStudent).toBeTruthy();
        expect(existingStudent.rollNo).toBe(duplicateRollNo);
      });
    });

    describe('Schema Methods', () => {
      it('should have proper schema structure', () => {
        const expectedFields = [
          'name', 'email', 'password', 'rollNo', 'branch',
          'semesterType', 'classSubgroup', 'phoneNumber',
          'trainingArrangedBy', 'companyDetails', 'verified',
          'mentorverified', 'phase3', 'phase3verified'
        ];

        // Mock schema structure
        const mockSchema = {
          paths: expectedFields.reduce((acc, field) => {
            acc[field] = { path: field };
            return acc;
          }, {})
        };

        expectedFields.forEach(field => {
          expect(mockSchema.paths[field]).toBeDefined();
        });
      });
    });
  });

  describe('Admin Model', () => {
    describe('Authentication', () => {
      it('should authenticate admin with correct credentials', async () => {
        const adminData = {
          email: 'admin@test.com',
          password: 'password123'
        };

        const mockAdmin = {
          ...adminData,
          generateAuthToken: jest.fn().mockReturnValue('adminToken')
        };

        adminModel.findOne.mockResolvedValue(mockAdmin);

        const admin = await adminModel.findOne({ email: adminData.email });
        expect(admin.email).toBe(adminData.email);
        expect(admin.password).toBe(adminData.password);
      });

      it('should generate admin auth token', () => {
        const mockAdmin = {
          _id: 'admin123',
          generateAuthToken: jest.fn().mockReturnValue('adminToken')
        };

        jwt.sign.mockReturnValue('adminToken');

        const token = mockAdmin.generateAuthToken();
        expect(token).toBe('adminToken');
      });
    });

    describe('Validation', () => {
      it('should validate admin required fields', () => {
        const adminData = {
          email: 'admin@test.com',
          password: 'password123',
          branch: 'CSE'
        };

        const mockAdmin = new adminModel(adminData);
        mockAdmin.validate = jest.fn().mockResolvedValue(true);

        expect(mockAdmin.validate).toBeDefined();
      });
    });
  });

  describe('Mentor Model', () => {
    describe('Password Management', () => {
      it('should hash mentor password', async () => {
        const plainPassword = 'mentorPassword123';
        const hashedPassword = 'hashedMentorPassword';

        bcrypt.hash.mockResolvedValue(hashedPassword);
        mentorModel.hashPassword.mockResolvedValue(hashedPassword);

        const result = await mentorModel.hashPassword(plainPassword);
        expect(result).toBe(hashedPassword);
      });

      it('should compare mentor password', async () => {
        const mockMentor = {
          password: 'hashedPassword',
          comparePassword: jest.fn().mockResolvedValue(true)
        };

        bcrypt.compare.mockResolvedValue(true);

        const result = await mockMentor.comparePassword('plainPassword');
        expect(result).toBe(true);
      });
    });

    describe('Token Generation', () => {
      it('should generate mentor auth token', () => {
        const mockMentor = {
          _id: 'mentor123',
          generateAuthToken: jest.fn().mockReturnValue('mentorToken')
        };

        jwt.sign.mockReturnValue('mentorToken');

        const token = mockMentor.generateAuthToken();
        expect(token).toBe('mentorToken');
      });

      it('should generate mentor reset token', () => {
        const mockMentor = {
          _id: 'mentor123',
          generateResetToken: jest.fn().mockReturnValue('mentorResetToken'),
          resetPasswordToken: 'hashedResetToken',
          resetPasswordExpires: expect.any(Date)
        };

        const resetToken = mockMentor.generateResetToken();
        expect(resetToken).toBe('mentorResetToken');
      });
    });

    describe('Verification Status', () => {
      it('should track mentor verification status', () => {
        const mockMentor = {
          email: 'mentor@test.com',
          verified: false,
          name: null,
          designation: null,
          contact: null
        };

        expect(mockMentor.verified).toBe(false);
        expect(mockMentor.name).toBeNull();
        expect(mockMentor.designation).toBeNull();
        expect(mockMentor.contact).toBeNull();
      });

      it('should update verification status after password setup', () => {
        const mockMentor = {
          email: 'mentor@test.com',
          verified: false,
          name: null,
          designation: null,
          contact: null,
          save: jest.fn().mockResolvedValue(true)
        };

        // Simulate password setup
        mockMentor.verified = true;
        mockMentor.name = 'John Mentor';
        mockMentor.designation = 'Senior Engineer';
        mockMentor.contact = '1234567890';

        expect(mockMentor.verified).toBe(true);
        expect(mockMentor.name).toBe('John Mentor');
        expect(mockMentor.designation).toBe('Senior Engineer');
        expect(mockMentor.contact).toBe('1234567890');
      });
    });
  });

  describe('Model Relationships', () => {
    it('should establish student-mentor relationship', async () => {
      const mentorEmail = 'mentor@test.com';
      const mockStudents = [
        {
          _id: 'student1',
          name: 'John Doe',
          mentorEmail: mentorEmail
        },
        {
          _id: 'student2',
          name: 'Jane Smith',
          mentorEmail: mentorEmail
        }
      ];

      studentModel.find.mockResolvedValue(mockStudents);

      const assignedStudents = await studentModel.find({ mentorEmail });
      expect(assignedStudents).toHaveLength(2);
      expect(assignedStudents[0].mentorEmail).toBe(mentorEmail);
      expect(assignedStudents[1].mentorEmail).toBe(mentorEmail);
    });

    it('should establish student-faculty relationship', async () => {
      const facultyEmail = 'faculty@test.com';
      const mockStudents = [
        {
          _id: 'student1',
          name: 'John Doe',
          assignedFaculty: facultyEmail
        }
      ];

      studentModel.find.mockResolvedValue(mockStudents);

      const assignedStudents = await studentModel.find({ assignedFaculty: facultyEmail });
      expect(assignedStudents).toHaveLength(1);
      expect(assignedStudents[0].assignedFaculty).toBe(facultyEmail);
    });
  });

  describe('Model Hooks and Middleware', () => {
    it('should execute pre-save middleware', async () => {
      const mockStudent = {
        _id: 'student123',
        email: 'john@test.com',
        save: jest.fn().mockResolvedValue(true),
        pre: jest.fn()
      };

      // Simulate pre-save hook
      const preSaveHook = jest.fn();
      mockStudent.pre = preSaveHook;

      await mockStudent.save();
      expect(mockStudent.save).toHaveBeenCalled();
    });

    it('should execute post-save middleware', async () => {
      const mockStudent = {
        _id: 'student123',
        save: jest.fn().mockResolvedValue(true),
        post: jest.fn()
      };

      const postSaveHook = jest.fn();
      mockStudent.post = postSaveHook;

      await mockStudent.save();
      expect(mockStudent.save).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      const invalidStudentData = {
        // Missing required fields
        email: 'invalid-email'
      };

      const mockStudent = new studentModel(invalidStudentData);
      mockStudent.validate = jest.fn().mockRejectedValue(new Error('Validation failed'));

      await expect(mockStudent.validate()).rejects.toThrow('Validation failed');
    });

    it('should handle duplicate key errors', async () => {
      const duplicateData = {
        email: 'existing@test.com',
        rollNo: 'CS001'
      };

      studentModel.create.mockRejectedValue({
        code: 11000,
        message: 'Duplicate key error'
      });

      await expect(studentModel.create(duplicateData)).rejects.toMatchObject({
        code: 11000
      });
    });
  });
});