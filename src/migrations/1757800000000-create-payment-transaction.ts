import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentTransaction1757800000000 implements MigrationInterface {
    name = 'CreatePaymentTransaction1757800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payments"."payment_transaction" ("payment_transaction_id" SERIAL NOT NULL, "payment_order_id" integer NOT NULL, "amount" integer NOT NULL, "payment_date" TIMESTAMP NOT NULL, "method" character varying NOT NULL, "status" character varying NOT NULL, "auth_code" character varying, CONSTRAINT "PK_5b6b7f9d8c3e1a2b4d6f7c8e9a0" PRIMARY KEY ("payment_transaction_id"))`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_transaction" ADD CONSTRAINT "FK_payment_order_transaction" FOREIGN KEY ("payment_order_id") REFERENCES "payments"."payment_order"("payment_order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payment_transaction" DROP CONSTRAINT "FK_payment_order_transaction"`);
        await queryRunner.query(`DROP TABLE "payments"."payment_transaction"`);
    }

}
