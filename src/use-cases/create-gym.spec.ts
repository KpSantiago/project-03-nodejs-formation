import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymRepository } from "../repositories/inMemory/in-memory-gym-repository";
import { CreaetGymUseCase } from "./create-gym";

describe('Create Gym Use Case', () => {
    let gymsRepository: InMemoryGymRepository
    let sut: CreaetGymUseCase
    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository()
        sut = new CreaetGymUseCase(gymsRepository);
    })

    it('should be able to create a gym', async () => {
        const gymData = {
            title: "js",
            description: "santiago@gmail.com",
            phone: "123",
            latitude: -4.9031209,
            longitude: -38.6815177
        }

        const { gym } = await sut.execute(gymData);

        expect(gym.id).toEqual(expect.any(String));
    })
});

