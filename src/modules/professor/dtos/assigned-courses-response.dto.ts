import { Expose, Transform } from 'class-transformer';

export class AssignedCoursesResponseDto {
  @Expose()
  courseId: number;
  @Expose({ name: 'offeringId' })
  courseOfferingId: number;
  @Expose()
  @Transform(({ obj }) => obj.course.name)
  name: string;
  @Expose()
  section: string;
  @Expose()
  startTime: string;
  @Expose()
  endTime: string;
}
