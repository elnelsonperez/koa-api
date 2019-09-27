import * as Router from 'koa-joi-router';
import UsersController from '@app/api/modules/users/users.controller';
import {AwilixContainer} from "awilix";
const Joi = Router.Joi;
const router = Router();

export default function userRouter(container: AwilixContainer) {
    router.prefix('/users');

    const controller = container.resolve<UsersController>('usersController');

    router.route({
        method: 'get',
        path: '/',
        validate: {
            query: {
                name: Joi.string().optional(),
            },
        },
        handler: controller.getAll.bind(controller),
    });

    return router;
}

