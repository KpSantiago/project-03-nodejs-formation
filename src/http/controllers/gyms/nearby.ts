import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchNerbyGymsUseCase } from "../../../use-cases/factories/fetch-nearby-gyms-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const serachParamsSchema = z.object({
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    });

    const { latitude, longitude } = serachParamsSchema.parse(request.query);
    const fecthNearbyGyms = makeFetchNerbyGymsUseCase()

    const { gyms } = await fecthNearbyGyms.execute({ userLatitude: latitude, userLongitude: longitude });

    return reply.status(200).send({ gyms });
}
