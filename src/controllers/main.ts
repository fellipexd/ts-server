import { Response, Request } from "express";
import Controller from "../decorators/controller";
import { Get } from "../decorators/routes";

@Controller('/main')
export default class Main {

    @Get('/teste')
    async teste(req: Request, res: Response) {
        console.log('teste')
        res.send('ok');
    }
}