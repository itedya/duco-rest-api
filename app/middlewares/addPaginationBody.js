module.exports = (count, req) => {
    const per_page = parseInt(req.query.per_page)
    const page = parseInt(req.query.page)

    const pages = Math.ceil(count / per_page)

    if (page - pages > 0) {
        throw { errors: [{ msg: "Page doesn't exist!", param: "page", location: "query" }] }
    }

    return { per_page, page: page, pages }
}