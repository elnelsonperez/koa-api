import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import { isTesting } from '../helpers';

import IndexRouter from '@app/api/modules/index/index.route';
import UsersRouter from '@app/api/modules/users/users.route';

import createContainer from "@app/core/di-container";

export default async function App() {
    const app:Koa = new Koa();

    if (!isTesting()) {
        // Logger
        app.use(logger());
    }

// Generic error handling middleware.
    app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
        try {
            await next();
        } catch (error) {
            if (error.isJoi) {
                ctx.body = {
                    message: 'Validation Error',
                    details: error.details,
                };
            } else {
                ctx.body = {error};
            }

            ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            error.status = ctx.status;

            ctx.app.emit('error', error, ctx);
        }
    });

// Application error logging.
    app.on('error', console.error);

    app.use(bodyParser());

    const DIContainer = await createContainer();
    app.context.container = DIContainer;

// Routes
    app.use(IndexRouter().middleware());
    app.use(UsersRouter(DIContainer));
    return app;
}

