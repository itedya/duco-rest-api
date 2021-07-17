const authenticateJWT = require('jsonwebtoken');

const JwtRepository = require('./../repositories/JwtRepository');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({errors: [{msg: "Unauthenticated", location: "headers"}]})
    }

    await authenticateJWT.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({errors: [{msg: "Unauthenticated", location: "headers"}]})
        }

        let tokenFromDB = await JwtRepository.createQueryBuilder()
            .where({token})
            .getOneOrFail();

        if (tokenFromDB.revoked === true) {
            return res.status(401).json({errors: [{msg: "Unauthenticated", location: "headers"}]})
        }

        req.token = token
        req.user = user

        next()
    })
}