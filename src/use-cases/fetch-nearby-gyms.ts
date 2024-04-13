import { Gym } from "@prisma/client";
import { GymsRepository } from "../repositories/GymsRepository";

interface FetchNerbyGymsUseCaseRequest {
    userLatitude: number;
    userLongitude: number;
}

interface FetchNerbyGymsUseCaseResponse {
    gym: Gym
}

export class FetchNerbyGymsUseCase {
    constructor(private gymRepository: GymsRepository) { }

    public async execute({userLatitude, userLongitude }: FetchNerbyGymsUseCaseRequest) {
        const gyms = await this.gymRepository.findManyNearby({latitude: userLatitude, longitude: userLongitude})

        return { gyms };
    }
}