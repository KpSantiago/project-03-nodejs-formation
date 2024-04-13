import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryRepository } from "../repositories/inMemory/in-memory-user-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUseCase } from "./register";

describe('register user', () => {
    let usersRepository
    let sut: RegisterUseCase
    beforeEach(() => {
        usersRepository = new InMemoryRepository()
        sut = new RegisterUseCase(usersRepository);
    })
    it('should hash user password upon registration', async () => {

        const userData = {
            name: "Kauã",
            email: "santiago@gmail.com",
            password: "123"
        }

        const { user } = await sut.execute(userData);

        const compareUserPasswordHash = await compare('123', user.password_hash)

        expect(compareUserPasswordHash).toBe(true);
    });
    it('should be return user alreadu exists error', async () => {
        const userData = {
            name: "Kauã",
            email: "santiago@gmail.com",
            password: "123"
        }

        await sut.execute(userData);


        await expect(() => sut.execute(userData))
            .rejects
            .toBeInstanceOf(UserAlreadyExistsError);
    })
    it('should be able to register a user', async () => {
        const userData = {
            name: "Kauã",
            email: "santiago@gmail.com",
            password: "123"
        }

        const { user } = await sut.execute(userData);

        expect(user.id).toBeTypeOf('string');
    })
});

