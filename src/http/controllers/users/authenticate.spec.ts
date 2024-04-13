// @vitest-environment prisma

import { app } from "../../../app";
import request from "supertest";
import { it, describe, expect, afterAll, beforeAll } from "vitest";

// vamos uitlizar a biblioteca supertest para os testes end-two-end!!!

describe("Authenticate (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to authenticate', async () => {
         await request(app.server)
            .post('/users')
            .send({
                name: "Kauã",
                email: "kaua@gmail.com",
                password: "1233445",
            });

        const response = await request(app.server)
            .post('/sessions')
            .send({
                email: "kaua@gmail.com",
                password: "1233445",
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String)
        });
    });
})