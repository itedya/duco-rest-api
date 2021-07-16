const { Table } = require("typeorm");

module.exports = class createPoolsTable1626449863844 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "Pools",
            columns: [
                {
                    name: "name",
                    type: "text"
                },
                {
                    name: "ip",
                    type: "text"
                },
                {
                    name: "port",
                    type: "text"
                },
                {
                    name: "Status",
                    type: "text"
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        queryRunner.dropTable("Pools")
    }
}
        