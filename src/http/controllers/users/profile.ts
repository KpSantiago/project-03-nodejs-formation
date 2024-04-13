import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "../../../use-cases/factories/make-get-user-profile-use-case";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const getUserProfiler = makeGetUserProfileUseCase();

    const { user } = await getUserProfiler.execute({
        userId: request.user.sub
    });

    return {
        ...user,
        password_has: undefined
    }
} 