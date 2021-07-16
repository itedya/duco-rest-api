const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        username: {
            type: "varchar",
            primary: true
        },
        password: {
            type: "varchar",
            select: false
        },
        email: {
            type: "varchar",
            select: false
        },
        balance: {
            type: "real"
        }
    }
})