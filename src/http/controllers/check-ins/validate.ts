import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeValidateCheckInUseCase } from "../../../use-cases/factories/make-validate-check-in-use-case";
import { errorDetector } from "../../middlewares/error-detector";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const routeParamsSchema = z.object({
        checkInId: z.string().uuid()
    });

    const { checkInId } = routeParamsSchema.parse(request.params);

    const validateCheckInUseCase = makeValidateCheckInUseCase()

    try {
        const { checkIn } = await validateCheckInUseCase.execute({ checkInId });

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