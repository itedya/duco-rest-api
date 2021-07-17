const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'JwtToken',
    tableName: 'access_tokens',
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment"
        },
        token: {
            type: "varchar",
            unique: true
        },
        revoked: {
            type: "boolean",
            default: false
        },
        created_at: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
})