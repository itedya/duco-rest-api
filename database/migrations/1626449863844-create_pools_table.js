const {Table} = require("typeorm");

module.exports = class createPoolsTable1626449863844 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "pools",
            columns: [
                {
                    name: "name",
                    type: "varchar",
                    max: 255,
                    isNullable: false,
                },
                {
                    name: "ip",
                    type: "text",
                    max: 15,
                    isNullable: false
                },
                {
                    name: "port",
                    type: "int",
                    max: 65535,
                    unsigned: true,
                    isNullable: false
                },
                {
                    name: "status",
                    type: "int",
                    max: 20,
                    unsigned: true,
                    isNullable: false
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        queryRunner.dropTable("pools")
    }
}
        