const typeorm = require('typeorm');
const User = require('./../app/entities/User')

const toAbs = process.cwd();

module.exports = typeorm.createConnections([{
    name: "default",
    type: "sqlite",
    database: `${toAbs}/${process.env.DATABASE_URI_CRYPTO}`,
    entities: [User],
    synchronize: true
}])