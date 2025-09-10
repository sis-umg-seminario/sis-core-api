import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity({ schema: 'academic', name: 'course_prerequisite' })
export class CoursePrerequisite {
  @PrimaryGeneratedColumn({ name: 'prereq_id' })
  coursePrerequisiteId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'prerequisite_course_id', nullable: true })
  prerequisiteCourseId: number;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'required_credits', nullable: true })
  requiredCredits: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Course, (course) => course.coursePrerequisites)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
