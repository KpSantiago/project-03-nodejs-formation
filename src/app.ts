import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { fastifyJwt } from "@fastify/jwt";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false // Signed false signifia que o token não é assiando com um hash
    },
    sign: {
        expiresIn: '10min' // A cada 10min o token expira e busca pelo refresh token para manter o usuário logado
    }
});

app.register(fastifyCookie);

app.register(userRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

// Adicionando uma tratativa de erros global
app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: "Validation error.",
            issues: error.format()
        });
    } else {
        // TODO: usar futuramente alguma dependencia que avise quando, onde e quantas vezes aconteceu algum tipo de error
    }

    if (env.NODE_ENV !== 'production')
        console.error(error)

    return reply.status(500).send({ message: "Internal Server Error." });
})

export { app }