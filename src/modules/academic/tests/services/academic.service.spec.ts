import { Test, TestingModule } from '@nestjs/testing';
import { AcademicService } from '../../services/academic.service';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { StudentsService } from '@students/services/students.service';
import { Course } from '@academic/entities/course.entity';
import { StudentHistory } from '@students/entities/student-history.entity';
import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AcademicTerm } from '@academic/entities/academic-term.entity';
import { EnrollmentsService } from '@enrollments/services/enrollments.service';

const mockPaymentResourcesService = {
  getPaymentType: jest.fn(),
  validatePayment: jest.fn(),
};

const mockStudentsService = {
  getEnrolledCareer: jest.fn(),
  getStudentHistory: jest.fn(),
};

const mockAcademicTermRepository = {
  createQueryBuilder: jest.fn(),
};

const mockCourseRepository = {
  createQueryBuilder: jest.fn(),
};

const mockIsCourseEligible = jest.fn();
jest.mock('@academic/utils/is-course-eligible', () => ({
  isCourseEligible: (...args: any[]) => mockIsCourseEligible(...args),
}));

describe('AcademicService', () => {
  let service: AcademicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicService,
        {
          provide: PaymentResourcesService,
          useValue: mockPaymentResourcesService,
        },
        { provide: StudentsService, useValue: mockStudentsService },
        {
          provide: getRepositoryToken(AcademicTerm),
          useValue: mockAcademicTermRepository,
        },
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
        {
          provide: EnrollmentsService,
          useValue: {
            validateStudentHasActiveEnrollment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AcademicService>(AcademicService);
    jest.clearAllMocks();
  });

  describe('getEligibleCourses', () => {
    it('should return eligible courses response dto', async () => {
      mockPaymentResourcesService.getPaymentType.mockResolvedValue(1);
      mockPaymentResourcesService.validatePayment.mockResolvedValue(undefined);
      mockStudentsService.getEnrolledCareer.mockResolvedValue(10);

      const getOne = jest.fn().mockResolvedValue({ termId: 100 });
      mockAcademicTermRepository.createQueryBuilder.mockReturnValue({
        select: () => ({
          leftJoin: () => ({
            where: () => ({
              andWhere: () => ({
                getOne,
              }),
            }),
          }),
        }),
      });

      const getMany = jest.fn().mockResolvedValue([
        { id: 1, name: 'Course 1', offerings: [], prerequisites: [] },
        { id: 2, name: 'Course 2', offerings: [], prerequisites: [] },
      ]);
      mockCourseRepository.createQueryBuilder.mockReturnValue({
        innerJoinAndSelect: () => ({
          innerJoinAndSelect: () => ({
            getMany,
          }),
        }),
      });

      mockStudentsService.getStudentHistory.mockResolvedValue([
        { courseId: 1, grade: 80 },
      ]);

      mockIsCourseEligible.mockImplementation(
        (course, history) => course.id === 2,
      );

      const result = await service.getEligibleCourses(5, 'SEMESTER', 1, 1234);

      expect(mockPaymentResourcesService.getPaymentType).toHaveBeenCalledWith(
        'ENROLLMENT',
      );
      expect(mockPaymentResourcesService.validatePayment).toHaveBeenCalledWith(
        1,
        1234,
      );
      expect(mockStudentsService.getEnrolledCareer).toHaveBeenCalledWith(5);
      expect(getOne).toHaveBeenCalled();
      expect(getMany).toHaveBeenCalled();
      expect(mockStudentsService.getStudentHistory).toHaveBeenCalledWith(5);

      expect(result).toEqual({
        courses: [],
        programId: 10,
        academicTermId: 100,
      });
    });

    it('should throw HttpException if academic term not found', async () => {
      mockPaymentResourcesService.getPaymentType.mockResolvedValue(1);
      mockPaymentResourcesService.validatePayment.mockResolvedValue(undefined);
      mockStudentsService.getEnrolledCareer.mockResolvedValue(10);

      const getOne = jest.fn().mockResolvedValue(null);
      mockAcademicTermRepository.createQueryBuilder.mockReturnValue({
        select: () => ({
          leftJoin: () => ({
            where: () => ({
              andWhere: () => ({
                getOne,
              }),
            }),
          }),
        }),
      });

      await expect(
        service.getEligibleCourses(5, 'SEMESTER', 1, 1234),
      ).rejects.toThrow(HttpException);

      await expect(
        service.getEligibleCourses(5, 'SEMESTER', 1, 1234),
      ).rejects.toMatchObject({
        response: {
          message:
            'No se encontró un período académico para los criterios dados',
        },
        status: 404,
      });
    });
  });

  describe('getEligibleCoursesToEnroll', () => {
    it('should filter eligible courses', () => {
      const courses = [{ id: 1 } as any, { id: 2 } as any];
      const history = [{ courseId: 1 }] as StudentHistory[];
      mockIsCourseEligible.mockImplementation(
        (course, history) => course.id === 2,
      );

      // @ts-ignore
      const result = service['getEligibleCoursesToEnroll'](courses, history);
      expect(result).toEqual([{ id: 2 }]);
    });
  });
});
