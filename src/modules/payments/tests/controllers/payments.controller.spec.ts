import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '@payments/controllers/payments.controller';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { ProcessPaymentDto } from '@payments/dtos/process-payment.dto';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentResourcesService: Partial<PaymentResourcesService> & {
    processPayment: jest.Mock;
  };

  beforeEach(async () => {
    paymentResourcesService = {
      processPayment: jest.fn().mockResolvedValue({
        message: 'Pago realizado correctamente!',
        authorizationCode: '123456',
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentResourcesService,
          useValue: paymentResourcesService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should forward processPayment body to service and return result', async () => {
    const dto: ProcessPaymentDto = {
      studentId: 123,
      paymentTypeId: 10,
      paymentDetails: {
        cardName: 'John Doe',
        cardNumber: '4000XXXXXXXX0416',
        expirationDate: '04/29',
        cardVerificationValue: '123',
        amount: '1000',
      },
    } as any;

    const res = await controller.processPayment(dto as any);

    expect(paymentResourcesService.processPayment).toHaveBeenCalledWith(dto);
    expect(res).toEqual({
      message: 'Pago realizado correctamente!',
      authorizationCode: '123456',
    });
  });
});
