import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';

// Controllers
import IndexController from './api/modules/index/index.controller';
import { areWeTestingWithJest } from '../helpers';

const app:Koa = new Koa();

if (!areWeTestingWithJest()) {
    // Logger
    app.use(logger());

}

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch (error) {
        ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
    }
});

// Application error logging.
app.on('error', console.error);

app.use(bodyParser());

// Route Middleware
app.use(IndexController.routes());
app.use(IndexController.allowedMethods());

export default app;
