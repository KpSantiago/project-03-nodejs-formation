import { CheckInRepository } from "../repositories/CheckInRepository";
import { CheckIn } from "@prisma/client";

export interface GetUserMetricsBodyRequest {
    userId: string;
}

export interface GetUserMetricsResponseBody {
    checkIns: CheckIn[]
}

export class GetUserMetricsUseCase {
    constructor(private checkInRepository: CheckInRepository) { }

    public async execute({ userId }: GetUserMetricsBodyRequest) {
        const metrics = await this.checkInRepository.countCheckInsByUserId(userId);

        return { metrics }
    }
}