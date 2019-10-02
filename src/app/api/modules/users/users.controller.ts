import {UserRepository} from '@src/database/repository/user.repository';
import {Response} from "koa";

import {getCustomRepository} from "typeorm";
import {Authorized, CurrentUser, Get, JsonController, QueryParam, Res} from "routing-controllers";
import {User} from "@src/database/entity/user.entity";

@JsonController('/api/users')
export default class UsersController {

    private userRepository: UserRepository;

    constructor () {
        this.userRepository = getCustomRepository(UserRepository);
    }

    @Authorized()
    @Get('/')
    async getAll(
        @Res() response: Response,
        @QueryParam('name') name: string,
        @CurrentUser() user?: User,
    ) {

        let result;
        if (name) {
            result = await this.userRepository.findByNameAndCount(name);
        } else {
            result = await this.userRepository.findAndCount();
        }

        const [data, count] = result;
        response.body = {
            count,
            data,
            user
        };

        return response;
    }
}
