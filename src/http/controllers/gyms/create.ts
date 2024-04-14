import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymUseCase } from "../../../use-cases/factories/make-create-gym-use-case";
import { errorDetector } from "../../middlewares/error-detector";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
    });

    const body = bodySchema.parse(request.body);

    try {
        const createGymUseCase = makeCreateGymUseCase()

        const { gym } = await createGymUseCase.execute(body);

        return reply.status(200).send({ gym });
    } catch (error) {
        const err = errorDetector(error);
        if (!err) {
            throw error;
        }
        const { message } = new err.error_type();

        return reply.status(err.status).send({ message })
    }
}