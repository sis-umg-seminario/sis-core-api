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
    const courses = await this.studentsService.getCourseSchedule(studentId, programId, termId);

    // 1.5 Respuesta
    return { courses };
  }
}
