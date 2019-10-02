import {checkAuth, generateToken, resolveAuthorizationHeader} from "@app/core/auth";
import {User} from "@src/database/entity/user.entity";
import {Action} from "routing-controllers";

describe('resolveAuthorizationHeader', () => {
    it('gets token from request-like object', () => {
        const requestLikeObject = {
            header: {
                authorization: 'Bearer Token'
            }
        };
        const token = resolveAuthorizationHeader(requestLikeObject);
        expect(token).toBe('Token');
    });

    it('returns null with invalid request-like object', () => {
        const objWithHeaders = {};
        const token = resolveAuthorizationHeader(objWithHeaders);
        expect(token).toBe(null);
    });

});

describe('checkAuth', () => {
    const secret = 'test';
    const user = new User();
    user.id = 1;

    it('checks if user is authenticated', async () => {
        const token = generateToken(user, '1d', secret);

        const action: Action = {
            request: {
                header: {
                    authorization: `Bearer ${token}`
                }
            },
            response: undefined
        };

        const result = await checkAuth(action, [], secret);

        expect(result).toBe(true);
    });

    it('returns false with random token', async () => {
        const token = 'Random';
        const action: Action = {
            request: {
                header: {
                    authorization: `Bearer ${token}`
                }
            },
            response: undefined
        };

        const result = await checkAuth(action, [], secret);

        expect(result).toBe(false);
    });


});

