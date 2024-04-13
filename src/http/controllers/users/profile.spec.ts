// @vitest-environment prisma

import { app } from "../../../app";
import request from "supertest";
import { it, describe, expect, afterAll, beforeAll } from "vitest";

// vamos uitlizar a biblioteca supertest para os testes end-two-end!!!

describe("Profile (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to register, authenticate and get user profile', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: "Kauã",
                email: "kaua@gmail.com",
                password: "1233445",
            })
        const auth = await request(app.server)
            .post('/sessions')
            .send({
                email: "kaua@gmail.com",
                password: "1233445",
            })

        const response = await request(app.server)
            .get('/me')
            .auth(auth.body.token, { type: 'bearer' })

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
            expect.objectContaining({ email: "kaua@gmail.com" })
        );
    });
})