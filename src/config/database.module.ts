import { AcademicTerm } from '@academic/entities/academic-term.entity';
import { CourseOffering } from '@academic/entities/course-offering.entity';
import { CoursePrerequisite } from '@academic/entities/course-prerequisite.entity';
import { Course } from '@academic/entities/course.entity';
import { Program } from '@academic/entities/program.entity';
import { TermType } from '@academic/entities/term-type.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentOrder } from '@payments/entities/payment-order.entity';
import { PaymentType } from '@payments/entities/payment-type.entity';
import { StudentHistory } from '@students/entities/student-history.entity';
import { StudentProgram } from '@students/entities/student-program.entity';
import { Student } from '@students/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        // entities: [
        //   PaymentType,
        //   PaymentOrder,
        //   AcademicTerm,
        //   CourseOffering,
        //   CoursePrerequisite,
        //   Course,
        //   Program,
        //   TermType,
        //   StudentHistory,
        //   StudentProgram,
        //   Student,
        // ],
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
