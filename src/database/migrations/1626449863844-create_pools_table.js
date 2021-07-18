const {Table} = require("typeorm");

module.exports = class createPoolsTable1626449863844 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "pools",
            columns: [
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "ip",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "port",
                    type: "int",
                    unsigned: true,
                    isNullable: false
                },
                {
                    name: "status",
                    type: "int",
                    unsigned: true,
                    isNullable: false
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable("pools")
    }
}
        