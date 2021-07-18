const {Table} = require("typeorm");

module.exports = class createUsersTable1626449516880 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "username",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "email",
                    type: "varchar",
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
        await queryRunner.dropTable("users")
    }
}