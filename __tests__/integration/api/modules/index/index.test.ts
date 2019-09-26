import * as request from 'supertest';
import server from '@src/server';

afterAll(() => {
    server.close();
});

describe('Index GET / ', () => {
    it('gets correct index api response', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toMatchSnapshot();
    });
});
