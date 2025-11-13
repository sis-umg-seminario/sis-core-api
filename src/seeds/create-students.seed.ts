import { Student } from '@students/entities/student.entity';
import { DataSource } from 'typeorm';

export async function seedStudents(dataSource: DataSource, userId: number) {
  const studentRepository = dataSource.getRepository(Student);
  const createdStudent = await studentRepository.save({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    status: 'ACTIVE',
    userId,
    dateOfBirth: new Date('2000-01-01'),
  });

  return createdStudent;
}
