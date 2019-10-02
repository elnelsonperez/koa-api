import * as request from 'supertest';
import App from '@app/app';
import {Container} from "typedi";
import UserService from "@app/services/user.service";

describe('Auth Controller ', () => {

    it('registers new users', async () => {
        const app = (await App()).callback();

        const response = await request(app)
            .post('/api/auth/register')
            .send({name: 'Test', email: 'me@nelson.net', password: '123456'})
            .expect(200);

        expect(response.body).toMatchObject({
            data: {
                name: 'Test',
                email: 'me@nelson.net',
            }
        })
    });

    it('can login', async () => {
        const app = (await App()).callback();
        const service = Container.get(UserService);
        const user = await service.createUser('Test', 'test@test.net', '123456');

        const response = await request(app)
            .post('/api/auth/login')
            .send({email: user.email, password: '123456'})
            .expect(200);

        expect(Object.keys(response.body.data)).toContain('token')
    })

});
