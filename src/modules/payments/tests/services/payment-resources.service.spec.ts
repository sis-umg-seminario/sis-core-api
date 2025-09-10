import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { PaymentType } from '@payments/entities/payment-type.entity';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentOrder } from '@payments/entities/payment-order.entity';

describe('PaymentResourcesService', () => {
  let service: PaymentResourcesService;
  let paymentTypeRepository: jest.Mocked<Repository<PaymentType>>;

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
          },
        },
      ],
    }).compile();

    service = module.get<PaymentResourcesService>(PaymentResourcesService);
    paymentTypeRepository = module.get(getRepositoryToken(PaymentType));
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
});
