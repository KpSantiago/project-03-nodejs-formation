import { PrismaCheckInRespository } from "../../repositories/prisma/prisma-check-in-repository";
import { ValidateCheckInUseCase } from "../validate-check-in";

export function makeValidateCheckInUseCase() {
    const checkInRepository = new PrismaCheckInRespository()
    const validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository);

    return validateCheckInUseCase;
} 