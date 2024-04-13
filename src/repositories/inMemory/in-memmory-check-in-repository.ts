import { CheckIn, Prisma, User } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { CheckInRepository } from "../CheckInRepository";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInRepository {
    private items: CheckIn[] = []

    async findByUserIdOndDate({ userId, date }: { userId: string; date: Date; }): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');

        const checkIns = this.items.find(chekIn => {
            const chekcInDate = dayjs(chekIn.created_at)

            const checkTheCheckInDate =
                chekcInDate.isAfter(startOfTheDay) &&
                chekcInDate.isBefore(endOfTheDay);

            return chekIn.user_id == userId && checkTheCheckInDate
        })

        if (!checkIns) {
            return null;
        }

        return checkIns;
    }

    async findById(id: string): Promise<CheckIn | null> {
        const checkIn = this.items.find(ci => ci.id == id);

        if (!checkIn) {
            return null;
        }

        return checkIn;
    }


    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        return this.items
            .filter(chekIn => chekIn.user_id == userId)
            .slice((page - 1) * 20, page * 20);
    }

    async countCheckInsByUserId(userId: string): Promise<number> {
        return this.items.filter(chekIn => chekIn.user_id == userId).length;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            gym_id: data.gym_id,
            user_id: data.user_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date()
        }

        this.items.push(checkIn);

        return checkIn;
    }

    async save(data: CheckIn): Promise<CheckIn> {
        const checkInIndex = this.items.findIndex(ci => ci.id == data.id);
        if (checkInIndex > 0) {
            this.items[checkInIndex] = data;
        }

        const checkIn = data

        return checkIn;
    }
}