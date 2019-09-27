import {UserRepository} from '@src/database/repository/user.repository';
import {Context} from "koa";

class UsersController {
    private userRepository: UserRepository;
    constructor ({userRepository}: {userRepository: UserRepository}) {
        this.userRepository = userRepository;
    }

    async getAll(ctx: Context) {
        let result;

        if (ctx.query.name) {
            result = await this.userRepository.findByNameAndCount(ctx.query.name);
        } else {
            result = await this.userRepository.findAndCount();
        }

        const [data, count] = result;
        ctx.body = {
            count,
            users: data,
        };

    }
}

export default UsersController;
