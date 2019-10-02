import {Controller, Get, Req, Res} from "routing-controllers";
import {Request, Response} from "koa";

@Controller()
export default class IndexController {

    @Get("/")
    getAll(@Req() request: Request, @Res() response: Response) {
        return response.body = 'KOA';
    }

}
