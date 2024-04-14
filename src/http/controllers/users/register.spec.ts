// @vitest-environment prisma

/**
 * Para que a utlização do Test Environment ocorram, é preciso utilizar o comentário
 * @ vitest-environment <nome-do-environment> (espaço entre o @ adicionado intencionalmente)
 */

import { app } from "../../../app";
import request from "supertest";
import { it, describe, expect, afterAll, beforeAll } from "vitest";

// vamos uitlizar a biblioteca supertest para os testes end-two-end!!!

describe("Register (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to register', async () => {
        const response = await request(app.server)
            .post('/users')
            .send({
                name: "Kauã",
                email: "kaua@gmail.com",
                password: "1233445",
                role: 'ADMIN'
            })

        expect(response.statusCode).toEqual(201);
    });
})