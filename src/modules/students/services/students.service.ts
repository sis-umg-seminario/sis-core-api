// src\modules\students\services\students.service.ts

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '@students/entities/student.entity'; // Importamos el archivo principal de Student
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
    // Le damos acceso al "archivo" principal de estudiantes
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  // Este es tu método que ya existía, no lo tocamos.
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

    // --- LÍNEA CORREGIDA ---
    // Si encuentra el programa, devolvemos su ID.
    return studentProgram.programId;
  }

  // Este es tu otro método que ya existía, no lo tocamos.
  public async getStudentHistory(studentId: number) {
    return this.studentHistoryRepository.find({ where: { studentId } });
  }

  // --- NUEVA HABILIDAD AÑADIDA ---
  // Le enseñamos a buscar el precio de la inscripción
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

  // Devuelve la información completa del estudiante (incluye email)
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
}
