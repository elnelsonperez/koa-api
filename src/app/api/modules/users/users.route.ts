import * as Router from 'koa-joi-router';
// import {DbContext} from '@app/app.type';
// import {User} from '@src/database/entity/user.entity';
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

// router.get('/:id', async (ctx: DbContext) => {
//     const userRepository = ctx.db.getRepository(User);
//     const user = await userRepository.find({id: ctx.params.id});
//     ctx.body = user;
// });
    return router;
}

