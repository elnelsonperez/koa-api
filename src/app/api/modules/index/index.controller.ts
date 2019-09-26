import { Context } from 'koa';
import * as Router from 'koa-joi-router';

const router = Router();

router.get('/', async (ctx: Context) => {
    ctx.body = 'Koa API!';
});

export default router;
