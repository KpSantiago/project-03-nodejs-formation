import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryCheckInRepository } from "../repositories/inMemory/in-memmory-check-in-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

describe('Validate Check-In Use Case', () => {
    let checkInRepository: InMemoryCheckInRepository
    let sut: ValidateCheckInUseCase
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInRepository()
        sut = new ValidateCheckInUseCase(checkInRepository);

        vi.useFakeTimers()
    });

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate a check-in', async () => {
        vi.setSystemTime(new Date(2024, 2, 20, 13, 0));
        const createdCheckIn = await checkInRepository.create({
            gym_id: "gym-01",
            user_id: "user-01",
        })

        const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(createdCheckIn.validated_at).toEqual(expect.any(Date));
    });

    it('should not be able to validate an inexistence check-in', async () => {
        await expect(() => sut.execute({
            checkInId: 'inexistence check-in'
        }))
            .rejects
            .toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not be able to validate an late check-in', async () => {
        vi.setSystemTime(new Date(2024, 2, 20, 13, 0));
        const checkIn = await checkInRepository.create({
            gym_id: "gym-02",
            user_id: "user-01",
        });

        const twentyMinutes = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyMinutes)

        await expect(() => sut.execute({
            checkInId: checkIn.id
        }))
            .rejects
            .toBeInstanceOf(LateCheckInValidationError);
    });
});
