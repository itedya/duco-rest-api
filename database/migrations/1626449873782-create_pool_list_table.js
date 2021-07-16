const { Table } = require("typeorm");

module.exports = class createPoolListTable1626449873782 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "pool_list",
            columns: [
                {
                    name: "identifier",
                    type: "varchar",
                    max: 255,
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                    max: 255,
                    isNullable: false
                },
                {
                    name: "ip",
                    type: "varchar",
                    max: 15,
                    isNullable: false
                },
                {
                    name: "port",
                    type: "int",
                    max: 65535,
                    isNullable: false,
                    unsigned: true
                },
                {
                    name: "status",
                    type: "int",
                    max: 20,
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
        queryRunner.dropTable("pool_list")
    }
}
