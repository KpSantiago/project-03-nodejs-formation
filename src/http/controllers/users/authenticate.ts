import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { IncorrectCredentialsError } from "../../../use-cases/errors/incorrect-credentials-error";
import { makeAunthenticateUseCase } from "../../../use-cases/factories/make-authenticate-use-case";
import { errorDetector } from "../../middlewares/error-detector";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const body = bodySchema.parse(request.body);

    try {
        const authenticateUseCase = makeAunthenticateUseCase();

        const { user } = await authenticateUseCase.execute(body);

        const token = await reply.jwtSign({
            role: user.role
        }, {
            sub: user.id,
        });

        const refreshToken = await reply.jwtSign({
            role: user.role
        }, {
            sign: {
                sub: user.id,
                expiresIn: '7d', // O refresh token deve ter um tempo de expiração maior, mas o sufuciente para que o usuário possa
                //acessar novamente o site
            }
        });

        return reply.setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true, // com HTTPs o frontend não consegue ver esse token de forma bruta
            sameSite: true, // Só pode ser accessível no mesmo site
            httpOnly: true, // Só pode ser acessado pelo backend e não pelo front
        }).status(200).send({
            token,
        })
    } catch (error) {
        const err = errorDetector(error);
        if (!err) {
            throw error;
        }
        const { message } = new err.error_type();

        return reply.status(err.status).send({ message })
    }

}