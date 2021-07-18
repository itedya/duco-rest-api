import Request from "@/interfaces/Request";
import {Response} from "express";
import ResultBody from "@/interfaces/ResultBody";
import AddPaginationToBody from "@/app/middlewares/AddPaginationToBody";
import MinersRepostory from "@/app/repositories/MinersRepostory";

const getCountOfMiners = async () => await MinersRepostory.count();

const getMiners = async (req: Request, res: Response) => {
    try {
        let body: ResultBody;

        const count = await getCountOfMiners();

        try {
            body = {
                result: {},
                ...AddPaginationToBody(count, req)
            }
        } catch (e) {
            return res.status(400).json(e);
        }

        const page = parseInt(<string>req.query.page);
        const per_page = parseInt(<string>req.query.per_page);

        body.result = await MinersRepostory.createQueryBuilder()
            .select('*')
            .offset(page * per_page)
            .limit(per_page)
            .getRawMany();

        return res.json(body);
    } catch (e) {
        console.log(e);
        return res.status(500).json({errors: [{msg: "Internal Server Error"}]});
    }
}

export = {
    getMiners
}
