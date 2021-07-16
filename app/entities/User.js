const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'Users',
    columns: {
        username: {
            type: "text",
            primary: true
        },
        password: {
            type: "text",
            select: false
        },
        email: {
            type: "text",
            select: false
        },
        balance: {
            type: "real"
        }
    }
})