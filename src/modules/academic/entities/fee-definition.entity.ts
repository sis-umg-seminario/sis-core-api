import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Program } from './program.entity';
import { Course } from './course.entity';

@Entity({ schema: 'academic', name: 'fee_definition' })
export class FeeDefinition {
  @PrimaryGeneratedColumn({ name: 'fee_id' })
  feeId: number;

  @Column({ name: 'program_id' })
  programId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'amount' })
  amount: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'fee_scope' })
  feeScope: string;

  @ManyToOne(() => Program, (program) => program.feeDefinitions)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => Course, (course) => course.feeDefinitions)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
