import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryRepository } from "../repositories/inMemory/in-memory-user-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe('register user', () => {
    let usersRepository: InMemoryRepository
    let sut: GetUserProfileUseCase
    beforeEach(() => {
        usersRepository = new InMemoryRepository()
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('should be able user authenticate', async () => {
        await usersRepository.createUser({
            name: "Kauã",
            email: "santiago@gmail.com",
            password_hash: await hash('123', 8)
        })

        const { user } = await sut.execute({ userId: 'user-id' })


        expect(user.name).toEqual('Kauã');
    });

    it('should be able return incorrect crendentials error for email', async () => {
        await usersRepository.createUser({
            name: "Kauã",
            email: "santiago@gmail.com",
            password_hash: await hash('123', 8)
        })

        await expect(() => sut.execute({ userId: 'non-user-id' })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
});



