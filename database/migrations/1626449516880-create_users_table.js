const { Table } = require("typeorm");

module.exports = class createUsersTable1626449516880 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "username",
                    type: "varchar",
                    max: 255,
                    isNullable: false,
                    isPrimary: true
                },
                {
                    name: "password",
                    type: "varchar",
                    max: 255,
                    isNullable: false
                },
                {
                    name: "email",
                    type: "varchar",
                    max: 320,
                    isNullable: false
                },
                {
                    name: "balance",
                    type: "real",
                    isNullable: false,
                    default: 0
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        queryRunner.dropTable("users")
    }
}
        