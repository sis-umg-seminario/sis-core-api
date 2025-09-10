import { TermType } from '@academic/entities/term-type.entity';
import { DataSource } from 'typeorm';

export async function seedTermType(dataSource: DataSource) {
  const termTypeRepository = dataSource.getRepository(TermType);

  const termType = await termTypeRepository.save({
    name: 'SEMESTER',
    description: 'Semestre',
    durationMonths: 5,
  });

  return termType;
}
