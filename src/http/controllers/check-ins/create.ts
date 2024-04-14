import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "../../../use-cases/factories/make-checki-in-use-case";
import { errorDetector } from "../../middlewares/error-detector";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
    });

    const routeParamsSchema = z.object({
        gymId: z.string().uuid()
    });

    const { latitude, longitude } = bodySchema.parse(request.body);
    const { gymId } = routeParamsSchema.parse(request.params);

    try {
        const createChekckInUseCase = makeCheckInUseCase()

        const { checkIn } = await createChekckInUseCase.execute({ gymId, userId: request.user.sub, userLatitude: latitude, userLongitude: longitude });

        return reply.status(200).send({ checkIn });
    } catch (error) {
        const err = errorDetector(error);
        if (!err) {
            throw error;
        }
        const { message } = new err.error_type();

        return reply.status(err.status).send({ message })
    }
}