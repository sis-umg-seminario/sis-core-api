import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('/api/v1/professor')
export class ProfessorController {
  @Get('/assigned-courses')
  async getAssignedCourses(@Query('professorId') _: number) {
    return {
      courses: [
        {
          courseId: 1,
          courseOfferingId: 1,
          name: 'Matematicas',
          startTime: '07:00',
          endTime: '09:00',
        },
      ],
    };
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
}
