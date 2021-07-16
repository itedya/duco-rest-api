const { Table } = require("typeorm");

module.exports = class createUsersTable1626449516880 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "Users",
            columns: [
                {
                    name: "username",
                    type: "text"
                },
                {
                    name: "password",
                    type: "text"
                },
                {
                    name: "email",
                    type: "text"
                },
                {
                    name: "balance",
                    type: "real"
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        queryRunner.dropTable("Users")
    }
}
        