import { genSalt, hash } from "bcryptjs"
import { UsersRepository } from "../repositories/UsersRepository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

export interface RegisterUserDTO {
    name: string,
    email: string,
    password: string
}

export class RegisterUseCase {
    constructor(private userRepository: UsersRepository) { }

    public async execute({ name, email, password }: RegisterUserDTO) {
        const verifyUserExistence = await this.userRepository.findByEmail(email)

        if (verifyUserExistence) {
            throw new UserAlreadyExistsError();
        }

        const salt = await genSalt(8);
        const password_hash = await hash(password, salt)

        const user = await this.userRepository.createUser({ name, email, password_hash });

        return { user }
    }
}