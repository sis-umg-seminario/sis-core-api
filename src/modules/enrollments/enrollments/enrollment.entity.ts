import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AcademicTerm } from '@academic/entities/academic-term.entity';
import { Program } from '@academic/entities/program.entity';
import { Student } from '@students/entities/student.entity';
import { EnrollmentCourse } from './enrollment-course.entity';

@Entity({ schema: 'enrollments', name: 'enrollment' })
export class Enrollment {
  @PrimaryGeneratedColumn()
  enrollmentId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'program_id' })
  programId: number;

  @Column({ name: 'term_id' })
  termId: number;

  @Column({ name: 'enrollment_date' })
  enrollmentDate: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'status' })
  status: string;

  @ManyToOne(() => Student, (student) => student.enrollments)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Program, (program) => program.enrollments)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => AcademicTerm, (term) => term.enrollments)
  @JoinColumn({ name: 'term_id' })
  academicTerm: AcademicTerm;

  @OneToMany(() => EnrollmentCourse, (course) => course.enrollment, {
    cascade: true,
  })
  enrollmentCourses: EnrollmentCourse[];
}
