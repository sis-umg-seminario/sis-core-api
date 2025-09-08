import { Student } from '@students/entities/student.entity';
import { DataSource } from 'typeorm';

export async function seedStudents(dataSource: DataSource) {
  const studentRepository = dataSource.getRepository(Student);
  const createdStudent = await studentRepository.save({
    firstName: 'John',
    lastName: 'Doe',
    email: 'lalvaradoc9@miumg.edu.gt',
    status: 'ACTIVE',
    dateOfBirth: new Date('2000-01-01'),
  });

  return createdStudent;
}
