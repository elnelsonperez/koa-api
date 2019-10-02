
import * as jwt from 'jsonwebtoken';
import {Action} from "routing-controllers";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "@src/database/repository/user.repository";
import {User} from "@src/database/entity/user.entity";

export async function checkAuth(action: Action, roles: string[]) {

    const token = resolveAuthorizationHeader(action.request);

    if (!token) {
        return false;
    }

    try {
        await jwt.verify(token, process.env.JWT_SECRET);
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


function resolveAuthorizationHeader(ctx: any) {
    if (!ctx.header || !ctx.header.authorization) {
        return;
    }

    const parts = ctx.header.authorization.split(' ');

    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        }
    }
}
