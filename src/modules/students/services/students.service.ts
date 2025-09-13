import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentHistory } from '@students/entities/student-history.entity';
import { StudentProgram } from '@students/entities/student-program.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentProgram)
    private studentProgramRepository: Repository<StudentProgram>,
    @InjectRepository(StudentHistory)
    private studentHistoryRepository: Repository<StudentHistory>,
  ) {}
  public async getEnrolledCareer(studentId: number): Promise<number> {
    const studentProgram = await this.studentProgramRepository.findOne({
      where: { studentId },
      select: ['programId'],
    });

    if (!studentProgram) {
      throw new HttpException(
        {
          message: `Student program not found for student ID ${studentId}`,
        },
        404,
      );
    }

    return studentProgram.programId;
  }

  public async getStudentHistory(studentId: number) {
    return this.studentHistoryRepository.find({ where: { studentId } });
  }
}
