import { AcademicService } from '@academic/services/academic.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('/api/v1/academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get('/courses/eligible')
  getEligibleCourses(
    @Query('studentId') studentId: number,
    @Query('termType') termType: string,
    @Query('startMonth') startMonth: number,
    @Query('paymentCode') paymentCode: number,
  ) {
    return this.academicService.getEligibleCourses(
      studentId,
      termType,
      startMonth,
      paymentCode,
    );
  }

  @Get('/program-courses')
  getProgramCourses(
    @Query('programId') programId: number,
    @Query('studentId') studentId: number,
  ) {
    return {
      careerName: 'Ingeniería de Sistemas',
      studentName: 'Juan Pérez',
      creditsEarned: 32,
      courses: [
        {
          courseId: 1,
          name: 'Algoritmos y Estructuras de Datos',
          credits: 4,
          prerequisiteCourseId: '4',
          prerequisiteType: 'COURSE',
          termId: 1,
          academicTermTitle: 'Primer Semestre',
          status: 'APPROVED',
        },
        {
          courseId: 1,
          name: 'Analisis Matemático I',
          credits: 4,
          prerequisiteType: 'CREDITS',
          requiredCredits: 20,
          termId: 1,
          academicTermTitle: 'Primer Semestre',
          status: 'PENDING',
        },
      ],
    };
  }
}
