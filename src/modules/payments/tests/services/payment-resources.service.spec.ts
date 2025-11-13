import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { PaymentType } from '@payments/entities/payment-type.entity';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentOrder } from '@payments/entities/payment-order.entity';
import { PaymentTransaction } from '@payments/entities/payment-transaction.entity';
import { StudentsService } from '@students/services/students.service';

describe('PaymentResourcesService', () => {
  let service: PaymentResourcesService;
  let paymentTypeRepository: jest.Mocked<Repository<PaymentType>>;
  let paymentOrderRepository: jest.Mocked<Repository<PaymentOrder>>;
  let paymentTransactionRepository: jest.Mocked<Repository<PaymentTransaction>>;
  let studentsService: { getStudentEnrollmentFee: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentResourcesService,
        {
          provide: getRepositoryToken(PaymentType),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PaymentOrder),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PaymentTransaction),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: StudentsService,
          useValue: {
            getStudentEnrollmentFee: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentResourcesService>(PaymentResourcesService);
    paymentTypeRepository = module.get(getRepositoryToken(PaymentType));
    paymentOrderRepository = module.get(getRepositoryToken(PaymentOrder));
    paymentTransactionRepository = module.get(
      getRepositoryToken(PaymentTransaction),
    );
    // @ts-ignore
    studentsService = module.get(StudentsService);
  });

  it('should return paymentTypeId when payment type exists', async () => {
    paymentTypeRepository.findOne.mockResolvedValue({
      paymentTypeId: 42,
    } as PaymentType);

    const result = await service.getPaymentType('CASH');
    expect(result).toBe(42);
    expect(paymentTypeRepository.findOne).toHaveBeenCalledWith({
      where: { name: 'CASH' },
      select: ['paymentTypeId'],
    });
  });

  it('should throw HttpException when payment type does not exist', async () => {
    paymentTypeRepository.findOne.mockResolvedValue(null);

    await expect(service.getPaymentType('NON_EXISTENT')).rejects.toThrow(
      HttpException,
    );
    await expect(service.getPaymentType('NON_EXISTENT')).rejects.toThrow(
      'Payment type NON_EXISTENT not found',
    );
  });

  describe('processPayment', () => {
    it('should create payment order and transaction and return authorization code', async () => {
      // Arrange
      // @ts-ignore
      studentsService.getStudentEnrollmentFee.mockResolvedValue(1000);
      paymentOrderRepository.save.mockResolvedValue({
        paymentOrderId: 1,
      } as any);
      paymentTransactionRepository.save.mockResolvedValue({
        paymentTransactionId: 1,
      } as any);

      // Act
      const result = await service.processPayment({
        studentId: 123,
        paymentTypeId: 10,
        paymentDetails: { amount: '1000' },
      } as any);

      // Assert
      expect(result).toHaveProperty('message', 'Pago realizado correctamente!');
      expect(result).toHaveProperty('authorizationCode');
      expect(String(result.authorizationCode)).toHaveLength(6);
      expect(paymentOrderRepository.save).toHaveBeenCalled();
      expect(paymentTransactionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ paymentOrderId: 1, amount: 1000 }),
      );
    });

    it('should throw 400 when amount does not match enrollment fee', async () => {
      // Arrange
      // @ts-ignore
      studentsService.getStudentEnrollmentFee.mockResolvedValue(1200);

      // Act & Assert
      await expect(
        service.processPayment({
          studentId: 123,
          paymentTypeId: 10,
          paymentDetails: { amount: '1000' },
        } as any),
      ).rejects.toMatchObject({
        status: 400,
        response: { message: expect.any(String) },
      });
    });

    it('should throw 500 when saving payment order fails', async () => {
      // Arrange
      // @ts-ignore
      studentsService.getStudentEnrollmentFee.mockResolvedValue(1000);
      paymentOrderRepository.save.mockRejectedValue(new Error('DB down'));

      await expect(
        service.processPayment({
          studentId: 123,
          paymentTypeId: 10,
          paymentDetails: { amount: '1000' },
        } as any),
      ).rejects.toMatchObject({ status: 500 });
    });
  });
});
