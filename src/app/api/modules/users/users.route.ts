import * as Router from 'koa-joi-router';
import UsersController from "@app/api/modules/users/users.controller";
import {BaseRouter} from "@app/core/base-router";
import {Container} from "inversify";

const Joi = Router.Joi;

export default (container: Container) => {
    const router = new BaseRouter(container, UsersController, '/users');

    router.addRoute('get', '/', {
        validate: {
            query: {
                name: Joi.string().optional(),
            },
        },
    }, 'getAll');

    return router.middleware();
}

