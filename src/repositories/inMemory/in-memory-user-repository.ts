import { prisma } from "../../lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../UsersRepository";

export class InMemoryRepository implements UsersRepository {
    private items: User[] = [];

    async findById(id: string): Promise<User | null> {
        const user = this.items.find(u => u.id == id);
        if (!user) {
            return null;
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find(u => u.email == email);
        if (!user) {
            return null;
        }


        return user;
    }

    async createUser({ name, email, password_hash }: Prisma.UserCreateInput): Promise<User> {
        const data = {
            id: 'user-id',
            name,
            email,
            password_hash,
            created_at: new Date()
        }

        this.items.push(data);

        return data;
    }
}