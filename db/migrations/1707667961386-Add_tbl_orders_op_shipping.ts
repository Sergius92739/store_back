import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTblOrdersOpShipping1707667961386 implements MigrationInterface {
    name = 'AddTblOrdersOpShipping1707667961386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" ALTER COLUMN "product_unit_price" TYPE numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" ALTER COLUMN "product_unit_price" TYPE numeric(10,0)`);
    }

}
