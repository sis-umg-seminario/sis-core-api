import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentOrder } from '@payments/entities/payment-order.entity';
import { PaymentType } from '@payments/entities/payment-type.entity';
import { StudentsService } from '@students/services/students.service';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentResourcesService {
  constructor(
    @InjectRepository(PaymentType)
    private paymentTypeRepository: Repository<PaymentType>,
    @InjectRepository(PaymentOrder)
    private paymentOrderRepository: Repository<PaymentOrder>,
    private readonly studentsService: StudentsService,
  ) {}

  // --- FUNCIÓN RESTAURADA 1 ---
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

  // --- FUNCIÓN RESTAURADA 2 ---
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

  // Tu función que ya funcionaba
  public async getpaymenttypes() {
    const result = await this.paymentTypeRepository.find();
    return {
      paymentTypes: result.map((item) => ({
        id: item.paymentTypeId,
        description: item.description,
      })),
    };
  }

  // La nueva función que acabamos de agregar
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
}
