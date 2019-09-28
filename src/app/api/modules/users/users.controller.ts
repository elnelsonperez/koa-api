import {UserRepository} from '@src/database/repository/user.repository';
import {Context} from "koa";
import {provide} from "inversify-binding-decorators";
import {inject} from "inversify";
import {Connection} from "typeorm";
import {Controller} from "@app/core/controller";

@provide(UsersController)
class UsersController extends Controller {

    private userRepository: UserRepository;

    constructor (
        @inject(Connection) con: Connection
    ) {
        super();
        this.userRepository = con.getCustomRepository(UserRepository);
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
