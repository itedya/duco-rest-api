const {Table} = require("typeorm");

module.exports = class createBlocksTable1626455674160 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "blocks",
            columns: [
                {
                    name: "hash",
                    type: "varchar",
                    max: 40,
                    isPrimary: true
                },
                {
                    name: "timestamp",
                    type: "datetime",
                    isNullable: false
                },
                {
                    name: "user_id",
                    type: "varchar",
                    max: 36,
                    isNullable: true
                },
                {
                    name: "algorithm",
                    type: "varchar",
                    max: 120,
                    isNullable: false
                },
                {
                    name: "amount",
                    type: "real",
                    isNullable: false,
                    unsigned: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["user_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users"
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        queryRunner.dropTable("blocks")
    }
}
        