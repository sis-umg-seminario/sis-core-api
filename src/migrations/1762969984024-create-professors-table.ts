import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfessorsTable1762969984024 implements MigrationInterface {
    name = 'CreateProfessorsTable1762969984024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payment_transaction" DROP CONSTRAINT "FK_payment_order_transaction"`);
        await queryRunner.query(`CREATE TABLE "auth"."role" ("role_id" SERIAL NOT NULL, "role_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_df46160e6aa79943b83c81e496e" PRIMARY KEY ("role_id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."user_role" ("user_role_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "role_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_77580f3bab637e39a7fdd01a94c" PRIMARY KEY ("user_role_id"))`);
        await queryRunner.query(`CREATE TABLE "professors"."professor" ("professor_id" SERIAL NOT NULL, "user_id" integer, "name" character varying NOT NULL, "professional_title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_cfed83451062b93f81929b406b" UNIQUE ("user_id"), CONSTRAINT "PK_b1c55561185cdbdf3e032599c5c" PRIMARY KEY ("professor_id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."user" ("user_id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "students"."student" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "students"."student" ADD CONSTRAINT "UQ_0cc43638ebcf41dfab27e62dc09" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "auth"."user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "auth"."role"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth"."user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "professors"."professor" ADD CONSTRAINT "FK_cfed83451062b93f81929b406ba" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students"."student" ADD CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_transaction" ADD CONSTRAINT "FK_979af85aa8791f9a68fce332147" FOREIGN KEY ("payment_order_id") REFERENCES "payments"."payment_order"("payment_order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payment_transaction" DROP CONSTRAINT "FK_979af85aa8791f9a68fce332147"`);
        await queryRunner.query(`ALTER TABLE "students"."student" DROP CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "professors"."professor" DROP CONSTRAINT "FK_cfed83451062b93f81929b406ba"`);
        await queryRunner.query(`ALTER TABLE "auth"."user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`ALTER TABLE "auth"."user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "students"."student" DROP CONSTRAINT "UQ_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "students"."student" DROP COLUMN "user_id"`);
        await queryRunner.query(`DROP TABLE "auth"."user"`);
        await queryRunner.query(`DROP TABLE "professors"."professor"`);
        await queryRunner.query(`DROP TABLE "auth"."user_role"`);
        await queryRunner.query(`DROP TABLE "auth"."role"`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_transaction" ADD CONSTRAINT "FK_payment_order_transaction" FOREIGN KEY ("payment_order_id") REFERENCES "payments"."payment_order"("payment_order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
