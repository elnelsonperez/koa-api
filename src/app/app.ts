import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import { areWeTestingWithJest } from '../helpers';

import {configureContainer} from "@app/core/container";
import {scopePerRequest} from "awilix-koa";

import IndexRouter from '@app/api/modules/index/index.controller';
import UsersRouter from '@app/api/modules/users/users.route';

export default async function App() {
    const app:Koa = new Koa();

    const container = await configureContainer();
    app.context.container = container;

    app.use(scopePerRequest(container));

    if (!areWeTestingWithJest()) {
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

// Routes
    app.use(IndexRouter().middleware());
    app.use(UsersRouter(container).middleware());

    return app;
}

