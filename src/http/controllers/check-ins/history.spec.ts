// @vitest-environment prisma

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { userDoRegisterAndLogin } from "../../middlewares/test/user-do-register-and-login";

describe("get history of check-ins (e2e)", () => {
    let infos: { token: string };
    beforeAll(async () => {
        await app.ready();
        infos = await userDoRegisterAndLogin();
        vi.useFakeTimers()
    })

    afterAll(async () => {
        await app.close();
        vi.useRealTimers()
    })

    it("should be able to get user check-ins history", async () => {
        vi.setSystemTime(new Date(2024, 2, 10, 13, 0, 0))
        const gymReponse1 = await request(app.server).post("/gyms").auth(infos.token, { type: 'bearer' }).send({
            title: "Javascript Gym - 01",
            description: 'JS Gym for devs',
            phone: "5585997453455",
            latitude: -4.9703589,
            longitude: -39.0143731,
        }).expect(200);


        const gymReponse2 = await request(app.server).post("/gyms").auth(infos.token, { type: 'bearer' }).send({
            title: "Javascript Gym - 02",
            description: 'JS Gym for devs',
            phone: "5585997453455",
            latitude: -4.9703589,
            longitude: -39.0143731,
        }).expect(200);

        
        await request(app.server).post(`/gyms/${gymReponse1.body.gym.id}/check-ins`).auth(infos.token, { type: 'bearer' }).send({
            latitude: -4.9703589,
            longitude: -39.0143731,
            created_at: new Date()
        }).expect(200)

        vi.advanceTimersByTime(1000 * 60 * 60 * 25)

        await request(app.server).post(`/gyms/${gymReponse2.body.gym.id}/check-ins`).auth(infos.token, { type: 'bearer' }).send({
            latitude: -4.9703589,
            longitude: -39.0143731,
            created_at: new Date()
        }).expect(200)


        const response = await request(app.server).get("/check-ins/history").auth(infos.token, { type: 'bearer' });
        
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            checkIns: [
                expect.objectContaining({ id: expect.any(String) }),
                expect.objectContaining({ id: expect.any(String) }),
            ]
        });
    })
})