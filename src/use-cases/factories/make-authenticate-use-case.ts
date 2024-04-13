import { PrismaUserRespository } from "../../repositories/prisma/prisma-user-repository";
import { AuthenticateUseCase } from "../auth";

export function makeAunthenticateUseCase() {
    const prismaUserRespository = new PrismaUserRespository();

    const authenticateUseCase = new AuthenticateUseCase(prismaUserRespository);

    return authenticateUseCase;
}