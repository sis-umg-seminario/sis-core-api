import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialExample21756868303801 implements MigrationInterface {
    name = 'InitialExample21756868303801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "example"."table1" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_b249cc64cf63b8a22557cdc8537" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "example"."table2" ("id" SERIAL NOT NULL, "moredata" character varying NOT NULL, "table1Id" integer, CONSTRAINT "PK_fc230a7c579b8bb34dbfab9ef43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "example"."table2" ADD CONSTRAINT "FK_172e5f4055fab3f0fc0e8a12efb" FOREIGN KEY ("table1Id") REFERENCES "example"."table1"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "example"."table2" DROP CONSTRAINT "FK_172e5f4055fab3f0fc0e8a12efb"`);
        await queryRunner.query(`DROP TABLE "example"."table2"`);
        await queryRunner.query(`DROP TABLE "example"."table1"`);
    }

}
