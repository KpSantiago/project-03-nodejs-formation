import { compare } from "bcryptjs"
import { UsersRepository } from "../repositories/UsersRepository";
import { User } from "@prisma/client";
import { IncorrectCredentialsError } from "./errors/incorrect-credentials-error";

export interface RequestBody {
    email: string,
    password: string
}


export interface ResponseBody {
    user: User
}

export class AuthenticateUseCase {
    constructor(private userRepository: UsersRepository) { }

    public async execute({ email, password }: RequestBody): Promise<ResponseBody> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new IncorrectCredentialsError();
        }

        const doesPassowrdMatch = await compare(password, user.password_hash)

        if (!doesPassowrdMatch) {
            throw new IncorrectCredentialsError();
        }

        return { user }
    }
}