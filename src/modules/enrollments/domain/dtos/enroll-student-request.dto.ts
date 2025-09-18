import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class EnrollStudentRequestDto {
  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  termId: number;

  @IsNotEmpty()
  programId: number;

  @IsNotEmpty()
  paymentCode: number;

  @ValidateNested({ each: true })
  @Type(() => OfferingCourseDto)
  offeringCourses: OfferingCourseDto[];
}

class OfferingCourseDto {
  @IsNotEmpty()
  offeringId: number;
}
