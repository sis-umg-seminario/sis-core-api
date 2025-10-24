// src\modules\payments\controllers\payments.controller.ts

import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { GetPaymentFeeDto } from '../dtos/get-payment-fee.dto'; // Importamos nuestro "formulario oficial"
import { ProcessPaymentDto } from '../dtos/process-payment.dto';

@Controller('/api/v1/payments')
export class PaymentsController {
  constructor(
    private readonly paymentresourceservice: PaymentResourcesService,
  ) {}

  @Get('/paymentTypes')
  getpaymenttypes() {
    return this.paymentresourceservice.getpaymenttypes();
  }

  @Post('/processPayment')
  processPayment(@Body() body: ProcessPaymentDto) {
    return this.paymentresourceservice.processPayment(body as any);
  }

  // --- NUEVA VENTANILLA DE ATENCIÓN ---
  // Esta es la URL que el exterior usará para hacer la pregunta.
  @Get('/paymentFee')
  getPaymentFee(@Query() queryParams: GetPaymentFeeDto) {
    // El "guardia de seguridad" ya revisó que los datos en queryParams son correctos.
    // Ahora solo pasamos la pregunta a nuestro servicio para que la resuelva.
    return this.paymentresourceservice.getPaymentFee(
      queryParams.paymentTypeId,
      queryParams.studentId,
    );
  }
}
