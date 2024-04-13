import { app } from "./app";
import { env } from "./env";

/**
 * ORM - Object Relational Mapper
 * Estratégia para mapear tabelas SQL em forma de objetos relacionais
 */

// host -> host será necessário para que os app front-ends possam futuramente consumir nossa API REST
app.listen({
    port: env.PORT,
    host: '0.0.0.0'
}).then(() => console.log('HTTP Server running'))