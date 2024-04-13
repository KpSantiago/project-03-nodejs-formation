import { Prisma, User } from "@prisma/client";

export interface UsersDTO {
    id: string;
    name: string,
    email: string,
    password_hash: string,
    created_at: Date
}


export interface UsersRepository {
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    createUser(data: Prisma.UserCreateInput): Promise<User>
}