import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentType } from './payment-type.entity';
import { Student } from '@students/entities/student.entity';

@Entity({ schema: 'payments', name: 'payment_order' })
export class PaymentOrder {
  @PrimaryGeneratedColumn({ name: 'payment_order_id' })
  paymentOrderId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'payment_type_id' })
  paymentTypeId: number;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @Column({ name: 'status' })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'auth_code' })
  authCode: string;

  @ManyToOne(() => PaymentType, (paymentType) => paymentType.paymentOrders)
  @JoinColumn({ name: 'payment_type_id' })
  paymentType: PaymentType;

  @ManyToOne(() => Student, (student) => student.paymentOrders)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
