const {Table} = require("typeorm");

module.exports = class createBlocksTable1626455674160 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "blocks",
            columns: [
                {
                    name: "hash",
                    type: "varchar",
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
                    isNullable: true
                },
                {
                    name: "algorithm",
                    type: "varchar",
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
        await queryRunner.dropTable("blocks")
    }
}
        