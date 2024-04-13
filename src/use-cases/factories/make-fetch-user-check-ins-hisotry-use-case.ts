import { PrismaCheckInRespository } from "../../repositories/prisma/prisma-check-in-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fecth-user-check-ins-history";

export function makeFecthUserCheckInHistoryUseCase(){
    const checkInRepository = new PrismaCheckInRespository()
    const fecthUserCheckInHistoryUseCase = new FetchUserCheckInsHistoryUseCase(checkInRepository)

    return fecthUserCheckInHistoryUseCase
}