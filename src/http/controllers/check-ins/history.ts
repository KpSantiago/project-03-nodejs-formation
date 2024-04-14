import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFecthUserCheckInHistoryUseCase } from "../../../use-cases/factories/make-fetch-user-check-ins-hisotry-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {


    const searchParamsSchema = z.object({
        page: z.coerce.number().min(1).default(1)
    });

    const { page } = searchParamsSchema.parse(request.query);
    const fetchUserCheckInHisotry = makeFecthUserCheckInHistoryUseCase()

    const { checkIns } = await fetchUserCheckInHisotry.execute({ page, userId: request.user.sub });

    return reply.status(200).send({checkIns});
}