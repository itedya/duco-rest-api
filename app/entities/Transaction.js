const {EntitySchema} = require('typeorm');
const User = require('./User');

module.exports = new EntitySchema({
    name: 'Transaction',
    tableName: 'transactions',
    columns: {
        hash: {
            type: "varchar",
            primary: true
        },
        from_user_id: {
            type: "varchar",
            nullable: true
        },
        to_user_id: {
            type: "varchar",
            nullable: true
        },
        amount: {
            type: "real"
        },
        timestamp: {
            type: "datetime"
        }
    }
})