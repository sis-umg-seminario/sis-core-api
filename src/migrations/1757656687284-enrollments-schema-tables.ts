import { MigrationInterface, QueryRunner } from "typeorm";

export class EnrollmentsSchemaTables1757656687284 implements MigrationInterface {
    name = 'EnrollmentsSchemaTables1757656687284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "academic"."fee_definition" ("fee_id" SERIAL NOT NULL, "program_id" integer NOT NULL, "course_id" integer NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "fee_scope" character varying NOT NULL, CONSTRAINT "PK_9d292a0dcdfb3e3927e11f1cfb7" PRIMARY KEY ("fee_id"))`);
        await queryRunner.query(`CREATE TABLE "enrollments"."enrollment" ("enrollmentId" SERIAL NOT NULL, "student_id" integer NOT NULL, "program_id" integer NOT NULL, "term_id" integer NOT NULL, "payment_order_id" integer NOT NULL, "enrollment_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, CONSTRAINT "PK_7a30ba4bb9df2ded3e603f42a5b" PRIMARY KEY ("enrollmentId"))`);
        await queryRunner.query(`CREATE TABLE "enrollments"."enrollment_course" ("enrollment_course_id" SERIAL NOT NULL, "enrollment_id" integer NOT NULL, "offering_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, CONSTRAINT "PK_f40700f3497e893f4470a5f0368" PRIMARY KEY ("enrollment_course_id"))`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ADD "context_id" character varying`);
        await queryRunner.query(`ALTER TABLE "academic"."fee_definition" ADD CONSTRAINT "FK_2d6c8d949d4c2fd02235c6c7ac3" FOREIGN KEY ("program_id") REFERENCES "academic"."program"("program_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "academic"."fee_definition" ADD CONSTRAINT "FK_0beb940eef52c46d03ce0fcdd86" FOREIGN KEY ("course_id") REFERENCES "academic"."course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD CONSTRAINT "FK_eb0d79d7b8954d3129d032b0bb1" FOREIGN KEY ("student_id") REFERENCES "students"."student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD CONSTRAINT "FK_5d4ddd9d8080e95d21884b019a6" FOREIGN KEY ("program_id") REFERENCES "academic"."program"("program_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD CONSTRAINT "FK_e2ae0efcb804b14080818955574" FOREIGN KEY ("term_id") REFERENCES "academic"."academic_term"("term_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" ADD CONSTRAINT "FK_9b6575ddf9f453f14003e86ee0b" FOREIGN KEY ("payment_order_id") REFERENCES "payments"."payment_order"("payment_order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment_course" ADD CONSTRAINT "FK_7fcd97745acc0589552f06bbdd6" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"."enrollment"("enrollmentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment_course" ADD CONSTRAINT "FK_2aabbb270d8a8291e16099df603" FOREIGN KEY ("offering_id") REFERENCES "academic"."course_offering"("offering_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment_course" DROP CONSTRAINT "FK_2aabbb270d8a8291e16099df603"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment_course" DROP CONSTRAINT "FK_7fcd97745acc0589552f06bbdd6"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP CONSTRAINT "FK_9b6575ddf9f453f14003e86ee0b"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP CONSTRAINT "FK_e2ae0efcb804b14080818955574"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP CONSTRAINT "FK_5d4ddd9d8080e95d21884b019a6"`);
        await queryRunner.query(`ALTER TABLE "enrollments"."enrollment" DROP CONSTRAINT "FK_eb0d79d7b8954d3129d032b0bb1"`);
        await queryRunner.query(`ALTER TABLE "academic"."fee_definition" DROP CONSTRAINT "FK_0beb940eef52c46d03ce0fcdd86"`);
        await queryRunner.query(`ALTER TABLE "academic"."fee_definition" DROP CONSTRAINT "FK_2d6c8d949d4c2fd02235c6c7ac3"`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" DROP COLUMN "context_id"`);
        await queryRunner.query(`DROP TABLE "enrollments"."enrollment_course"`);
        await queryRunner.query(`DROP TABLE "enrollments"."enrollment"`);
        await queryRunner.query(`DROP TABLE "academic"."fee_definition"`);
    }

}
