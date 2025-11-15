import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '@students/entities/student.entity'; // Importamos el archivo principal de Student
import { StudentHistory } from '@students/entities/student-history.entity';
import { StudentProgram } from '@students/entities/student-program.entity';
import { Repository } from 'typeorm';
import { StudentGrade } from '@students/entities/student-grade.entity';
import { EnrollmentCourse } from '@enrollments/enrollments/enrollment-course.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentProgram)
    private studentProgramRepository: Repository<StudentProgram>,
    @InjectRepository(StudentHistory)
    private studentHistoryRepository: Repository<StudentHistory>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(EnrollmentCourse)
    private enrollmentCourseRepository: Repository<EnrollmentCourse>,
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

  public async getStudentEnrollmentFee(studentId: number): Promise<number> {
    const query = this.studentRepository
      .createQueryBuilder('student')
      .select('program.enrollment_fee', 'enrollmentFee')
      .innerJoin('student.studentPrograms', 'sp')
      .innerJoin('sp.program', 'program')
      .where('student.studentId = :studentId', { studentId });

    const result = await query.getRawOne();

    if (!result || result.enrollmentFee === null) {
      throw new NotFoundException(
        `No se encontró información de la carrera o cuota para el estudiante con ID ${studentId}`,
      );
    }

    return parseFloat(result.enrollmentFee);
  }

  public async getCourseSchedule(
    studentId: number,
    programId: number,
    termId: number,
  ) {
    const result = await this.studentRepository.query(
      `select c.course_id as "courseId", c."name", co."section", co.start_time as "startTime", co.end_time as "endTime"
       from enrollments.enrollment e
       right join enrollments.enrollment_course ec on e."enrollmentId" = ec.enrollment_id
       right join academic.course_offering co on ec.offering_id = co.offering_id 
       right join academic.course c on co.course_id = c.course_id 
       where e.student_id = $1 and e.program_id = $2 and e.term_id = $3;`,
      [studentId, programId, termId],
    );
    return result;
  }

  public async getStudentById(studentId: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Estudiante con ID ${studentId} no encontrado`,
      );
    }
    return student;
  }

  public async getStudentGrades(studentId: number) {
    const enrollmentCourses = await this.findCourseGradesByStudentId(studentId);

    return {
      courses: enrollmentCourses.map((ec) => ({
        courseId: ec.courseOffering.courseId,
        name: ec.courseOffering.course.name,
        scores: ec.studentGrades.map((sg) => ({
          type: sg.gradeCategory.identifier,
          value: sg.score,
        })),
        total: ec.studentGrades.reduce((sum, sg) => sum + sg.score, 0),
        status:
          ec.studentGrades.reduce((sum, sg) => sum + sg.score, 0) >= 60
            ? 'APPROVED'
            : 'FAILED',
      })),
    };
  }

  private async findCourseGradesByStudentId(studentId: number) {
    return this.enrollmentCourseRepository.find({
      where: { enrollment: { studentId } },
      relations: [
        'studentGrades',
        'studentGrades.gradeCategory',
        'courseOffering',
        'courseOffering.course',
      ],
    });
  }
}
