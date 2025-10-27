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

  // -----------------------------
  // MOCK: Estado de cuenta del estudiante
  // Ejemplo:
  // GET /api/v1/payments/account-statement?studentId=2001&anio=2023&semestre=2
  // -----------------------------
  @Get('/account-statement')
  getAccountStatement(
    @Query('studentId') studentId: number,
    @Query('anio') anio: number,
    @Query('semestre') semestre: number,
  ) {
    const studentIdNum = Number(studentId);
    const anioNum = Number(anio);
    const semestreNum = Number(semestre);
    const periodoTitulo =
      semestreNum === 1
        ? `Primer Semestre ${anioNum}`
        : `Segundo Semestre ${anioNum}`;

    return {
      studentId: studentIdNum,
      estudiante: 'Axel Mauricio Véliz Poom',
      programa: 'Ingeniería de Sistemas',
      moneda: 'GTQ',
      periodo: {
        anio: anioNum,
        semestre: semestreNum,
        titulo: periodoTitulo,
      },
      estado: 'PENDIENTE', // AL_DIA | PENDIENTE | EN_MORA
      items: [
        {
          fecha: '2023-01-10',
          documento: 'ORD-2023-0001',
          concepto: 'Inscripción',
          tipo: 'CARGO', // CARGO | ABONO
          monto: 350.0,
          pagado: true,
          fechaPago: '2023-01-12',
          medioPago: 'Tarjeta',
        },
        {
          fecha: '2023-02-05',
          documento: 'MEN-2023-02',
          concepto: 'Mensualidad Febrero',
          tipo: 'CARGO',
          monto: 600.0,
          pagado: true,
          fechaPago: '2023-02-05',
          medioPago: 'Transferencia',
        },
        {
          fecha: '2023-03-05',
          documento: 'MEN-2023-03',
          concepto: 'Mensualidad Marzo',
          tipo: 'CARGO',
          monto: 600.0,
          pagado: false,
          fechaVencimiento: '2023-03-10',
          diasAtraso: 15,
        },
        {
          fecha: '2023-03-20',
          documento: 'PAG-2023-1034',
          concepto: 'Pago parcial',
          tipo: 'ABONO',
          monto: 300.0,
          referencia: 'POS-12345',
        },
        {
          fecha: '2023-04-05',
          documento: 'MEN-2023-04',
          concepto: 'Mensualidad Abril',
          tipo: 'CARGO',
          monto: 600.0,
          pagado: false,
          fechaVencimiento: '2023-04-10',
          diasAtraso: 0,
        },
      ],
      totales: {
        totalCargos: 2150.0,
        totalAbonos: 300.0,
        saldo: 1850.0,
        fechaCorte: '2023-04-15',
      },
    };
  }
}
