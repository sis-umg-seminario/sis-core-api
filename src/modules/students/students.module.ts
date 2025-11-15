import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentHistory } from './entities/student-history.entity';
import { StudentProgram } from './entities/student-program.entity';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { AcademicModule } from '../academic/academic.module';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EnrollmentCourse } from '@enrollments/enrollments/enrollment-course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      StudentHistory,
      StudentProgram,
      EnrollmentCourse,
    ]),
    forwardRef(() => AcademicModule),
    JwtModule.register({}),
  ],
  providers: [StudentsService],
  exports: [TypeOrmModule, StudentsService],
  controllers: [StudentsController, AuthController],
})
export class StudentsModule {}
