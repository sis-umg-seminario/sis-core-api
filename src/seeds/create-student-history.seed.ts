import { StudentHistory } from '@students/entities/student-history.entity';
import { DataSource } from 'typeorm';

export async function seedStudentHistory(
  dataSource: DataSource,
  studentId: number,
  courseId: number,
) {
  const studentRepository = dataSource.getRepository(StudentHistory);
  const studentHistory = await studentRepository.save({
    studentId,
    courseId,
    status: 'APPROVED',
    grade: 'A',
    creditsEarned: 5,
  });

  return studentHistory;
}
