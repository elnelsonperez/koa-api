import * as Router from 'koa-joi-router';
import { DbContext } from '@app/app.type';
import { User } from '@src/database/entity/user.entity';
import {UserRepository} from "@src/database/repositories/user.repository";
const Joi = Router.Joi;

const router = Router();

router.prefix('/users');

router.get('/', {
    validate: {
        query: {
            name: Joi.string().optional()
        }
    }
}, async (ctx: DbContext) => {
    const userRepository: UserRepository = ctx.db.getCustomRepository(UserRepository);
    let result = [];

    if (ctx.query.name) {
        result = await userRepository.findByNameAndCount(ctx.query.name);
    } else {
        result = await userRepository.findAndCount();
    }

    ctx.body = {
        users: result[0],
        count: result[1],
    };
});


router.get('/:id', async (ctx: DbContext) => {
    const userRepository = ctx.db.getRepository(User);
    const user = await userRepository.find({id: ctx.params.id});
    ctx.body = user;
});

export default router;
