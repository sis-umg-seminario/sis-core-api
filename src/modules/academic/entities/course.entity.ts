import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CourseOffering } from './course-offering.entity';
import { CoursePrerequisite } from './course-prerequisite.entity';
import { StudentHistory } from '@students/entities/student-history.entity';
import { FeeDefinition } from './fee-definition.entity';

@Entity({ schema: 'academic', name: 'course' })
export class Course {
  @PrimaryGeneratedColumn({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => CourseOffering, (offering) => offering.course, {
    cascade: true,
  })
  offerings: CourseOffering[];

  @OneToMany(() => CoursePrerequisite, (prereq) => prereq.course, {
    cascade: true,
  })
  coursePrerequisites: CoursePrerequisite[];

  @OneToMany(() => StudentHistory, (history) => history.course)
  studentHistory: StudentHistory[];

  @OneToMany(() => FeeDefinition, (feeDefinition) => feeDefinition.course, {
    cascade: true,
  })
  feeDefinitions: FeeDefinition[];
}
