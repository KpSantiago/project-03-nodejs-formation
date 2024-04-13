import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({
        onlyCookie: true //vai verificar se existe um refresh token nos cookies
    })

    const token = await reply.jwtSign({
        role: request.user.role
    }, {
        sub: request.user.sub,
    });

    const refreshToken = await reply.jwtSign({
        role: request.user.role
    }, {
        sign: {
            sub: request.user.sub,
            expiresIn: '7d', // O refresh token deve ter um tempo de expiração maior, mas o sufuciente para que o usuário possa
            //acessar novamente o site
        }
    });

    return reply.setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // com HTTPs o frontend não consegue ver esse token de forma bruta
        sameSite: true, // Só pode ser accessível no mesmo site
        httpOnly: true, // Só pode ser acessado pelo backend e não pelo front
    }).status(200).send({
        token
    })


}