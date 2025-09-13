import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { CourseOffering } from '@academic/entities/course-offering.entity';

@Entity({ schema: 'enrollments', name: 'enrollment_course' })
export class EnrollmentCourse {
  @PrimaryGeneratedColumn({ name: 'enrollment_course_id' })
  enrollmentCourseId: number;

  @Column({ name: 'enrollment_id' })
  enrollmentId: number;

  @Column({ name: 'offering_id' })
  offeringId: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'status' })
  status: string;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.enrollmentCourses)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @ManyToOne(
    () => CourseOffering,
    (courseOffering) => courseOffering.enrollmentCourses,
  )
  @JoinColumn({ name: 'offering_id' })
  courseOffering: CourseOffering;
}
