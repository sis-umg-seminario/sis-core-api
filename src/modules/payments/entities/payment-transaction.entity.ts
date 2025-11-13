import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentOrder } from './payment-order.entity';

@Entity({ schema: 'payments', name: 'payment_transaction' })
export class PaymentTransaction {
  @PrimaryGeneratedColumn({ name: 'payment_transaction_id' })
  paymentTransactionId: number;

  @Column({ name: 'payment_order_id' })
  paymentOrderId: number;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'payment_date', type: 'timestamp' })
  paymentDate: Date;

  @Column({ name: 'method' })
  method: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'auth_code', nullable: true })
  authCode: string;

  @ManyToOne(() => PaymentOrder)
  @JoinColumn({ name: 'payment_order_id' })
  paymentOrder: PaymentOrder;
}
