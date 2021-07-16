const { getConnection } = require('typeorm');
const User = require('./../entities/User');

module.exports = getConnection().getRepository(User)