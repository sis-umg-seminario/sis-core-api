// src\modules\payments\payments.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentOrder } from './entities/payment-order.entity';
import { PaymentResourcesService } from './services/payment-resources.service';
import { PaymentsController } from './controllers/payments.controller';
import { StudentsModule } from '../students/students.module'; // Importamos el módulo de Estudiantes

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentOrder, PaymentType]),
    StudentsModule, // Conectamos "Pagos" con "Estudiantes"
  ],
  exports: [TypeOrmModule, PaymentResourcesService],
  providers: [PaymentResourcesService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
