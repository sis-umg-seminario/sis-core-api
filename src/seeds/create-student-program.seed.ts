import { DataSource } from 'typeorm';
import { StudentProgram } from '@students/entities/student-program.entity';

export async function seedStudentProgram(
  dataSource: DataSource,
  studentId: number,
  programId: number,
) {
  const studentRepository = dataSource.getRepository(StudentProgram);
  const studentProgram = await studentRepository.save({
    studentId,
    programId,
    startDate: new Date('2025-01-01'),
    status: 'ENROLLED',
  });

  return studentProgram;
}
