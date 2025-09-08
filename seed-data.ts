import { seedTermType } from 'seeds/create-term-type.seed';
import AppDataSource from './data-source';
import { seedPaymentTypes } from 'seeds/create-payment-type.seed';
import { seedStudents } from 'seeds/create-students.seed';
import { seedProgram } from 'seeds/create-program.seed';
import { seedCourses } from 'seeds/create-course.seed';
import { seedStudentHistory } from 'seeds/create-student-history.seed';
import { seedStudentProgram } from 'seeds/create-student-program.seed';
import { seedAcademicTerm } from 'seeds/create-academic-term.seed';
async function runSeeds() {
  await AppDataSource.initialize();
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
