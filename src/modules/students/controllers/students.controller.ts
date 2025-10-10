import { Controller, Get, Param } from '@nestjs/common';

@Controller('/api/v1/students')
export class StudentsController {
  @Get('/:studentId/course-schedule')
  getCourseSchedule(@Param('studentId') _studentId: number) {
    return {
      courses: [
        {
          courseId: 1,
          name: 'Introducción a la Programación',
          section: 'A',
          startTime: '07:00',
          endTime: '9:00',
        },
      ],
    };
  }
}
