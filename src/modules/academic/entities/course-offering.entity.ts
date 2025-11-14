import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Program } from './program.entity';
import { AcademicTerm } from './academic-term.entity';
import { EnrollmentCourse } from '@enrollments/enrollments/enrollment-course.entity';
import { Professor } from '@professor/entities/professor.entity';

@Entity({ schema: 'academic', name: 'course_offering' })
export class CourseOffering {
  @PrimaryGeneratedColumn({ name: 'offering_id' })
  offeringId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'term_id' })
  termId: number;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @Column({ name: 'professor_id', nullable: true })
  professorId?: number;

  @Column({ name: 'capacity' })
  capacity: number;

  @Column({ name: 'program_id' })
  programId: number;

  @Column({ name: 'section' })
  section: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Course, (course) => course.offerings)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Program, (program) => program.courseOfferings)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => AcademicTerm, (term) => term.courseOfferings)
  @JoinColumn({ name: 'term_id' })
  term: AcademicTerm;

  enrollmentCourses: EnrollmentCourse[];

  @ManyToOne(() => Professor, (professor) => professor.courseOfferings)
  @JoinColumn({ name: 'professor_id' })
  professor: Professor;
}
