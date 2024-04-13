import dayjs from "dayjs";
import { CheckInRepository } from "../repositories/CheckInRepository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { CheckIn } from "@prisma/client";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

export interface ValidateCheckInUseCaseBodyRequest {
    checkInId: string
}

export interface ValidateCheckInUseCaseResponseBody {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {
    constructor(private checkInRepository: CheckInRepository) { }

    public async execute({ checkInId }: ValidateCheckInUseCaseBodyRequest) {
        const checkIn = await this.checkInRepository.findById(checkInId);

        if (!checkIn) {
            throw new ResourceNotFoundError();
        }

        const verifyCheckInCreationTimeAdvance = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        )

        if (verifyCheckInCreationTimeAdvance > 20) {
            throw new LateCheckInValidationError();
        }

        checkIn.validated_at = new Date();

        await this.checkInRepository.save(checkIn);

        return { checkIn }
    }
}