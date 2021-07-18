const { Table } = require("typeorm");

module.exports = class createMinersTable1626456539041 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "miners",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "thread_id",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "hashrate",
                    type: "real",
                    isNullable: false,
                    default: 0
                },
                {
                    name: "sharetime",
                    type: "real",
                    isNullable: false
                },
                {
                    name: "accepted",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "rejected",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "diff",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "software",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "identifier",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "user_id",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "algorithm",
                    type: "varchar",
                    isNullable: false
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
        await queryRunner.dropTable("miners")
    }
}
        