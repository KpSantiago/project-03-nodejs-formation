import { app } from "../../../app";
import supertest from "supertest";
export async function userDoRegisterAndLogin() {
     await supertest(app.server).post('/users').send({
        name: "Kauã",
        email: "kaua@gmail.com",
        password: "1233445",
    })


    const response = await supertest(app.server).post('/sessions').send({
        email: "kaua@gmail.com",
        password: "1233445",
    })

    return response.body.token;
}