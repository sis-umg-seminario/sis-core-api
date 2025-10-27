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
  // 🔥 MOCK: Notas del estudiante
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
      estudiante: 'Axel Mauricio Véliz Poom',
      semestre: semestreNum,
      anio: anioNum,
      notas: [
        {
          curso: 'INVESTIGACIÓN DE OPERACIONES',
          p1: 16,
          p2: 14,
          a: 46,
          z: 25,
          ef: 71,
          nf: 71,
          aprobado: true,
        },
        {
          curso: 'BASES DE DATOS I',
          p1: 11,
          p2: 19,
          a: 45,
          z: 15,
          ef: 72,
          nf: 72,
          aprobado: true,
        },
        {
          curso: 'AUTÓMATAS Y LENGUAJES FORMALES',
          p1: 15,
          p2: 20,
          a: 55,
          z: 20,
          ef: 75,
          nf: 75,
          aprobado: true,
        },
      ],
    };
  }
}
