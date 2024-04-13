import { CheckInRepository } from "../repositories/CheckInRepository";
import { CheckIn } from "@prisma/client";

export interface FetchUserCheckInsHistoryBodyRequest {
    userId: string;
    page: number
}

export interface FetchUserCheckInsHistoryResponseBody {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(private checkInRepository: CheckInRepository) { }

    public async execute({ userId, page }: FetchUserCheckInsHistoryBodyRequest) {
        const checkIns = await this.checkInRepository.findManyByUserId(userId, page);

        return { checkIns }
    }
}