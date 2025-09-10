import { Course } from '@academic/entities/course.entity';
import { Expose, plainToInstance, Transform } from 'class-transformer';

export class GetEligibleCoursesResponseDto {
  @Expose()
  programId: number;
  @Expose()
  academicTermId: number;
  @Expose()
  @Transform(({ obj }) => {
    return obj.eligibleCourses
      .map((course: Course) => {
        return course.offerings.map((offering) => {
          return plainToInstance(
            CourseDto,
            {
              ...offering,
              courseId: course.courseId,
              courseName: course.name,
            },
            { excludeExtraneousValues: true },
          );
        });
      })
      .flat();
  })
  courses: CourseDto[];
}

export class CourseDto {
  @Expose()
  courseId: number;
  @Expose()
  offeringId: number;
  @Expose()
  startTime: string;
  @Expose()
  endTime: string;
  @Expose()
  professor: string;
  @Expose()
  section: string;
  @Expose()
  capacity: number;
  @Expose()
  courseName: string;
}
