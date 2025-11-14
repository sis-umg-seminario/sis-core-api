import { StudentGrade } from '@students/entities/student-grade.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'academic', name: 'grade_category' })
export class GradeCategory {
  @PrimaryGeneratedColumn({ name: 'grade_category_id' })
  gradeCategoryId: number;
  @Column({ name: 'description' })
  description: string;
  @Column({ name: 'identifier' })
  identifier: string;
  @Column({ name: 'weight' })
  weight: string;
  @Column({ name: 'max_score' })
  maxScore: number;
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => StudentGrade, (studentGrade) => studentGrade.gradeCategory)
  studentGrades: StudentGrade[];
}
