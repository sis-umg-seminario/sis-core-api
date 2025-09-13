import { MigrationInterface, QueryRunner } from "typeorm";

export class EnrollmentsTablesUpdate1757710402185 implements MigrationInterface {
    name = 'EnrollmentsTablesUpdate1757710402185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP CONSTRAINT "FK_270854b38b9e91cd4c969f5dbcf"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP COLUMN "enrollmentCoursesEnrollmentCourseId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD "enrollmentCoursesEnrollmentCourseId" integer`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD CONSTRAINT "FK_270854b38b9e91cd4c969f5dbcf" FOREIGN KEY ("enrollmentCoursesEnrollmentCourseId") REFERENCES "enrollments"."enrollment_course"("enrollment_course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
