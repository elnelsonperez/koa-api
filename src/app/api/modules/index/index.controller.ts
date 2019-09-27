import { Context } from 'koa';
import * as Router from 'koa-joi-router';

const router = Router();

export default function indexRouter() {
    router.get('/', async (ctx: Context) => {
        ctx.body = 'Koa API!';
    });

    return router;
};
