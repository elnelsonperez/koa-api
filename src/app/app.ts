import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import { isTesting } from '../helpers';
import errorHandler from '@app/core/error-handler';

import {useContainer, useKoaServer} from "routing-controllers";

import {checkAuth, currentUser} from "@app/core/auth";
import {IndexController} from "@app/api/modules/index/index.controller";
import {UsersController} from "@app/api/modules/users/users.controller";
import {AuthController} from "@app/api/modules/auth/auth.controller";

import databaseConnection from "@src/database/database.connection";
import {Container} from "typedi";

export default async function App() {
    const app:Koa = new Koa();

    if (!isTesting()) {
        // Logger
        app.use(logger());
    }

    // Error handling middleware.
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

    app.use(bodyParser());

    //TODO Revise this
    await databaseConnection;

    useContainer(Container);

    useKoaServer(app, {
        controllers: [
            IndexController,
            AuthController,
            UsersController,
            ],
        authorizationChecker: async (action, roles) => checkAuth(action, roles, process.env.JWT_SECRET),
        currentUserChecker: currentUser,
        classTransformer: true,
        validation: true,
        defaultErrorHandler: false,
    });

    // Application error logging.
    app.on('error', console.error);
    return app;
}

