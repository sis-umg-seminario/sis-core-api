import { seedTermType } from 'src/seeds/create-term-type.seed';
import AppDataSource from './data-source';
import { seedPaymentTypes } from 'src/seeds/create-payment-type.seed';
import { seedStudents } from 'src/seeds/create-students.seed';
import { seedProgram } from 'src/seeds/create-program.seed';
import { seedCourses } from 'src/seeds/create-course.seed';
import { seedStudentHistory } from 'src/seeds/create-student-history.seed';
import { seedStudentProgram } from 'src/seeds/create-student-program.seed';
import { seedAcademicTerm } from 'src/seeds/create-academic-term.seed';
import { truncateTables } from 'src/seeds/truncate-tables.seed';

async function runSeeds() {
  await AppDataSource.initialize();
  await truncateTables(AppDataSource);
  await seedPaymentTypes(AppDataSource);
  const student = await seedStudents(AppDataSource);
  const program = await seedProgram(AppDataSource);
  await seedStudentProgram(AppDataSource, student.studentId, program.programId);
  const termType = await seedTermType(AppDataSource);
  const academicTerm = await seedAcademicTerm(
    AppDataSource,
    termType.termTypeId,
  );
  const course = await seedCourses(
    AppDataSource,
    academicTerm.termId,
    program.programId,
  );
  await seedStudentHistory(AppDataSource, student.studentId, course.courseId);
  await AppDataSource.destroy();
}

runSeeds();
