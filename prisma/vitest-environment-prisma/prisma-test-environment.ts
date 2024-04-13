import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { Environment } from "vitest";
import { prisma } from "../../src/lib/prisma";

function generateDatabaseUrl(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error("Plese, set a url to DATABASE_URL environment variable.")
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set('schema', schema);

    return url.toString();
}

export default <Environment>{
    name: "prisma",
    transformMode: 'ssr',
    async setup(global, options) {
        const schema = randomUUID();
        const databaseUrl = generateDatabaseUrl(schema);

        process.env.DATABASE_URL = databaseUrl;

        execSync("npx prisma migrate deploy");
        
        return {
            async teardown(global) {
                // prisma.$executeRaw`` -> executa um query direta no banco de dados e não permite que ela possa ser maliciosa
                // prisma.$executeRawUnsafe() -> permite que a query seja maliciosa, por exemplo, que delete um banco de dados
                await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)

                await prisma.$disconnect()
            },
        }
    },
}