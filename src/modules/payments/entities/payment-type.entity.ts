import { Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { PaymentOrder } from './payment-order.entity';

@Entity({ schema: 'payments', name: 'payment_type' })
export class PaymentType {
  @PrimaryGeneratedColumn({ name: 'payment_type_id' })
  paymentTypeId: number;

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

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.paymentType)
  paymentOrders: PaymentOrder[];
}
