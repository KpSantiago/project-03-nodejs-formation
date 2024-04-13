import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryRepository } from "../repositories/inMemory/in-memory-user-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUseCase } from "./register";
import { InMemoryGymRepository } from "../repositories/inMemory/in-memory-gym-repository";
import { SearchGymUseCase } from "./search-gyms";

describe('Search Gym Use Case', () => {
    let gymsRepository: InMemoryGymRepository
    let sut: SearchGymUseCase
    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository()
        sut = new SearchGymUseCase(gymsRepository);
    })

    it('should be able to search a list of academias by query', async () => {
        for (let i = 1; i <= 2; i++) {
            gymsRepository.create({
                title: `gym-${i}`,
                description: '',
                phone: '',
                latitude: 0,
                logitude: 0,
            })
        }

        const { gyms } = await sut.execute({ query: "gym-1", page: 1 });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'gym-1' })
        ])
    })

    it('should be able to search a pagineted list of gyms', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript Gym ${i}`,
                description: '',
                phone: '',
                latitude: 0,
                logitude: 0,
            })
        }

        const { gyms } = await sut.execute({ query: "Javascript Gym", page: 2 });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym 21' }),
            expect.objectContaining({ title: 'Javascript Gym 22' }),
        ])
    })
});

