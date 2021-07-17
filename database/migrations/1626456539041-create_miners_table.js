const { Table } = require("typeorm");

module.exports = class createMinersTable1626456539041 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "miners",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    max: 36,
                    isPrimary: true
                },
                {
                    name: "thread_id",
                    type: "varchar",
                    max: 60,
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
                    max: 255,
                    isNullable: false
                },
                {
                    name: "identifier",
                    type: "varchar",
                    max: 255,
                    isNullable: false
                },
                {
                    name: "user_id",
                    type: "varchar",
                    max: 36,
                    isNullable: false
                },
                {
                    name: "algorithm",
                    type: "varchar",
                    max: 255,
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
        queryRunner.dropTable("miners")
    }
}
        