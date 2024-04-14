// @vitest-environment prisma

import { hash } from "bcryptjs";
import { app } from "../../../app";
import request from "supertest";
import { it, describe, expect, afterAll, beforeAll } from "vitest";

describe("Refresh (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to refresh', async () => {
        const r = await request(app.server)
            .post('/users')
            .send({
                name: "Kauã",
                email: "kaua@gmail.com",
                password: "1233445",
            })

        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: "kaua@gmail.com",
                password: "1233445",
            })

        const cookies = authResponse.get('Set-Cookie')!

        const response = await request(app.server)
            .patch('/token/refresh')
            .set('Cookie', cookies)
            .send({})

        expect(response.statusCode).toEqual(200);

        expect(response.body).toEqual({
            token: expect.any(String)
        });

        expect(response.get("Set-Cookie")).toEqual([
            expect.stringContaining('refreshToken=')
        ]);
    });
})