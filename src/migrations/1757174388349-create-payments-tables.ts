import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentsTables1757174388349 implements MigrationInterface {
    name = 'CreatePaymentsTables1757174388349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payments"."payment_order" ("payment_order_id" SERIAL NOT NULL, "student_id" integer NOT NULL, "payment_type_id" integer NOT NULL, "total_amount" integer NOT NULL, "due_date" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "auth_code" character varying NOT NULL, CONSTRAINT "PK_6fdf5c378338a30c2236737fe0b" PRIMARY KEY ("payment_order_id"))`);
        await queryRunner.query(`CREATE TABLE "payments"."payment_type" ("payment_type_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_d41f5916ae950a5f7b896fb491c" PRIMARY KEY ("payment_type_id"))`);
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "academic"."course" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "academic"."program" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "academic"."academic_term" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "academic"."term_type" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ADD CONSTRAINT "FK_1d0c26ad84de57bc849f0ca6a90" FOREIGN KEY ("payment_type_id") REFERENCES "payments"."payment_type"("payment_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" DROP CONSTRAINT "FK_1d0c26ad84de57bc849f0ca6a90"`);
        await queryRunner.query(`ALTER TABLE "academic"."term_type" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "academic"."academic_term" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "academic"."program" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "academic"."course" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP TABLE "payments"."payment_type"`);
        await queryRunner.query(`DROP TABLE "payments"."payment_order"`);
    }

}
