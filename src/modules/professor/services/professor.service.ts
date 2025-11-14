import { CourseOffering } from '@academic/entities/course-offering.entity';
import { GradeCategory } from '@academic/entities/grade-category.entity';
import { EnrollmentCourse } from '@enrollments/enrollments/enrollment-course.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignedCoursesResponseDto } from '@professor/dtos/assigned-courses-response.dto';
import { UpdateStudentGradeRequestDto } from '@professor/dtos/update-student-grade-request.dto';
import { StudentGrade } from '@students/entities/student-grade.entity';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(CourseOffering)
    private readonly courseOfferingRepository: Repository<CourseOffering>,
    @InjectRepository(GradeCategory)
    private readonly gradeCategoryRepository: Repository<GradeCategory>,
    @InjectRepository(StudentGrade)
    private readonly studentGradeRepository: Repository<StudentGrade>,
    @InjectRepository(EnrollmentCourse)
    private readonly enrollmentCourseRepository: Repository<EnrollmentCourse>,
  ) {}

  public async getAssignedCourses(
    professorId: number,
  ): Promise<{ courses: AssignedCoursesResponseDto[] }> {
    const result = await this.courseOfferingRepository.find({
      where: { professorId },
      relations: ['course'],
    });
    return {
      courses: result.map((offering) =>
        plainToInstance(AssignedCoursesResponseDto, offering, {
          excludeExtraneousValues: true,
        }),
      ),
    };
  }

  public async updateStudentGrade(
    input: UpdateStudentGradeRequestDto,
    courseOfferingId: number,
    studentId: number,
    professorId: number,
  ) {
    for (const score of input.scores) {
      const gradeCategory = await this.findGradeCategoryIdByType(score.type);
      if (!gradeCategory) {
        throw new BadRequestException(`Grade category ${score.type} not found`);
      }

      const studentGradeRecord = await this.findStudentGradeRecordId(
        courseOfferingId,
        studentId,
        gradeCategory.gradeCategoryId,
      );

      if (studentGradeRecord) {
        await this.updateStudentGradeRecord(
          studentGradeRecord.studentGradeId,
          score.value,
          professorId,
        );
      } else {
        const enrollmentCourse = await this.findEnrollmentCourseId(
          courseOfferingId,
          studentId,
        );
        if (!enrollmentCourse) {
          throw new BadRequestException(
            `Enrollment course not found for student ${studentId} and offering ${courseOfferingId}`,
          );
        }
        await this.createStudentGradeRecord(
          enrollmentCourse.enrollmentCourseId,
          gradeCategory.gradeCategoryId,
          score.value,
          professorId,
        );
      }
    }
  }

  private async findGradeCategoryIdByType(type: string): Promise<any> {
    return this.gradeCategoryRepository.findOne({
      where: { identifier: type },
      select: ['gradeCategoryId'],
    });
  }

  private async findStudentGradeRecordId(
    courseOfferingId: number,
    studentId: number,
    gradeCategoryId: number,
  ): Promise<any> {
    return this.studentGradeRepository.findOne({
      where: {
        gradeCategoryId,
        enrollmentCourse: {
          offeringId: courseOfferingId,
          enrollment: { studentId },
        },
      },
      relations: ['enrollmentCourse', 'enrollmentCourse.enrollment'],
      select: ['studentGradeId'],
    });
  }

  public async findEnrollmentCourseId(
    courseOfferingId: number,
    studentId: number,
  ): Promise<any> {
    return this.enrollmentCourseRepository.findOne({
      where: {
        offeringId: courseOfferingId,
        enrollment: { studentId },
      },
      relations: ['enrollment'],
      select: ['enrollmentCourseId'],
    });
  }

  private async createStudentGradeRecord(
    enrollmentCourseId: number,
    gradeCategoryId: number,
    score: number,
    professorId: number,
  ) {
    return this.studentGradeRepository.save({
      enrollmentCourseId,
      gradeCategoryId,
      score,
      submittedBy: professorId,
    });
  }

  private async updateStudentGradeRecord(
    studentGradeId: number,
    score: number,
    professorId: number,
  ) {
    return this.studentGradeRepository.update(studentGradeId, {
      score,
      submittedBy: professorId,
    });
  }
}
