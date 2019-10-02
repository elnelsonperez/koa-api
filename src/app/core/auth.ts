
import * as jwt from 'jsonwebtoken';
import {Action} from "routing-controllers";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "@src/database/repository/user.repository";
import {User} from "@src/database/entity/user.entity";

import * as jsonwebtoken from  'jsonwebtoken';
import {omit} from  'lodash';

// TODO Roles unused for now
export async function checkAuth(action: Action, roles: string[], secret: string) {

    const token = resolveAuthorizationHeader(action.request);

    if (!token) {
        return false;
    }

    try {
        await jwt.verify(token, secret);
    } catch(err) {
        return false;
    }

    return true;
}

export async function currentUser(action: Action) {

    const token = resolveAuthorizationHeader(action.request);

    if (!token) {
        return null;
    }

    try {
        const data = await jwt.verify(token, process.env.JWT_SECRET) as {user: User};
        const userRepo = getCustomRepository(UserRepository);
        return await userRepo.findOne({id: data.user.id})
    } catch(err) {
        return null;
    }

}

export function resolveAuthorizationHeader(ctx: any) {
    if (!ctx.header || !ctx.header.authorization) {
        return null;
    }

    const parts = ctx.header.authorization.split(' ');

    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        }
    }

    return null;
}

export function generateToken(user: User, expires: string = '1d', secret: string = 'default') {
    return jsonwebtoken.sign(
        {
            user: omit(user, 'password')
        },
        secret,
        { expiresIn: expires })
}
