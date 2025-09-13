import { Controller, Get } from '@nestjs/common';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';

@Controller('/api/v1/payments')
export class PaymentsController {
  constructor(
    private readonly paymentresourceservice: PaymentResourcesService,
  ) {}
  @Get('/paymentTypes')
  getpaymenttypes() {
    return this.paymentresourceservice.getpaymenttypes();
  }
}
