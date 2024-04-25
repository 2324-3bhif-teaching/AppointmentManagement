import request from 'supertest';
import express from 'express';
import { adminRouter } from '../routers/adminRouter';

const app = express();
app.use(adminRouter);

describe('GET /', () => {
    it('should return an array', async () => {
        const res = await request(app).get('/');
        expect(Array.isArray(res.body)).toBe(true);
    });
});