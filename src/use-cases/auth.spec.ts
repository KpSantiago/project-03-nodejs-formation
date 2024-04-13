import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryRepository } from "../repositories/inMemory/in-memory-user-repository";
import { IncorrectCredentialsError } from "./errors/incorrect-credentials-error";
import { AuthenticateUseCase } from "./auth";

describe('Authenticate User', () => {
    let usersRepository: InMemoryRepository
    let sut: AuthenticateUseCase
    beforeEach(() => {
        usersRepository = new InMemoryRepository()
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('should be able user authenticate', async () => {
        const userData = {
            email: "santiago@gmail.com",
            password: '123'
        }

        await usersRepository.createUser({
            name: "Kauã",
            email: "santiago@gmail.com",
            password_hash: await hash('123', 8)
        })

        const user = await sut.execute(userData)


        expect(user.user.id).toBeTypeOf('string');
    });

    it('should be able return incorrect crendentials error for email', async () => {
        const userData = {
            email: "santiago1@gmail.com",
            password: '123'
        }

        await usersRepository.createUser({
            name: "Kauã",
            email: "santiago@gmail.com",
            password_hash: await hash('123', 8)
        })

        await expect(() => sut.execute(userData)).rejects.toBeInstanceOf(IncorrectCredentialsError)
    })

    it('should be able return incorrect crendentials error for passowrd', async () => {
        const userData = {
            email: "santiago@gmail.com",
            password: '12356'
        }

        await usersRepository.createUser({
            name: "Kauã",
            email: "santiago@gmail.com",
            password_hash: await hash('123', 8)
        })

        await expect(() => sut.execute(userData)).rejects.toBeInstanceOf(IncorrectCredentialsError)
    })
});



