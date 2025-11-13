import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentOrder } from '@payments/entities/payment-order.entity';
import { PaymentType } from '@payments/entities/payment-type.entity';
import { PaymentTransaction } from '@payments/entities/payment-transaction.entity';
import { StudentsService } from '@students/services/students.service';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentResourcesService {
  constructor(
    @InjectRepository(PaymentType)
    private paymentTypeRepository: Repository<PaymentType>,
    @InjectRepository(PaymentOrder)
    private paymentOrderRepository: Repository<PaymentOrder>,
    @InjectRepository(PaymentTransaction)
    private paymentTransactionRepository: Repository<PaymentTransaction>,
    private readonly studentsService: StudentsService,
  ) {}

  public async getPaymentType(paymentType: string): Promise<number> {
    const response = await this.paymentTypeRepository.findOne({
      where: { name: paymentType },
      select: ['paymentTypeId'],
    });
    if (!response) {
      throw new HttpException(`Payment type ${paymentType} not found`, 404);
    }
    return response.paymentTypeId;
  }

  public async validatePayment(
    paymentTypeId: number,
    paymentCode: number,
  ): Promise<void> {
    const paymentOrder = await this.paymentOrderRepository.findOne({
      where: {
        paymentTypeId,
        authCode: paymentCode.toString(),
        status: 'PAID',
      },
    });
    if (!paymentOrder) {
      throw new HttpException(
        { message: 'No se encontró un pago relacionado a la inscripción' },
        404,
      );
    }
  }

  public async getpaymenttypes() {
    const result = await this.paymentTypeRepository.find();
    return {
      paymentTypes: result.map((item) => ({
        id: item.paymentTypeId,
        description: item.description,
      })),
    };
  }

  public async getPaymentFee(
    paymentTypeId: number,
    studentId: number,
  ): Promise<{ paymentTypeId: number; enrollmentFee: string }> {
    const enrollmentFee =
      await this.studentsService.getStudentEnrollmentFee(studentId);
    return {
      paymentTypeId: paymentTypeId,
      enrollmentFee: enrollmentFee.toString(),
    };
  }

  public async savePaymentOrders(paymentOrders: Partial<PaymentOrder>[]) {
    try {
      await this.paymentOrderRepository.save(paymentOrders);
    } catch (error) {
      throw new HttpException(
        { message: 'Error al guardar las órdenes de pago', error },
        500,
      );
    }
  }

  // Implementa el flujo de procesamiento de pago según la especificación
  public async processPayment(payload: {
    studentId: number;
    paymentTypeId: number;
    paymentDetails: { amount: string } & Record<string, any>;
  }): Promise<{ message: string; authorizationCode: string }> {
    const { studentId, paymentTypeId, paymentDetails } = payload;

    // 1.1 Obtener precio de la carrera
    const enrollmentFee = await this.studentsService.getStudentEnrollmentFee(
      studentId,
    );

    const requestedAmount = parseFloat(paymentDetails.amount);

    if (Number(enrollmentFee) !== Number(requestedAmount)) {
      throw new HttpException(
        {
          message:
            'El monto a pagar no coincide con el costo del enrrolamiento de la carrera.',
        },
        400,
      );
    }

    // 1.3 Simular procesamiento de pago: generar authorizationCode de 6 dígitos
    const authorizationCode = (
      Math.floor(Math.random() * 900000) + 100000
    ).toString();

    // 1.4 Registrar payment_order
    const paymentOrderToSave: Partial<PaymentOrder> = {
      studentId,
      paymentTypeId,
      totalAmount: Math.round(requestedAmount),
      dueDate: new Date(),
      status: 'PAID',
      authCode: authorizationCode,
    };

    let savedOrder: PaymentOrder;
    try {
      savedOrder = await this.paymentOrderRepository.save(paymentOrderToSave as any);
    } catch (error) {
      throw new HttpException(
        { message: 'Error al guardar la orden de pago', error },
        500,
      );
    }

    // 1.5 Registrar la transacción
    const transactionToSave = {
      paymentOrderId: savedOrder.paymentOrderId,
      amount: Math.round(requestedAmount),
      paymentDate: new Date(),
      method: 'CREDIT_CARD',
      status: 'SUCCESS',
      authCode: authorizationCode,
    };

    try {
      await this.paymentTransactionRepository.save(transactionToSave as any);
    } catch (error) {
      // Si falla la transacción, opcionalmente podríamos revertir la orden o marcarla
      throw new HttpException(
        { message: 'Error al guardar la transacción de pago', error },
        500,
      );
    }

    

    // 1.7 Respuesta del resumen de pago
    return {
      message: 'Pago realizado correctamente!',
      authorizationCode,
    };
  }
}
