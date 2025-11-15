import { CourseOffering } from '@academic/entities/course-offering.entity';
import { GradeCategory } from '@academic/entities/grade-category.entity';
import { EnrollmentCourse } from '@enrollments/enrollments/enrollment-course.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignedCoursesResponseDto } from '@professor/dtos/assigned-courses-response.dto';
import { UpdateStudentGradeRequestDto } from '@professor/dtos/update-student-grade-request.dto';
import { StudentGrade } from '@students/entities/student-grade.entity';
import { Student } from '@students/entities/student.entity';
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
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
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
    return { status: 'ok' };
  }

  public async getCourseStudentsAndGrades(courseOfferingId: number) {
    const students: any[] = [];
    const studentGrades =
      await this.findStudentGradesByOfferingId(courseOfferingId);

    for (const studentGrade of studentGrades) {
      let student = students.find(
        (student) =>
          student.studentId ===
          studentGrade.enrollmentCourse.enrollment.student.studentId,
      );

      if (!student) {
        students.push({
          studentId: studentGrade.enrollmentCourse.enrollment.student.studentId,
          name:
            studentGrade.enrollmentCourse.enrollment.student.firstName +
            ' ' +
            studentGrade.enrollmentCourse.enrollment.student.lastName,
          scores: [],
          total: 0,
          status: '',
        });
      }
    }

    return {
      students: students.map((student) => {
        const studentGradesByStudent = studentGrades.filter(
          (sg) =>
            sg.enrollmentCourse.enrollment.student.studentId ===
            student.studentId,
        );
        student.scores.push(
          ...studentGradesByStudent.map((sg) => ({
            type: sg.gradeCategory.identifier,
            value: sg.score,
          })),
        );
        student.total = studentGradesByStudent.reduce(
          (acc, curr) => acc + curr.score,
          0,
        );
        student.status = student.total >= 60 ? 'APPROVED' : 'FAILED';
        return student;
      }),
    };
  }

  public async getCourseStudents(courseOfferingId: number) {
    const students =
      await this.findStudentsByCourseOfferingId(courseOfferingId);
    return {
      students: students.map((student) => ({
        studentId: student.studentId,
        name: student.firstName + ' ' + student.lastName,
        profileImageURL:
          'https://fastly.picsum.photos/id/455/50/50.jpg?hmac=RXj-6vl67_XQQ1UHMd9CmQ0aoV1qxkpdDNpnVB4YzGM',
      })),
    };
  }

  private async findCourseStudentsByOfferingId(courseOfferingId: number) {
    return this.enrollmentCourseRepository.find({
      where: { offeringId: courseOfferingId },
      relations: ['enrollment', 'enrollment.student'],
    });
  }

  private async findStudentsByCourseOfferingId(courseOfferingId: number) {
    return this.studentRepository.find({
      where: {
        enrollments: {
          enrollmentCourses: {
            offeringId: courseOfferingId,
          },
        },
      },
    });
  }

  private async findStudentGradesByOfferingId(courseOfferingId: number) {
    return this.studentGradeRepository.find({
      where: { enrollmentCourse: { offeringId: courseOfferingId } },
      relations: [
        'enrollmentCourse',
        'enrollmentCourse.enrollment',
        'gradeCategory',
        'enrollmentCourse.enrollment.student',
      ],
    });
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

  private async findEnrollmentCourseId(
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
