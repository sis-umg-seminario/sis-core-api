export async function truncateTables(dataSource) {
  const tableNames = [
    'academic.course',
    'academic.program',
    'academic.term_type',
    'payments.payment_order',
    'enrollments.enrollment',
    'enrollments.enrollment_course',
    'students.student',
    'students.student_history',
    'students.student_program',
    'academic.course_offering',
    'academic.course_prerequisite',
    'academic.academic_term',
    'academic.fee_definition',
    'payments.payment_type',
    'auth.user_role',
    'auth.role',
    'professors.professor',
    'auth.user',
  ];

  for (const tableName of tableNames) {
    await dataSource.query(
      `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`,
    );
  }
}
