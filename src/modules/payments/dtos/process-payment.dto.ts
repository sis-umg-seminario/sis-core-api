import { IsNotEmpty, IsNumber, IsObject, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentDetailsDto {
  @IsNotEmpty()
  @IsString()
  cardName: string;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  expirationDate: string;

  @IsNotEmpty()
  @IsString()
  cardVerificationValue: string;

  @IsNotEmpty()
  @IsString()
  amount: string;
}

export class ProcessPaymentDto {
  @IsNotEmpty({ message: 'El parámetro studentId es requerido.' })
  @IsNumber({}, { message: 'El studentId debe ser un número.' })
  @Type(() => Number)
  studentId: number;

  @IsNotEmpty({ message: 'El parámetro paymentTypeId es requerido.' })
  @IsNumber({}, { message: 'El paymentTypeId debe ser un número.' })
  @Type(() => Number)
  paymentTypeId: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto;
}
