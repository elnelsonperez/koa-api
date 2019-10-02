import * as bcrypt from 'bcrypt';
import {Body, JsonController, Post, Req, Res} from "routing-controllers";
import {UserRepository} from "@src/database/repository/user.repository";
import {Request, Response} from "koa";
import {User} from "@src/database/entity/user.entity";
import {BAD_REQUEST, OK, UNAUTHORIZED} from "http-status-codes";
import {IsNotEmpty, IsEmail, IsString} from "class-validator";
import {generateToken} from "@app/core/auth";
import UserService from "@app/services/user.service";
import {classToPlain} from "class-transformer";

class LoginBody {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
}

@JsonController('/api/auth')
export class AuthController {
    constructor (
        private userService: UserService,
        private userRepository: UserRepository
    ) {}

    @Post('/register')
    async register(
        @Req() request: Request,
        @Res() response: Response,
        @Body() body: User) {

        const existingUser = await this.userRepository.findByEmail(body.email);
        if (!existingUser) {
            const user =  await this.userService.createUser(body.name, body.email, body.password);
            response.body = {
                data: classToPlain(user),
                status: OK
            };

        } else {
            response.status = BAD_REQUEST;
            response.body = {
                message: 'User with same email already exists',
                status: BAD_REQUEST,
            } ;
        }

        return response;
    }

    @Post('/login')
    async login (
        @Req() request: Request,
        @Res() response: Response,
        @Body() body: LoginBody) {
        const user = await this.userRepository.findByEmail(body.email);

        if (!user) {
            response.status = UNAUTHORIZED;
            response.body = {
                message: 'Invalid Credentials',
                status: UNAUTHORIZED,
            };
            return response;
        }

        if (await bcrypt.compare(body.password, user.password)) {
            response.body = {
                status: OK,
                data: {
                    token: generateToken(user),
                },
                message: 'Successfully authenticated',
            };

        } else {
            response.status = UNAUTHORIZED;
            response.body = {
                message: 'Invalid Credentials',
                status: UNAUTHORIZED,
            };
        }

        return response;

    }

}
