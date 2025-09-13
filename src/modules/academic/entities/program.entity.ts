import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CourseOffering } from './course-offering.entity';
import { StudentProgram } from '@students/entities/student-program.entity';
import { Enrollment } from '@enrollments/enrollments/enrollment.entity';
import { FeeDefinition } from './fee-definition.entity';

@Entity({ schema: 'academic', name: 'program' })
export class Program {
  @PrimaryGeneratedColumn({ name: 'program_id' })
  programId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => CourseOffering, (offering) => offering.program)
  courseOfferings: CourseOffering[];

  @OneToMany(() => StudentProgram, (studentProgram) => studentProgram.program)
  studentPrograms: StudentProgram[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.program)
  enrollments: Enrollment[];

  @OneToMany(() => FeeDefinition, (feeDefinition) => feeDefinition.program)
  feeDefinitions: FeeDefinition[];
}
