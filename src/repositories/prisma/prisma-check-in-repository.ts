import { prisma } from "../../lib/prisma";
import { CheckIn, Prisma, User } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { CheckInRepository } from "../CheckInRepository";
import dayjs from "dayjs";

export class PrismaCheckInRespository implements CheckInRepository {
    public async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.create({
            data
        })

        return checkIn;
    }

    async countCheckInsByUserId(userId: string): Promise<number> {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId
            }
        })

        return count;
    }

    async findById(id: string): Promise<CheckIn | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id
            }
        });

        return checkIn
    }

    async findByUserIdOndDate(data: { userId: string; date: Date; }): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(data.date).startOf('date');
        const endOfTheDay = dayjs(data.date).endOf('date');

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: data.userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate()
                }
            }
        })


        return checkIn;
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            take: 20,
            skip: (page - 1) * 20
        });

        return checkIns;
    }

    async save(data: CheckIn): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.update({
            where: {
                id: data.id
            },
            data
        });

        return checkIn
    }
}