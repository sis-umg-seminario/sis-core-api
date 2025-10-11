import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentHistory } from './entities/student-history.entity';
import { StudentProgram } from './entities/student-program.entity';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentHistory, StudentProgram]),
  ],
  providers: [StudentsService],
  exports: [TypeOrmModule, StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
