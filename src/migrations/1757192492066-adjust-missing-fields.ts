import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustMissingFields1757192492066 implements MigrationInterface {
    name = 'AdjustMissingFields1757192492066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "section" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "section"`);
    }

}
