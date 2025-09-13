import { PaymentType } from '@payments/entities/payment-type.entity';
import { DataSource } from 'typeorm';

export async function seedPaymentTypes(dataSource: DataSource) {
  const paymentTypeRepository = dataSource.getRepository(PaymentType);
  await paymentTypeRepository.save([
    {
      name: 'ENROLLMENT',
      description: '001 - Inscripción',
    },
    {
      name: 'MONTHLY',
      description: '002 - Mensualidad',
    },
  ]);
}
