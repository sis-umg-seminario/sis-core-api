import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAcademicTables1756969817775 implements MigrationInterface {
    name = 'CreateAcademicTables1756969817775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "academic"."course" ("course_id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_b0e0ab8aa86f713201e050f9d8e" PRIMARY KEY ("course_id"))`);
        await queryRunner.query(`CREATE TABLE "academic"."term_type" ("term_type_id" SERIAL NOT NULL, "name" character varying NOT NULL, "duration_months" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_6e3ed2748dbaa355c20ccdf880e" PRIMARY KEY ("term_type_id"))`);
        await queryRunner.query(`CREATE TABLE "academic"."academic_term" ("term_id" SERIAL NOT NULL, "name" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "term_type_id" integer NOT NULL, CONSTRAINT "PK_d55e8eade486cc97c8bbf146015" PRIMARY KEY ("term_id"))`);
        await queryRunner.query(`CREATE TABLE "academic"."course_offering" ("offering_id" SERIAL NOT NULL, "semester" character varying NOT NULL, "year" integer NOT NULL, "course_id" integer NOT NULL, "term_id" integer NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "professor" character varying NOT NULL, "capacity" integer NOT NULL, "program_id" integer NOT NULL, CONSTRAINT "PK_ea3bdc278ee4eca8f23187c042a" PRIMARY KEY ("offering_id"))`);
        await queryRunner.query(`CREATE TABLE "academic"."program" ("program_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_53f58709c0270f634ebc233c52c" PRIMARY KEY ("program_id"))`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD CONSTRAINT "FK_81e77e9b71f8bc25f2dc694b384" FOREIGN KEY ("course_id") REFERENCES "academic"."course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD CONSTRAINT "FK_ce4b2b4a4c7292fec158ad90ee2" FOREIGN KEY ("program_id") REFERENCES "academic"."program"("program_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD CONSTRAINT "FK_c51b8940dea748469df9bf7b0ea" FOREIGN KEY ("term_id") REFERENCES "academic"."academic_term"("term_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP CONSTRAINT "FK_c51b8940dea748469df9bf7b0ea"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP CONSTRAINT "FK_ce4b2b4a4c7292fec158ad90ee2"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP CONSTRAINT "FK_81e77e9b71f8bc25f2dc694b384"`);
        await queryRunner.query(`DROP TABLE "academic"."program"`);
        await queryRunner.query(`DROP TABLE "academic"."course_offering"`);
        await queryRunner.query(`DROP TABLE "academic"."academic_term"`);
        await queryRunner.query(`DROP TABLE "academic"."term_type"`);
        await queryRunner.query(`DROP TABLE "academic"."course"`);
    }

}
