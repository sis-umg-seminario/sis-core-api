import { Body, Controller, Post } from '@nestjs/common';
import { enrollStudentRequestDto } from '@enrollments/dtos/enroll-student-request.dto';
import { EnrollmentsService } from '@enrollments/services/enrollments.service';

@Controller('/api/v1/enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('/register')
  enrollStudent(@Body() body: enrollStudentRequestDto) {
    return this.enrollmentsService.enrollStudent(body);
  }
}
