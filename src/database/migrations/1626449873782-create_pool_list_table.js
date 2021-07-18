const { Table } = require("typeorm");

module.exports = class createPoolListTable1626449873782 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "pool_list",
            columns: [
                {
                    name: "identifier",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "ip",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "port",
                    type: "int",
                    isNullable: false,
                    unsigned: true
                },
                {
                    name: "status",
                    type: "int",
                    isNullable: false,
                    unsigned: true
                },
                {
                    name: "hidden",
                    type: "boolean",
                    isNullable: false,
                    unsigned: true
                },
                {
                    name: "cpu",
                    type: "real",
                    isNullable: true,
                    unsigned: true
                },
                {
                    name: "ram",
                    type: "real",
                    isNullable: true,
                    unsigned: true
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable("pool_list")
    }
}
