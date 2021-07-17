const TransactionsRepository = require('./../repositories/TransactionsRepository');
const addPaginationBody = require('./../middlewares/AddPaginationToBody');

const getTransactionsCount = async () => await TransactionsRepository.count();

const getTransactions = async (req, res) => {
    try {
        let body;

        const count = await getTransactionsCount();

        try {
            body = addPaginationBody(count, req);
        } catch (e) {
            return res.status(400).json(e);
        }

        const page = req.query.page;
        const per_page = req.query.per_page;

        body.result = await TransactionsRepository.createQueryBuilder()
            .offset(page * per_page)
            .limit(per_page)
            .getMany();

        return res.json(body);
    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

module.exports = {
    getTransactions
}