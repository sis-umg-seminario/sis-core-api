import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentOrderUpdates1757703795227 implements MigrationInterface {
    name = 'PaymentOrderUpdates1757703795227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" DROP COLUMN "context_id"`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ADD "context_id" integer`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ALTER COLUMN "auth_code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ALTER COLUMN "auth_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" DROP COLUMN "context_id"`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" ADD "context_id" character varying`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_order" DROP COLUMN "description"`);
    }

}
