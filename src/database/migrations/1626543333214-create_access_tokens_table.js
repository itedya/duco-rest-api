const { Table } = require("typeorm");

module.exports = class createAccessTokensTable1626543333214 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "access_tokens",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid"
                },
                {
                    name: "token",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "revoked",
                    type: "boolean",
                    default: false
                },
                {
                    name: "user_id",
                    type: "varchar"
                },
                {
                    name: "created_at",
                    type: "datetime"
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users"
                },
            ]
        }), true);
    }

    async down(queryRunner) {
        await queryRunner.dropTable("access_tokens")
    }
}
        