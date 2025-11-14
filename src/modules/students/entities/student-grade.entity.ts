import { GradeCategory } from '@academic/entities/grade-category.entity';
import { EnrollmentCourse } from '@enrollments/enrollments/enrollment-course.entity';
import { Professor } from '@professor/entities/professor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'students', name: 'student_grade' })
export class StudentGrade {
  @PrimaryGeneratedColumn({ name: 'student_grade_id' })
  studentGradeId: number;
  @Column({ name: 'enrollment_course_id' })
  enrollmentCourseId: number;
  @Column({ name: 'grade_category_id' })
  gradeCategoryId: number;
  @Column({ name: 'score' })
  score: number;
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({ name: 'submitted_by' })
  submittedBy: number;

  @ManyToOne(
    () => EnrollmentCourse,
    (enrollmentCourse) => enrollmentCourse.studentGrades,
  )
  @JoinColumn({ name: 'enrollment_course_id' })
  enrollmentCourse: EnrollmentCourse;

  @ManyToOne(
    () => GradeCategory,
    (gradeCategory) => gradeCategory.studentGrades,
  )
  @JoinColumn({ name: 'grade_category_id' })
  gradeCategory: GradeCategory;

  @ManyToOne(() => Professor, (professor) => professor.studentGrades)
  @JoinColumn({ name: 'submitted_by' })
  professor: Professor;
}
