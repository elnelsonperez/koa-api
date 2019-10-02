import {Body, JsonController, Post, Req, Res} from "routing-controllers";
import {UserRepository} from "@src/database/repository/user.repository";
import {getCustomRepository} from "typeorm";
import {Request, Response} from "koa";
import {User} from "@src/database/entity/user.entity";
import * as bcrypt from 'bcrypt';
import {BAD_REQUEST, OK, UNAUTHORIZED} from "http-status-codes";
import {omit} from 'lodash';
import {IsNotEmpty, IsEmail, IsString} from "class-validator";
import * as jsonwebtoken from  'jsonwebtoken';

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
    private userRepository: UserRepository;

    constructor () {
        this.userRepository = getCustomRepository(UserRepository);
    }

    @Post('/register')
    async register(
        @Req() request: Request,
        @Res() response: Response,
        @Body() body: User) {

        const existingUser = await this.userRepository.findByEmail(body.email);
        if (!existingUser) {
            const user = new User();
            user.email = body.email;
            user.password = await bcrypt.hash(body.password, 5);
            user.name = body.name;
            const created = await this.userRepository.save(user);
            response.body = {
                data: omit(created, 'password'),
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
                    token: jsonwebtoken.sign(
                        {
                            user: omit(user, 'password')
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: '1d' }),
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
