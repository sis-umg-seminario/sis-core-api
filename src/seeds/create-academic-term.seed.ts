import { AcademicTerm } from '@academic/entities/academic-term.entity';
import { DataSource } from 'typeorm';

export async function seedAcademicTerm(
  dataSource: DataSource,
  termTypeId: number,
) {
  const academicTermRepository = dataSource.getRepository(AcademicTerm);
  const academicTerm = await academicTermRepository.save({
    name: 'julio-noviembre 2025',
    description: 'Academic year 2025',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-11-30'),
    termTypeId,
  });

  return academicTerm;
}
