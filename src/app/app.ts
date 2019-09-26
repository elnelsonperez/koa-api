import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import { areWeTestingWithJest } from '../helpers';

// Controllers
import IndexController from '@app/api/modules/index/index.controller';
import UsersController from '@app/api/modules/users/users.controller';

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

app.use(UsersController.routes());
app.use(UsersController.allowedMethods());

export default app;
