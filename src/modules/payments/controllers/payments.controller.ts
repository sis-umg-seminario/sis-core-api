// src\modules\payments\controllers\payments.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { GetPaymentFeeDto } from '../dtos/get-payment-fee.dto'; // Importamos nuestro "formulario oficial"

@Controller('/api/v1/payments')
export class PaymentsController {
  constructor(
    private readonly paymentresourceservice: PaymentResourcesService,
  ) {}

  @Get('/paymentTypes')
  getpaymenttypes() {
    return this.paymentresourceservice.getpaymenttypes();
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
      Name: 'Axel Mauricio Véliz Poom',
      program: 'Ingeniería de Sistemas',
      currency: 'GTQ',
      period: {
        year: anioNum,
        semester: semestreNum,
        title: periodoTitulo,
      },
      status: 'PENDIENTE', // AL_DIA | PENDIENTE | EN_MORA
      items: [
        {
          date: '2023-01-10',
          document: 'ORD-2023-0001',
          description: 'Inscripción',
          type: 'CARGO', // CARGO | ABONO
          amount: 350.0,
          paid: true,
          paymentDate: '2023-01-12',
          paymentMethod: 'Tarjeta',
        },
        {
          date: '2023-02-05',
          document: 'MEN-2023-02',
          description: 'Mensualidad Febrero',
          type: 'CARGO',
          amount: 600.0,
          paid: true,
          paymentDate: '2023-02-05',
          paymentMethod: 'Transferencia',
        },
        {
          date: '2023-03-05',
          document: 'MEN-2023-03',
          description: 'Mensualidad Marzo',
          type: 'CARGO',
          amount: 600.0,
          paid: false,
          dueDate: '2023-03-10',
          daysOverdue: 15,
        },
        {
          date: '2023-03-20',
          document: 'PAG-2023-1034',
          description: 'Pago parcial',
          type: 'ABONO',
          amount: 300.0,
          reference: 'POS-12345',
        },
        {
          date: '2023-04-05',
          document: 'MEN-2023-04',
          description: 'Mensualidad Abril',
          type: 'CARGO',
          amount: 600.0,
          paid: false,
          dueDate: '2023-04-10',
          daysOverdue: 0,
        },
      ],
      totals: {
        totalCharges: 2150.0,
        totalPayments: 300.0,
        balance: 1850.0,
        statementDate: '2023-04-15',
      },
    };
  }
}
