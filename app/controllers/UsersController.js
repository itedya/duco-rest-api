const UserRepository = require('./../repositories/UserRepository');
const addPaginationBody = require('./../middlewares/addPaginationBody');


const getCountOfUsers = async () => await UserRepository.count();

const getUsers = async (req, res) => {
    try {
        let body;

        const count = await getCountOfUsers();

        try {
            body = addPaginationBody(count, req);
        } catch (e) {
            return res.status(400).json(e);
        }

        const page = req.query.page;
        const per_page = req.query.per_page;

        body.result = UserRepository.createQueryBuilder("users")
            .offset(page * per_page)
            .limit(per_page)
            .getMany();

        return res.json(body);
    } catch (e) {
        console.log(e);
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

const getUserById = async (req, res) => {
    try {
        let body = {};
        const id = req.params.id;

        try {
            body.result = await UserRepository.findOneOrFail(id)
        } catch (e) {
            if (e.name === 'EntityNotFound') {
                return res.status(400).json({
                    errors: [{
                        msg: "User with this id doesn't exist!",
                        param: "id",
                        location: "params"
                    }]
                });
            } else {
                throw e
            }
        }

        return res.json(body);
    } catch (e) {
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

module.exports = {
    getUsers,
    getCountOfUsers,
    getUserById
}