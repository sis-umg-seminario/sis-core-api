import { ProfileInformationDto } from '@auth/dtos/profile-information.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  async getCourseStudents(@Param('courseOfferingId') _: number) {
    return {
      students: [
        {
          studentId: 1,
          name: 'John Doe',
          profileImageURL:
            'https://fastly.picsum.photos/id/455/50/50.jpg?hmac=RXj-6vl67_XQQ1UHMd9CmQ0aoV1qxkpdDNpnVB4YzGM',
        },
      ],
    };
  }

  @Get('/course/:courseOfferingId/student-grades')
  async getCourseStudentGrades(@Param('courseOfferingId') _: number) {
    return {
      students: [
        {
          studentId: 1,
          name: 'John Doe',
          scores: [
            {
              type: 'midtermExam1',
              value: 10,
            },
            {
              type: 'midtermExam2',
              value: 20,
            },
            {
              type: 'assignments',
              value: 35,
            },
            {
              type: 'final',
              value: 35,
            },
          ],
          total: 100,
          status: 'APPROVED',
        },
      ],
    };
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
