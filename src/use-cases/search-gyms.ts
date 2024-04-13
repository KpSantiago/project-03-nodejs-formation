import { Gym } from "@prisma/client";
import { GymsRepository } from "../repositories/GymsRepository";

interface SearchGymUseCaseRequest {
    query: string,
    page: number
}

interface SearchGymUseCaseResponse {
    gym: Gym
}

export class SearchGymUseCase {
    constructor(private gymRepository: GymsRepository) { }


    public async execute({ query, page }: SearchGymUseCaseRequest) {
        const gyms = await this.gymRepository.searchMany(query, page)

        return { gyms };
    }
}