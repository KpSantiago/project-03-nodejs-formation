import { prisma } from "../../lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../UsersRepository";

export class PrismaUserRespository implements UsersRepository {
    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        return user;
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return user;
    }

    async createUser({ name, email, password_hash }: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash
            }
        })

        return user;
    }
}