import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStudentTables1757176078022 implements MigrationInterface {
    name = 'CreateStudentTables1757176078022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students"."student" ("student_id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "email" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be3689991c2cc4b6f4cf39087fa" PRIMARY KEY ("student_id"))`);
        await queryRunner.query(`CREATE TABLE "students"."student_history" ("history_id" SERIAL NOT NULL, "student_id" integer NOT NULL, "course_id" integer NOT NULL, "action" character varying NOT NULL, "status" character varying NOT NULL, "credits_earned" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_539462dfabc89ae626cc4ce2d50" PRIMARY KEY ("history_id"))`);
        await queryRunner.query(`CREATE TABLE "students"."student_program" ("student_program_id" SERIAL NOT NULL, "student_id" integer NOT NULL, "program_id" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_69b0a4d343d75a15d7490b4bb68" PRIMARY KEY ("student_program_id"))`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ADD CONSTRAINT "FK_dbd5527d5d4920df6e1feab1d34" FOREIGN KEY ("student_id") REFERENCES "students"."student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students"."student_history" ADD CONSTRAINT "FK_fe349c71232e58371d7727df444" FOREIGN KEY ("student_id") REFERENCES "students"."student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students"."student_history" ADD CONSTRAINT "FK_45ef17570ca0e431479433be31c" FOREIGN KEY ("course_id") REFERENCES "academic"."course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students"."student_program" ADD CONSTRAINT "FK_1e634c70d884ca54ca5235cb10c" FOREIGN KEY ("student_id") REFERENCES "students"."student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students"."student_program" ADD CONSTRAINT "FK_2e04f94d5bb691d481a5f86318e" FOREIGN KEY ("program_id") REFERENCES "academic"."program"("program_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students"."student_program" DROP CONSTRAINT "FK_2e04f94d5bb691d481a5f86318e"`);
        await queryRunner.query(`ALTER TABLE "students"."student_program" DROP CONSTRAINT "FK_1e634c70d884ca54ca5235cb10c"`);
        await queryRunner.query(`ALTER TABLE "students"."student_history" DROP CONSTRAINT "FK_45ef17570ca0e431479433be31c"`);
        await queryRunner.query(`ALTER TABLE "students"."student_history" DROP CONSTRAINT "FK_fe349c71232e58371d7727df444"`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" DROP CONSTRAINT "FK_dbd5527d5d4920df6e1feab1d34"`);
        await queryRunner.query(`DROP TABLE "students"."student_program"`);
        await queryRunner.query(`DROP TABLE "students"."student_history"`);
        await queryRunner.query(`DROP TABLE "students"."student"`);
    }

}
