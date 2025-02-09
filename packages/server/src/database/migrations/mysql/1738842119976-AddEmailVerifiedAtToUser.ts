import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEmailVerifiedAtToUser1738842119976 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const columnExists = await queryRunner.hasColumn('user', 'emailVerifiedAt')
        if (!columnExists) {
            await queryRunner.query(`ALTER TABLE \`user\` ADD COLUMN \`emailVerifiedAt\` DATETIME AFTER \`hearAboutUs\`;`)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`emailVerifiedAt\`;`)
    }
}
