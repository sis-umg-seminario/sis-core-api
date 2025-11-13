import { Professor } from '@professor/entities/professor.entity';
import { DataSource } from 'typeorm';

export async function seedProfessors(dataSource: DataSource, userId: number) {
  const professorRepository = dataSource.getRepository(Professor);

  const createdProfessor = await professorRepository.save({
    name: 'Jane Doe',
    professionalTitle: 'Ingeniero en Sistemas',
    userId,
  });

  return createdProfessor;
}
