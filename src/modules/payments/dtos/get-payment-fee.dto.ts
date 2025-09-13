// src\modules\payments\dtos\get-payment-fee.dto.ts

import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPaymentFeeDto {
  @IsNotEmpty({ message: 'El parámetro paymentTypeId es requerido.' })
  @IsNumber({}, { message: 'El paymentTypeId debe ser un número.' })
  @Type(() => Number) // Ayuda a convertir el texto de la URL a un número real
  paymentTypeId: number;

  @IsNotEmpty({ message: 'El parámetro studentId es requerido.' })
  @IsNumber({}, { message: 'El studentId debe ser un número.' })
  @Type(() => Number) // Ayuda a convertir el texto de la URL a un número real
  studentId: number;
}
