// @vitest-environment prisma

import { app } from "../../../app";
import request from "supertest";
import { it, describe, expect, afterAll, beforeAll, beforeEach } from "vitest";
import { userDoRegisterAndLogin } from "../../middlewares/test/user-do-register-and-login";

// vamos uitlizar a biblioteca supertest para os testes end-two-end!!!

describe("Fecth Nearby gym (e2e)", () => {
    let infos: any;
    beforeAll(async () => {
        await app.ready();
        infos = await userDoRegisterAndLogin();
    });

    afterAll(async () => {
        await app.close();
    });

    // beforeEach(async () => {
    //     await userDoRegisterAndLogin();
    // })

    it('should be able to no fecth nearby gyms', async () => {
        await request(app.server)
            .post('/gyms')
            .auth(infos.token, { type: "bearer" })
            .send({
                title: "Javascript Gym",
                description: 'JS Gym for devs',
                phone: "5585997453455",
                latitude: -4.9703589,
                longitude: -39.0143731
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .auth(infos.token, { type: "bearer" })
            .query({
                latitude: -4.9703589,
                longitude: -39.0143731,
            })

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            gyms: [
                expect.objectContaining({ title: "Javascript Gym" })
            ]
        });
    });
})