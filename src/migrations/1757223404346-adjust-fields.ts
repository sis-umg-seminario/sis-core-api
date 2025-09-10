import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustFields1757223404346 implements MigrationInterface {
    name = 'AdjustFields1757223404346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "start_time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "end_time" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "end_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "start_time" TIMESTAMP NOT NULL`);
    }

}
