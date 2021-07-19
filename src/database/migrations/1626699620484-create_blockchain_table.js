const { Table } = require("typeorm");

module.exports = class createBlockchainTable1626699620484 {

    async up(queryRunner) {
        queryRunner.createTable(new Table({
            name: "blockchain",
            columns: [
                {
                    name: "block",
                    type: "real"
                },
                {
                    name: "lastBlockHash",
                    type: "varchar"
                }
            ]
        }), true)
    }

    async down(queryRunner) {
    }
}
        