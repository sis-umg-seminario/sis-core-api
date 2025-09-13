import { AcademicTerm } from '@academic/entities/academic-term.entity';
import { TZDate } from '@date-fns/tz';
import { DataSource } from 'typeorm';

export async function seedAcademicTerm(
  dataSource: DataSource,
  termTypeId: number,
) {
  const academicTermRepository = dataSource.getRepository(AcademicTerm);
  const startDate = new TZDate(2025, 6, 1, 'America/Guatemala');
  const endDate = new TZDate(2025, 10, 30, 'America/Guatemala');
  const academicTerm = await academicTermRepository.save({
    name: 'julio-noviembre 2025',
    description: 'Academic year 2025',
    startDate: startDate,
    endDate: endDate,
    termTypeId,
  });

  return academicTerm;
}
