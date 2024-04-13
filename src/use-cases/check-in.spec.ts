import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryCheckInRepository } from "../repositories/inMemory/in-memmory-check-in-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymRepository } from "../repositories/inMemory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOFCheckInError } from "./errors/max-number-of-check-in-error";

describe('check in', () => {
    let checkInRepository: InMemoryCheckInRepository
    let gymsRepository: InMemoryGymRepository
    let sut: CheckInUseCase
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInRepository()
        gymsRepository = new InMemoryGymRepository();
        sut = new CheckInUseCase(checkInRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-01',
            title: 'js gym',
            description: '',
            phone: '',
            latitude: -4.9719622,
            longitude: -38.9935592,
            created_at: new Date()
        });

        vi.useFakeTimers()
    });

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able create a check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -4.9719622,
            userLongitude: -38.9935592,
        })


        expect(checkIn.id).toEqual(expect.any(String))
    });

    it('should not be able create two check ins on the same day', async () => {
        vi.setSystemTime(new Date(2024, 0, 3, 8, 0, 0));

        await gymsRepository.create(
            {
                id: 'gym-02',
                title: 'js gym',
                description: '',
                phone: '',
                latitude: 0,
                longitude: 0,
                created_at: new Date()
            }
        )


        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -4.9719622,
            userLongitude: -38.9935592,
        })

        await expect(() => sut.execute({
            gymId: "gym-02",
            userId: "user-01",
            userLatitude: -4.9719622,
            userLongitude: -38.9935592,
        })).rejects.toBeInstanceOf(MaxNumberOFCheckInError);
    });


    it('should be able create two check ins on diferent days', async () => {
        vi.setSystemTime(new Date(2024, 0, 3, 8, 0, 0));

        gymsRepository.items.push(
            {
                id: 'gym-02',
                title: 'js gym',
                description: '',
                phone: '',
                latitude: new Decimal(-4.9719622),
                longitude: new Decimal(-38.9935592),
                created_at: new Date()
            }
        )


        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -4.9719622,
            userLongitude: -38.9935592,
        })

        vi.setSystemTime(new Date(2024, 0, 4, 8, 0, 0));
        const { checkIn } = await sut.execute({
            gymId: "gym-02",
            userId: "user-01",
            userLatitude: -4.9719622,
            userLongitude: -38.9935592,

        })
        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to create a check in on a distant gym', async () => {
        vi.setSystemTime(new Date(2024, 0, 3, 8, 0, 0));

        gymsRepository.items.push(
            {
                id: 'gym-03',
                title: 'js gym',
                description: '',
                phone: '',
                latitude: new Decimal(-4.9031209),
                longitude: new Decimal(-38.6815177),
                created_at: new Date()
            }
        )

        await expect(() => sut.execute({
            gymId: "gym-03",
            userId: "user-01",
            userLatitude: -4.9719622,
            userLongitude: -38.9935592,
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
});
