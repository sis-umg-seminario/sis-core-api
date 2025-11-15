import { Module } from '@nestjs/common';
import { ProfessorController } from './controllers/professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { ProfessorService } from './services/professor.service';
import { CourseOffering } from '@academic/entities/course-offering.entity';
import { JwtModule } from '@nestjs/jwt';
import { GradeCategory } from '@academic/entities/grade-category.entity';
import { EnrollmentCourse } from '@enrollments/enrollments/enrollment-course.entity';
import { StudentGrade } from '@students/entities/student-grade.entity';
import { Student } from '@students/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Professor,
      CourseOffering,
      GradeCategory,
      StudentGrade,
      EnrollmentCourse,
      Student,
    ]),
    JwtModule.register({}),
  ],
  controllers: [ProfessorController],
  exports: [TypeOrmModule, ProfessorService],
  providers: [ProfessorService],
})
export class ProfessorModule {}
