const { Table } = require("typeorm");

module.exports = class createPoolListTable1626449873782 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "PoolList",
            columns: [
                {
                    name: "identifier",
                    type: "text"
                },
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
                },
                {
                    name: "hidden",
                    type: "text"
                },
                {
                    name: "cpu",
                    type: "real"
                },
                {
                    name: "ram",
                    type: "real"
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        queryRunner.dropTable("PoolList")
    }
}
