import { Context } from 'koa';
import * as Router from 'koa-router';

const routerOpts: Router.IRouterOptions = {
    prefix: '/',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Context) => {
    ctx.body = 'Koa API';
});

export default router;
