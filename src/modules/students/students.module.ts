import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentHistory } from './entities/student-history.entity';
import { StudentProgram } from './entities/student-program.entity';
import { StudentsService } from './services/students.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentHistory, StudentProgram]),
  ],
  providers: [StudentsService],
  exports: [TypeOrmModule, StudentsService],
})
export class StudentsModule {}
