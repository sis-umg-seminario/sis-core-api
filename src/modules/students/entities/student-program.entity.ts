import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Program } from '@academic/entities/program.entity';

@Entity({ schema: 'students', name: 'student_program' })
export class StudentProgram {
  @PrimaryGeneratedColumn({ name: 'student_program_id' })
  studentProgramId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'program_id' })
  programId: number;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate?: Date;

  @Column({ name: 'status' })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Student, (student) => student.studentPrograms)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Program, (program) => program.studentPrograms)
  @JoinColumn({ name: 'program_id' })
  program: Program;
}
