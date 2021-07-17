const {v4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserRepository = require('./../repositories/UserRepository');
const JwtRepository = require('./../repositories/JwtRepository');

const getUser = (req, res) => {
    try {
        const user = req.user

        delete user.password

        return res.json({
            result: user
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const login = async (req, res) => {
    try {
        let {login, password} = req.body;

        const user = await UserRepository.createQueryBuilder()
            .select(['*'])
            .where({username: login})
            .orWhere({email: login})
            .getRawOne();

        if (!user) {
            return res.status(400).json({errors: [{msg: "User with this credentials doesn't exist!"}]});
        }

        const comparePasswords = bcrypt.compareSync(password, user.password);

        if (!comparePasswords) {
            return res.status(400).json({errors: [{msg: "User with this credentials doesn't exist!"}]});
        }

        delete user.password

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRATION)
        })

        await JwtRepository.save({token: token})

        return res.json({
            result: {
                token,
                user
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const register = async (req, res) => {
    try {
        let {username, password, email} = req.body

        password = bcrypt.hashSync(password, parseInt(process.env.BRYPT_ROUNDS))

        const user = await UserRepository.save({id: v4(), username, password, email});

        return res.json({
            result: {id: user.id, username, balance: user.balance}
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const revokeToken = async (req, res) => {
    try {
        let token = await JwtRepository.findOneOrFail({ where: { token: req.token } })

        token = await JwtRepository.save({
            ...token,
            revoked: true
        })

        delete token.id

        return res.json({
            result: token
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

module.exports = {
    getUser,
    login,
    register,
    revokeToken
}