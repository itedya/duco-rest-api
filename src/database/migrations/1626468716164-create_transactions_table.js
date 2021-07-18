const { Table } = require("typeorm");

module.exports = class createTransactionsTable1626468716164 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "transactions",
            columns: [
                {
                    name: "hash",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "from_user_id",
                    type: "varchar",
                    // nullable to have backwards compatibility
                    isNullable: true,
                },
                {
                    name: "to_user_id",
                    type: "varchar",
                    max: 36,
                    // nullable to have backwards compatibility
                    isNullable: true,
                },
                {
                    name: "amount",
                    type: "real",
                    isNullable: false
                },
                {
                    name: "timestamp",
                    type: "datetime",
                    isNullable: false
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['from_user_id'],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users"
                },
                {
                    columnNames: ['to_user_id'],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users"
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable("transactions")
    }
}
        