import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcademicModule } from '@academic/academic.module';
import { PaymentsModule } from '@payments/payments.module';
import { StudentsModule } from '@students/students.module';
import { ExampleModule } from '@example/example.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@config/database.module';
import { EnrollmentsModule } from '@enrollments/enrollments.module';
import { ProfessorModule } from '@professor/professor.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AcademicModule,
    PaymentsModule,
    StudentsModule,
    ExampleModule,
    DatabaseModule,
    EnrollmentsModule,
    ProfessorModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
