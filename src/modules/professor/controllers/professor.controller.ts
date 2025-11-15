import { ProfileInformationDto } from '@auth/dtos/profile-information.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateStudentGradeRequestDto } from '@professor/dtos/update-student-grade-request.dto';
import { ProfessorService } from '@professor/services/professor.service';

@Controller('/api/v1/professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}
  @Get('/assigned-courses')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAssignedCourses(@Req() request: { user: ProfileInformationDto }) {
    return this.professorService.getAssignedCourses(request.user.professorId);
  }

  @Get('course/:courseOfferingId/students')
  async getCourseStudents(@Param('courseOfferingId') courseOfferingId: number) {
    return this.professorService.getCourseStudents(courseOfferingId);
  }

  @Get('/course/:courseOfferingId/student-grades')
  async getCourseStudentGrades(
    @Param('courseOfferingId') courseOfferingId: number,
  ) {
    return this.professorService.getCourseStudentsAndGrades(courseOfferingId);
  }

  @Patch('/course/:courseOfferingId/student-grades/:studentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateStudentGrade(
    @Param('courseOfferingId') courseOfferingId: number,
    @Param('studentId') studentId: number,
    @Req()
    request: {
      user: ProfileInformationDto;
      body: UpdateStudentGradeRequestDto;
    },
  ) {
    return this.professorService.updateStudentGrade(
      request.body,
      courseOfferingId,
      studentId,
      request.user.professorId,
    );
  }
}
