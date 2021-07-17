const { getConnection } = require('typeorm');
const Jwt = require('./../entities/JwtToken');

module.exports = getConnection().getRepository(Jwt);