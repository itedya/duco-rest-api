const userRepository = require('./../repositories/UserRepository')

const getUsers = (page, per_page) => {
    return userRepository.createQueryBuilder("users")
        .offset(page * per_page)
        .limit(per_page)
        .getMany()
}

const getCountOfUsers = () => {
    return userRepository.count()
}

const getUserByUsername = (username) => {
    return userRepository.createQueryBuilder("users")
        .where({ username })
        .getOneOrFail()
}

module.exports = {
    getUsers,
    getCountOfUsers,
    getUserByUsername
}