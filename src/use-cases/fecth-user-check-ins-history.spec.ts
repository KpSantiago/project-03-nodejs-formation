import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/inMemory/in-memmory-check-in-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fecth-user-check-ins-history";

describe('fecth User Check Ins History', () => {
    let checkInRepository: InMemoryCheckInRepository
    let sut: FetchUserCheckInsHistoryUseCase
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInRepository()
        sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
    });

    it('should be able to fetch user check in history', async () => {
        await checkInRepository.create({
            user_id: "user-01",
            gym_id: "gym-01"
        })

        await checkInRepository.create({
            user_id: "user-01",
            gym_id: "gym-02"
        })

        const { checkIns } = await sut.execute({
            userId: "user-01",
            page: 1
        })


        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-01" }),
            expect.objectContaining({ gym_id: "gym-02" }),
        ])
    });

    it('should be able to fetch a pagineted user check in history', async () => {


        for (let i = 1; i <= 22; i++) {
            await checkInRepository.create({
                user_id: `user-01`,
                gym_id: `gym-${i}`
            })
        }

        const { checkIns } = await sut.execute({
            userId: "user-01",
            page: 2
        })


        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-21" }),
            expect.objectContaining({ gym_id: "gym-22" }),
        ])
    });
});
