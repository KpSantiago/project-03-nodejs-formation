import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "../../../use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "../../../use-cases/factories/make-register-use-case";
import { errorDetector } from "../../middlewares/error-detector";

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['ADMIN', 'MEMBER']).optional()
    });

    const body = bodySchema.parse(request.body);

    try {
        const registerUseCase = makeRegisterUseCase()

        await registerUseCase.execute(body);

        return reply.status(201).send();
    } catch (error) {
        const err = errorDetector(error);
        if (!err) {
            throw error;
        }
        const { message } = new err.error_type();

        return reply.status(err.status).send({ message })
    }

}