import { PrismaUserRespository } from "../../repositories/prisma/prisma-user-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
    const prismaUserRespository = new PrismaUserRespository();

    const registerUseCase = new RegisterUseCase(prismaUserRespository);

    return registerUseCase;
}