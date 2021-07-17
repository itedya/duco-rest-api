const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            type: "varchar",
            primary: true
        },
        username: {
            type: "varchar",
            nullable: false,
            unique: true
        },
        password: {
            type: "varchar",
            nullable: false,
            select: false
        },
        email: {
            type: "varchar",
            nullable: false,
            unique: true,
            select: false
        },
        balance: {
            type: "real",
            nullable: false,
            default: 0
        }
    },
})