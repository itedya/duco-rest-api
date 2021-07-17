const getTransactions = (req, res) => {
    try {

    } catch (e) {
        console.log(e)
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

module.exports = {
    getTransactions
}