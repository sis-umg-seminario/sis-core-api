import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursePrerequisite } from './entities/course-prerequisite.entity';
import { CourseOffering } from './entities/course-offering.entity';
import { Course } from './entities/course.entity';
import { PaymentsModule } from '@payments/payments.module';
import { AcademicService } from './services/academic.service';
import { StudentsModule } from '@students/students.module';
import { AcademicTerm } from './entities/academic-term.entity';
import { AcademicController } from './controllers/academic.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseOffering,
      CoursePrerequisite,
      AcademicTerm,
    ]),
    PaymentsModule,
    StudentsModule,
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [TypeOrmModule, AcademicService],
})
export class AcademicModule {}
