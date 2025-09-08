import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Course } from '@academic/entities/course.entity';

@Entity({ schema: 'students', name: 'student_history' })
export class StudentHistory {
  @PrimaryGeneratedColumn({ name: 'history_id' })
  historyId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'action' })
  grade: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'credits_earned' })
  creditsEarned: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Student, (student) => student.studentHistory)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.studentHistory)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
