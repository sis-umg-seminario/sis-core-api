// src/modules/students/controllers/students.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudentsService } from '@students/services/students.service';
import { AcademicService } from '../../academic/services/academic.service';

@Controller('/api/v1/students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly academicService: AcademicService,
  ) {}

  @Get('/:studentId/course-schedule')
  async getCourseSchedule(
    @Param('studentId') studentId: number,
    @Query('startMonth') startMonth: number,
    @Query('termType') termType: string,
  ) {
    // 1.2 Consulta de carrera
    const programId = await this.studentsService.getEnrolledCareer(studentId);

    // 1.3 Consulta de semestre
    // ensure startMonth is a number (query params arrive as strings)
    const monthNumber = Number(startMonth);
    const academicTerm = await this.academicService.searchAcademicTerm(
      termType,
      monthNumber,
    );
    if (!academicTerm) {
      return { courses: [] };
    }
    const termId = academicTerm.termId;

    // 1.4 Consulta de horario de cursos
    const courses = await this.studentsService.getCourseSchedule(
      studentId,
      programId,
      termId,
    );

    // 1.5 Respuesta
    return { courses };
  }

  // -----------------------------
  // MOCK: Notas del estudiante
  // Ejemplo:
  // GET /api/v1/students/2001/notas?semestre=2&anio=2023
  // -----------------------------
  @Get('/:studentId/notas')
  getNotasEstudiante(
    @Param('studentId') studentId: number,
    @Query('semestre') semestre: number,
    @Query('anio') anio: number,
  ) {
    const semestreNum = Number(semestre);
    const anioNum = Number(anio);

    return {
      student: 'Axel Mauricio Véliz Poom',
      semester: semestreNum,
      year: anioNum,
      grades: [
        {
          course: 'INVESTIGACIÓN DE OPERACIONES',
          partial1: 16,
          partial2: 14,
          activities: 46,
          preFinalScore: 25,
          finalExam: 71,
          finalGrade: 71,
          passed: true,
        },
        {
          course: 'BASES DE DATOS I',
          partial1: 11,
          partial2: 19,
          activities: 45,
          preFinalScore: 15,
          finalExam: 72,
          finalGrade: 72,
          passed: true,
        },
        {
          course: 'AUTÓMATAS Y LENGUAJES FORMALES',
          partial1: 15,
          partial2: 20,
          activities: 55,
          preFinalScore: 20,
          finalExam: 75,
          finalGrade: 75,
          passed: true,
        },
      ],
    };
  }
}
