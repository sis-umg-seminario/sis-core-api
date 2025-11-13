import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentProgram } from './student-program.entity';
import { StudentHistory } from './student-history.entity';
import { PaymentOrder } from '@payments/entities/payment-order.entity';
import { Enrollment } from '@enrollments/enrollments/enrollment.entity';
import { User } from '@auth/entities/user.entity';

@Entity({ schema: 'students', name: 'student' })
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'status' })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => StudentHistory, (history) => history.student)
  studentHistory: StudentHistory[];

  @OneToMany(() => StudentProgram, (program) => program.student)
  studentPrograms: StudentProgram[];

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.student)
  paymentOrders: PaymentOrder[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
