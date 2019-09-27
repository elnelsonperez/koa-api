import { Context } from 'koa';
import * as Router from 'koa-joi-router';

const router = Router();

export default function indexRouter() {

    router.route({
        method: 'get',
        path: '/',
        handler: async (ctx: Context) => {
            ctx.body = 'test'
        },
    });

    return router;
};
