import * as request from 'supertest';
import App from '@app/app';
import {getManager} from "typeorm";
import {User} from "@src/database/entity/user.entity";
import * as bcrypt from 'bcrypt'

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
        const user = new User();
        user.name = 'Test';
        user.email = 'me@nelsonperez.net';
        user.password = await bcrypt.hash('123456', 5);
        await getManager().save<User>(user);

        const app = (await App()).callback();

        const response = await request(app)
            .post('/api/auth/login')
            .send({email: 'me@nelson.net', password: '123456'})
            .expect(200);

        expect(Object.keys(response.body.data)).toContain('token')
    })

});
