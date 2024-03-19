import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuctions1710846547008 implements MigrationInterface {
    name = 'CreateAuctions1710846547008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."auction_status_enum" AS ENUM('pending', 'active', 'expired', 'cancelled', 'sold')`);
        await queryRunner.query(`CREATE TABLE "auction" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "starts_at" TIMESTAMP NOT NULL, "ends_at" TIMESTAMP NOT NULL, "status" "public"."auction_status_enum" NOT NULL DEFAULT 'pending', "starting_price" integer NOT NULL, "product_id" character varying NOT NULL, "region_id" character varying NOT NULL, CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bid" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" integer NOT NULL, "customer_id" character varying NOT NULL, "auctionId" character varying, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_2e00b0f268f93abcf693bb682c6" FOREIGN KEY ("auctionId") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_2e00b0f268f93abcf693bb682c6"`);
        await queryRunner.query(`DROP TABLE "bid"`);
        await queryRunner.query(`DROP TABLE "auction"`);
        await queryRunner.query(`DROP TYPE "public"."auction_status_enum"`);
    }

}
