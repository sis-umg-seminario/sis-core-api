import { CourseOffering } from '@academic/entities/course-offering.entity';
import { User } from '@auth/entities/user.entity';
import { StudentGrade } from '@students/entities/student-grade.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'professors', name: 'professor' })
export class Professor {
  @PrimaryGeneratedColumn({ name: 'professor_id' })
  professorId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'professional_title' })
  professionalTitle: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.professor)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CourseOffering, (offering) => offering.professor)
  courseOfferings: CourseOffering[];

  @OneToMany(() => StudentGrade, (studentGrade) => studentGrade.professor)
  studentGrades: StudentGrade[];
}
