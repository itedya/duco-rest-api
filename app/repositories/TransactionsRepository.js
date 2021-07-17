const { getConnection } = require('typeorm');
const Transaction = require('./../entities/Transaction');

module.exports = getConnection().getRepository(Transaction);