import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProgram } from '@students/entities/student-program.entity';
import { StudentHistory } from '@students/entities/student-history.entity';
import { HttpException } from '@nestjs/common';
import { StudentsService } from '@students/services/students.service';

describe('StudentsService', () => {
  let studentsService: StudentsService;
  let studentProgramRepository: Repository<StudentProgram>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(StudentProgram),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StudentHistory),
          useValue: {},
        },
      ],
    }).compile();

    studentsService = module.get<StudentsService>(StudentsService);
    studentProgramRepository = module.get<Repository<StudentProgram>>(
      getRepositoryToken(StudentProgram),
    );
  });

  describe('getEnrolledCareer', () => {
    it('should return programId when studentProgram exists', async () => {
      const mockProgramId = 123;
      (studentProgramRepository.findOne as jest.Mock).mockResolvedValue({
        programId: mockProgramId,
      });

      const result = await studentsService.getEnrolledCareer(1);

      expect(studentProgramRepository.findOne).toHaveBeenCalledWith({
        where: { studentId: 1 },
        select: ['programId'],
      });
      expect(result).toBe(mockProgramId);
    });

    it('should throw HttpException when studentProgram does not exist', async () => {
      (studentProgramRepository.findOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(studentsService.getEnrolledCareer(2)).rejects.toThrow(
        HttpException,
      );
      await expect(studentsService.getEnrolledCareer(2)).rejects.toMatchObject({
        status: 404,
        response: {
          message: 'Student program not found for student ID 2',
        },
      });
    });
  });
});
