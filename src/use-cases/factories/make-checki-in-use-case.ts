import { PrismaCheckInRespository } from "../../repositories/prisma/prisma-check-in-repository";
import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "../check-in";

export function makeCheckInUseCase(){
    const gymsRepository =  new PrismaGymsRepository();
    const checkInRepository = new PrismaCheckInRespository()
    const checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);

    return checkInUseCase
}