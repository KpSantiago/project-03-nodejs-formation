import { Gym } from "@prisma/client";
import { GymsRepository } from "../repositories/GymsRepository";

interface CreateGymUseCaseRequest {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number
}

interface CreateGymUseCaseResponde {
    gym: Gym
}

export class CreaetGymUseCase {
    constructor(private gymRepository: GymsRepository) { }


    public async execute({ title, phone, description, latitude, longitude }: CreateGymUseCaseRequest) {
        const gym = await this.gymRepository.create({ title, description, phone, latitude, longitude })

        return { gym };
    }
}