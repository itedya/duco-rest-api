const { Table } = require("typeorm");

module.exports = class createAccessTokensTable1626543333214 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "access_tokens",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    generationStrategy: "increment"
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
                    name: "created_at",
                    type: "datetime"
                }
            ]
        }), true);
    }

    async down(queryRunner) {
        queryRunner.dropTable("access_tokens")
    }
}
        