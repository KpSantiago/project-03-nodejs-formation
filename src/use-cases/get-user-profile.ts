import { UsersRepository } from "../repositories/UsersRepository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { User } from "@prisma/client";

export interface getProfileBodyRequest {
    userId: string;
}

export interface getProfilerResponseBody {
    user: User
}

export class GetUserProfileUseCase {
    constructor(private userRepository: UsersRepository) { }

    public async execute({ userId }: getProfileBodyRequest) {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return { user }
    }
}