import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddApiKey1720230151480 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "user" ("id" varchar PRIMARY KEY NOT NULL, 
                "name" varchar NOT NULL, 
                "username" varchar NOT NULL, 
                "email" varchar NOT NULL, 
                "password" varchar NOT NULL, 
                "role" varchar NOT NULL, 
                "isActive" varchar NOT NULL, 
                "expiredAt" varchar NOT NULL, 
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')));`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user";`)
    }
}
