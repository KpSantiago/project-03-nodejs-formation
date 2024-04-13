import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        if (roleToVerify != request.user.role) {
            return reply.status(401).send({ message: 'Unauthorized.' })
        }
    }
}