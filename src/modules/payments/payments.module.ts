import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentOrder } from './entities/payment-order.entity';
import { PaymentResourcesService } from './services/payment-resources.service';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentOrder, PaymentType])],
  exports: [TypeOrmModule, PaymentResourcesService],
  providers: [PaymentResourcesService],
  controllers:[PaymentsController]
})
export class PaymentsModule {}
