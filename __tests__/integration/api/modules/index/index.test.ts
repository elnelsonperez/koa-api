import * as request from 'supertest';
import App from '@app/app';

describe('Index Controller ', () => {
    it('gets correct index api response', async () => {
        const app = (await App()).callback();
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('KOA');
    });
});
