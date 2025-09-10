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
}
