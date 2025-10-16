import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentHistory } from './entities/student-history.entity';
import { StudentProgram } from './entities/student-program.entity';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { AcademicModule } from '../academic/academic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentHistory, StudentProgram]),
    forwardRef(() => AcademicModule),
  ],
  providers: [StudentsService],
  exports: [TypeOrmModule, StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
