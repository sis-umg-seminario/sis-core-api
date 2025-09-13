import { MigrationInterface, QueryRunner } from "typeorm";

export class EnrollmentsTablesUpdate1757660601457 implements MigrationInterface {
    name = 'EnrollmentsTablesUpdate1757660601457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP CONSTRAINT "FK_9b6575ddf9f453f14003e86ee0b"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" RENAME COLUMN "payment_order_id" TO "enrollmentCoursesEnrollmentCourseId"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ALTER COLUMN "enrollmentCoursesEnrollmentCourseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD CONSTRAINT "FK_270854b38b9e91cd4c969f5dbcf" FOREIGN KEY ("enrollmentCoursesEnrollmentCourseId") REFERENCES "enrollments"."enrollment_course"("enrollment_course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP CONSTRAINT "FK_270854b38b9e91cd4c969f5dbcf"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ALTER COLUMN "enrollmentCoursesEnrollmentCourseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" RENAME COLUMN "enrollmentCoursesEnrollmentCourseId" TO "payment_order_id"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD CONSTRAINT "FK_9b6575ddf9f453f14003e86ee0b" FOREIGN KEY ("payment_order_id") REFERENCES "payments"."payment_order"("payment_order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
