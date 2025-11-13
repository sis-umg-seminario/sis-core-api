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
import { seedRoles } from 'src/seeds/create-roles.seed';
import { seedUsers } from 'src/seeds/create-users.seed';
import { seedProfessors } from 'src/seeds/create-professors.seed';

async function runSeeds() {
  await AppDataSource.initialize();
  await truncateTables(AppDataSource);
  await seedPaymentTypes(AppDataSource);
  const roles = await seedRoles(AppDataSource);
  const users = await seedUsers(
    AppDataSource,
    roles.map((role) => role.roleId),
  );
  const student = await seedStudents(AppDataSource, users[0].userId);
  await seedProfessors(AppDataSource, users[1].userId);
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
