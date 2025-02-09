import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSomeColumnToUsers1738830671265 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        let columnExists = await queryRunner.hasColumn('user', 'companyName')
        if (!columnExists) {
            await queryRunner.query(`ALTER TABLE \`user\` ADD COLUMN \`companyName\` VARCHAR(255) AFTER \`isActive\`;`)
        }

        columnExists = await queryRunner.hasColumn('user', 'roleType')
        if (!columnExists) {
            await queryRunner.query(`ALTER TABLE \`user\` ADD COLUMN \`roleType\` VARCHAR(255) AFTER \`companyName\`;`)
        }

        columnExists = await queryRunner.hasColumn('user', 'hearAboutUs')
        if (!columnExists) {
            await queryRunner.query(`ALTER TABLE \`user\` ADD COLUMN \`hearAboutUs\` VARCHAR(255) AFTER \`roleType\`;`)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`companyName\`;`)
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`roleType\`;`)
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`hearAboutUs\`;`)
    }
}
