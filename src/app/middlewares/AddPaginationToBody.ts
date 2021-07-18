import Request from "@/interfaces/Request";

export default (count: number, req: Request) => {
    const per_page: number = parseInt(<string>req.query.per_page)
    const page: number = parseInt(<string>req.query.page)

    const pages = (Math.ceil(count / per_page) - 1 < 0) ? 0 : Math.ceil(count / per_page) - 1

    if (page - pages > 0) {
        throw { errors: [{ msg: "Page doesn't exist!", param: "page", location: "query" }] }
    }

    return { per_page, page: page, pages }
}