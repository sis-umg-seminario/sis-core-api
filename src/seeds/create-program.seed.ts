import { Program } from '@academic/entities/program.entity';
import { DataSource } from 'typeorm';

export async function seedProgram(dataSource: DataSource) {
  const programRepository = dataSource.getRepository(Program);
  const program = await programRepository.save({
    name: 'Ingeniería en Sistemas',
    description:
      'Licenciatura en Ingeniería en Sistemas y ciencias de la computación',
  });

  return program;
}
