import { Module } from '@nestjs/common';
import { EnrollmentsController } from './controllers/enrollments.controller';
import { EnrollmentsService } from './services/enrollments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollments/enrollment.entity';
import { EnrollmentCourse } from './enrollments/enrollment-course.entity';
import { PaymentsModule } from '@payments/payments.module';
import { AcademicModule } from '@academic/academic.module';
import { StudentsModule } from '@students/students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, EnrollmentCourse]),
    PaymentsModule,
    AcademicModule,
    StudentsModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [TypeOrmModule, EnrollmentsService],
})
export class EnrollmentsModule {}
