import { PrismaCheckInRespository } from "../../repositories/prisma/prisma-check-in-repository";
import { GetUserMetricsUseCase } from "../get-user-metrics";

export function makeGetUserMetricsUseCase(){
    const checkInRepository = new PrismaCheckInRespository()
    const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInRepository);

    return getUserMetricsUseCase
}