import { GradeCategory } from '@academic/entities/grade-category.entity';
import { DataSource } from 'typeorm';

export async function seedGradeCategories(dataSource: DataSource) {
  const gradeCategoryRepository = dataSource.getRepository(GradeCategory);

  await gradeCategoryRepository.save([
    {
      description: 'Examen Parcial 1',
      identifier: 'midtermExam1',
      weight: '0.1',
      maxScore: 100,
    },
    {
      description: 'Examen Parcial 2',
      identifier: 'midtermExam2',
      weight: '0.2',
      maxScore: 100,
    },
    {
      description: 'Actividades',
      identifier: 'assignments',
      weight: '0.35',
      maxScore: 100,
    },
    {
      description: 'Examen Final',
      identifier: 'final',
      weight: '0.35',
      maxScore: 100,
    },
  ]);
}
