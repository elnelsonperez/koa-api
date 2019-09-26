import * as request from 'supertest';
import app from '@app/app';

describe('Index GET / ', () => {
    it('gets correct index api response', async () => {
        const response = await request(app.callback()).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    });
});
