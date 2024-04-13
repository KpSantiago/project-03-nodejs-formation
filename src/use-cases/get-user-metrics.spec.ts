import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/inMemory/in-memmory-check-in-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

describe('Get User Check-ins Count From Metrics Use Case', () => {
    let checkInRepository: InMemoryCheckInRepository
    let sut: GetUserMetricsUseCase
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInRepository()
        sut = new GetUserMetricsUseCase(checkInRepository);
    });

    it('should be able to get user count from metrics', async () => {
        await checkInRepository.create({
            user_id: "user-01",
            gym_id: "gym-01"
        })

        await checkInRepository.create({
            user_id: "user-01",
            gym_id: "gym-02"
        })

        await checkInRepository.create({
            user_id: "user-01",
            gym_id: "gym-03"
        })

        const { metrics } = await sut.execute({ userId: 'user-01' })

        expect(metrics).toEqual(3);
    });
});
