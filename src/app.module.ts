import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcademicModule } from '@academic/academic.module';
import { PaymentsModule } from '@payments/payments.module';
import { StudentsModule } from '@students/students.module';
import { ExampleModule } from '@example/example.module';

@Module({
  imports: [AcademicModule, PaymentsModule, StudentsModule, ExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
