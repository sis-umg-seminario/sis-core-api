// src/modules/students/controllers/students.controller.ts

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
  getStudentGrades(
    @Query('startMonth') __: number,
    @Query('termType') ___: string,
  ) {
    return {
      courses: [
        {
          courseId: 1,
          name: 'Algoritmos y Estructuras de Datos',
          scores: [
            { type: 'midtermExam1', value: 10 },
            { type: 'midtermExam2', value: 20 },
            { type: 'assignments', value: 35 },
            { type: 'final', value: 35 },
          ],
          total: 100,
          status: 'APPROVED',
        },
        {
          courseId: 2,
          name: 'Analisis Matemático I',
          scores: [
            { type: 'midtermExam1', value: 12 },
            { type: 'midtermExam2', value: 18 },
            { type: 'assignments', value: 30 },
            { type: 'final', value: 25 },
          ],
          total: 85,
          status: 'APPROVED',
        },
        {
          courseId: 3,
          name: 'Introducción a la Programación',
          scores: [
            { type: 'midtermExam1', value: 8 },
            { type: 'midtermExam2', value: 15 },
            { type: 'assignments', value: 25 },
            { type: 'final', value: 10 },
          ],
          total: 58,
          status: 'FAILED',
        },
      ],
    };
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
