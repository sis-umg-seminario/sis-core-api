import { Course } from '@academic/entities/course.entity';
import { DataSource } from 'typeorm';

export async function seedCourses(
  dataSource: DataSource,
  termId: number,
  programId: number,
) {
  const courseRepository = dataSource.getRepository(Course);
  const course = await courseRepository.save({
    name: 'Cálculo I',
    code: 'MATH101',
  });
  await courseRepository.save([
    {
      name: 'Introducción a la Programación',
      code: 'test',
      offerings: [
        {
          termId,
          programId,
          startTime: '07:00',
          endTime: '9:00',
          professor: 'Dr. Smith',
          section: 'A',
          capacity: 30,
        },
        {
          termId,
          programId,
          startTime: '09:30',
          endTime: '11:30',
          professor: 'Dr. Jones',
          section: 'B',
          capacity: 25,
        },
      ],
      coursePrerequisites: [
        {
          type: 'CREDITS',
          requiredCredits: 5,
        },
      ],
      feeDefinitions: [
        {
          programId,
          amount: 250,
          feeScope: 'BASE',
        },
      ],
    },
    {
      name: 'Estructuras de Datos',
      code: 'test2',
      offerings: [
        {
          termId,
          programId,
          startTime: '14:00',
          endTime: '16:00',
          professor: 'Dr. Brown',
          section: 'A',
          capacity: 5,
        },
      ],
      coursePrerequisites: [
        {
          type: 'CREDITS',
          requiredCredits: 5,
        },
      ],
      feeDefinitions: [
        {
          programId,
          amount: 250,
          feeScope: 'BASE',
        },
      ],
    },
    {
      name: 'Cálculo II',
      code: 'MATH102',
      offerings: [
        {
          termId,
          programId,
          startTime: '09:30',
          endTime: '11:30',
          professor: 'Dr. Green',
          section: 'A',
          capacity: 5,
        },
      ],
      coursePrerequisites: [
        {
          type: 'COURSE',
          prerequisiteCourseId: course.courseId,
        },
      ],
      feeDefinitions: [
        {
          programId,
          amount: 250,
          feeScope: 'BASE',
        },
      ],
    },
    {
      name: 'Análisis de Sistemas I',
      code: 'MATH103',
      offerings: [
        {
          termId,
          programId,
          startTime: '11:30',
          endTime: '13:30',
          professor: 'Dr. Green',
          section: 'A',
          capacity: 40,
        },
      ],
      coursePrerequisites: [
        {
          type: 'CREDITS',
          requiredCredits: 20,
        },
      ],
      feeDefinitions: [
        {
          programId,
          amount: 250,
          feeScope: 'BASE',
        },
      ],
    },
  ]);

  return course;
}
