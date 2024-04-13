import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchGymUseCase } from "../../../use-cases/factories/make-search-use-case";

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchParamsSchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1)
    });

    const { q, page } = searchParamsSchema.parse(request.query);
    const searchGyms = makeSearchGymUseCase()

    const { gyms } = await searchGyms.execute({ query: q, page });

    return reply.status(200).send({ gyms });

}