import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymRepository } from "../repositories/inMemory/in-memory-gym-repository";
import { FetchNerbyGymsUseCase } from "./fetch-nearby-gyms";

describe('Fetch Nearby Gyms Use Case', () => {
    let gymsRepository: InMemoryGymRepository
    let sut: FetchNerbyGymsUseCase
    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository()
        sut = new FetchNerbyGymsUseCase(gymsRepository);
    })

    it('should be able to fetch a list of nearby academias', async () => {
        for (let i = 1; i <= 2; i++) {
            await gymsRepository.create({
                title: `gym-${i}`,
                description: '',
                phone: '',
                latitude: -4.9796528,
                longitude: -39.014699,
            })
        }

        await gymsRepository.create({
            title: `gym-3`,
            description: '',
            phone: '',
            latitude: -4.9647183,
            longitude: -38.9974551,
        })

        const { gyms } = await sut.execute({ userLatitude: -4.9796528, userLongitude: -39.014699 });

        expect(gyms).toHaveLength(3);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'gym-1' }),
            expect.objectContaining({ title: 'gym-2' }),
            expect.objectContaining({ title: 'gym-3' }),
        ])
    })
});

