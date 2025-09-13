import { AcademicController } from '@academic/controllers/academic.controller';
import { AcademicService } from '@academic/services/academic.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AcademicController', () => {
  let controller: AcademicController;
  let academicService: AcademicService;

  beforeEach(async () => {
    const mockAcademicService = {
      getEligibleCourses: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicController],
      providers: [{ provide: AcademicService, useValue: mockAcademicService }],
    }).compile();

    controller = module.get<AcademicController>(AcademicController);
    academicService = module.get<AcademicService>(AcademicService);
  });

  describe('getEligibleCourses', () => {
    it('should call academicService.getEligibleCourses with correct parameters', async () => {
      const studentId = 1;
      const termType = 'semester';
      const startMonth = 3;
      const paymentCode = 123;
      const mockResult = [{ id: 101, name: 'Math' }];

      (academicService.getEligibleCourses as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await controller.getEligibleCourses(
        studentId,
        termType,
        startMonth,
        paymentCode,
      );

      expect(academicService.getEligibleCourses).toHaveBeenCalledWith(
        studentId,
        termType,
        startMonth,
        paymentCode,
      );
      expect(result).toBe(mockResult);
    });

    it('should handle empty result', async () => {
      (academicService.getEligibleCourses as jest.Mock).mockResolvedValue([]);

      const result = await controller.getEligibleCourses(2, 'quarter', 5, 456);

      expect(result).toEqual([]);
    });
  });
});
