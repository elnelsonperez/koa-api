import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import { isTesting } from '../helpers';
import errorHandler from '@app/core/error-handler';

import createContainer from "@app/core/di-container";
import {Action, useKoaServer} from "routing-controllers";

import {checkAuth, currentUser} from "@app/core/auth";
import IndexController from "@app/api/modules/index/index.controller";
import UsersController from "@app/api/modules/users/users.controller";
import {AuthController} from "@app/api/modules/auth/auth.controller";

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
            errorHandler(error, ctx);
            ctx.app.emit('error', error, ctx);
        }
    });

    app.use(async(ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
    });


// Application error logging.
    app.on('error', console.error);

    app.use(bodyParser());

    const DIContainer = await createContainer();
    app.context.container = DIContainer;


    useKoaServer(app, {
        controllers: [IndexController, UsersController, AuthController],
        authorizationChecker: checkAuth,
        currentUserChecker: currentUser,
        classTransformer: true,
        defaultErrorHandler: false,
        validation: true
    });

    return app;
}

