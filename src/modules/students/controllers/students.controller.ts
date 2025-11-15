import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from '@students/services/students.service';
import { AcademicService } from '../../academic/services/academic.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ProfileInformationDto } from '@auth/dtos/profile-information.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
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
    const programId = await this.studentsService.getEnrolledCareer(studentId);

    const monthNumber = Number(startMonth);
    const academicTerm = await this.academicService.searchAcademicTerm(
      termType,
      monthNumber,
    );
    if (!academicTerm) {
      return { courses: [] };
    }
    const termId = academicTerm.termId;

    const courses = await this.studentsService.getCourseSchedule(
      studentId,
      programId,
      termId,
    );

    return { courses };
  }

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

  @Get('/student-grades')
  @UseGuards(JwtAuthGuard)
  getStudentGrades(
    @Query('startMonth') __: number,
    @Query('termType') ___: string,
    @Req() request: { user: ProfileInformationDto },
  ) {
    return this.studentsService.getStudentGrades(request.user.studentId);
  }

  @Get('/student-profile')
  getStudentProfile() {
    return {
      studentId: 1,
      name: 'John Doe',
      program: {
        id: 1,
        name: 'Ingeniería de Sistemas',
      },
      creditsEarned: 45,
    };
  }

  @Get('/student-history')
  @UseGuards(JwtAuthGuard)
  async getStudentHistory(@Req() request: { user: ProfileInformationDto }) {
    const studentHistory = await this.studentsService.getStudentHistory(
      request.user.studentId,
    );
    if (!studentHistory || !studentHistory.length) {
      throw new NotFoundException(
        `No se encontró historial para el estudiante con ID ${request.user.studentId}`,
      );
    }

    const totalCreditsEarned = studentHistory.reduce(
      (sum, record) => sum + record.creditsEarned,
      0,
    );
    return { studentHistory, totalCreditsEarned };
  }
}
