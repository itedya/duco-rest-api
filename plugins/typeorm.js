const typeorm = require('typeorm');
const User = require('./../app/entities/User')

const toAbs = process.cwd();

module.exports = typeorm.createConnections()