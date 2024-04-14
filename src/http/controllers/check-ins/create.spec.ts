// @vitest-environment prisma

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { userDoRegisterAndLogin } from "../../middlewares/test/user-do-register-and-login";

describe("create check-in (e2e)", () => {
    let infos: { token: string };
    beforeAll(async () => {
        await app.ready();
        infos = await userDoRegisterAndLogin();
    })

    afterAll(async () => {
        await app.close();
    })

    it("should be able to create a check-in", async () => {
        const gymReponse = await request(app.server).post("/gyms").auth(infos.token, { type: 'bearer' }).send({
            title: "Javascript Gym",
            description: 'JS Gym for devs',
            phone: "5585997453455",
            latitude: -4.9703589,
            longitude: -39.0143731
        });

        const response = await request(app.server).post(`/gyms/${gymReponse.body.gym.id}/check-ins`).auth(infos.token, { type: 'bearer' }).send({
            latitude: -4.9703589,
            longitude: -39.0143731
        });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            checkIn: expect.objectContaining({ id: expect.any(String) })
        });
    })
})