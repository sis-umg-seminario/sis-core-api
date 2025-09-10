import { Course } from '@academic/entities/course.entity';
import { StudentHistory } from '@students/entities/student-history.entity';

export const isCourseEligible = (
  course: Course,
  studentHistory: StudentHistory[],
): boolean => {
  const totalCreditsEarned = studentHistory.reduce(
    (sum, record) => sum + record.creditsEarned,
    0,
  );
  for (const coursePrerequisite of course.coursePrerequisites) {
    if (coursePrerequisite.type === 'CREDITS') {
      if (totalCreditsEarned < coursePrerequisite.requiredCredits) {
        return false;
      }
    } else if (coursePrerequisite.type === 'COURSE') {
      const hasCompletedPrerequisite = studentHistory.some(
        (record) =>
          record.courseId === coursePrerequisite.prerequisiteCourseId &&
          record.status === 'APPROVED',
      );
      if (!hasCompletedPrerequisite) {
        return false;
      }
    }
  }
  return true;
};
