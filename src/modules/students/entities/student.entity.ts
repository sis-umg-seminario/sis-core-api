// src\modules\students\entities\student.entity.ts

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudentProgram } from './student-program.entity';
import { StudentHistory } from './student-history.entity';
import { PaymentOrder } from '@payments/entities/payment-order.entity';

@Entity({ schema: 'students', name: 'student' })
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id' })
  studentId: number;

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

  // --- CORRECCIÓN IMPORTANTE ---
  // Le decimos explícitamente a TypeORM que un estudiante
  // puede tener muchos historiales y muchos programas.
  @OneToMany(() => StudentHistory, (history) => history.student)
  studentHistory: StudentHistory[];

  @OneToMany(() => StudentProgram, (program) => program.student)
  studentPrograms: StudentProgram[];
  // --- FIN DE LA CORRECCIÓN ---

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.student)
  paymentOrders: PaymentOrder[];
}
