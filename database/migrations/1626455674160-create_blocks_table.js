const { Table } = require("typeorm");

module.exports = class createBlocksTable1626455674160 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "blocks",
            columns: [
                {
                    name: "hash",
                    type: "varchar",
                    max: 40,
                    isNullable: false
                },
                {
                    name: "timestamp",
                    type: "datetime",
                    isNullable: false
                },
                {
                    name: "finder",
                    type: "varchar",
                    max: 320,
                    isNullable: false
                },
                {
                    name: "amount",
                    type: "real",
                    isNullable: false,
                    unsigned: true
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        queryRunner.dropTable("blocks")
    }
}
        