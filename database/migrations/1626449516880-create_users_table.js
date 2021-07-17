const { Table } = require("typeorm");

module.exports = class createUsersTable1626449516880 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    max: 36,
                    isPrimary: true,
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "username",
                    type: "varchar",
                    max: 255,
                    isNullable: false,
                    isUnique: true
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
                    isNullable: false,
                    isUnique: true
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