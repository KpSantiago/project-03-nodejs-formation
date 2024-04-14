// @vitest-environment prisma

import { app } from "../../../app";
import request from "supertest";
import { it, describe, expect, afterAll, beforeAll, beforeEach } from "vitest";
import { userDoRegisterAndLogin } from "../../middlewares/test/user-do-register-and-login";

// vamos uitlizar a biblioteca supertest para os testes end-two-end!!!

describe("Search for gyms (e2e)", () => {
    let token: string;
    beforeAll(async () => {
        await app.ready();
        token = await userDoRegisterAndLogin();
    });

    afterAll(async () => {
        await app.close();
    });

    // beforeEach(async () => {
    //     await userDoRegisterAndLogin();
    // })

    it('should be able to search for gym by a query', async () => {
        const r = await request(app.server)
            .post('/gyms')
            .auth(token, { type: "bearer" })
            .send({
                title: "Javascript Gym 1",
                description: 'JS Gym for devs',
                phone: "5585997453455",
                latitude: -4.9703589,
                longitude: -39.0143731
            })

        const r2 = await request(app.server)
            .post('/gyms')
            .auth(token, { type: "bearer" })
            .send({
                title: "Javascript Gym 2",
                description: 'JS Gym for devs',
                phone: "5585997453455",
                latitude: -4.9703589,
                longitude: -39.0143731
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .auth(token, { type: "bearer" })
            .query({
                q: 'Javascript',
                page: 1
            })

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            gyms: [
                expect.objectContaining({ title: "Javascript Gym 1" }),
                expect.objectContaining({ title: "Javascript Gym 2" }),
            ]
        });
    });
})