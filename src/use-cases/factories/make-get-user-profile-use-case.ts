import { PrismaUserRespository } from "../../repositories/prisma/prisma-user-repository";
import { GetUserProfileUseCase } from "../get-user-profile";

export function makeGetUserProfileUseCase() {
    const userRepository = new PrismaUserRespository()
    const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

    return getUserProfileUseCase;
}