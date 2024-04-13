import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "../../../use-cases/factories/make-checki-in-use-case";
import { MaxDistanceError } from "../../../use-cases/errors/max-distance-error";
import { errorDetector } from "../../middlewares/error-detector";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        userId: z.string().uuid(),
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

    const { userId, latitude, longitude } = bodySchema.parse(request.body);
    const { gymId } = routeParamsSchema.parse(request.params);

    try {
        const createGymUseCase = makeCheckInUseCase()

        createGymUseCase.execute({ gymId, userId, userLatitude: latitude, userLongitude: longitude });

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