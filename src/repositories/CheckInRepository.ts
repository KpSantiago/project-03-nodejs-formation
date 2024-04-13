import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInRepository {
    findByUserIdOndDate(data: { userId: string, date: Date }): Promise<CheckIn | null>
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    findById(id: string): Promise<CheckIn | null>
    countCheckInsByUserId(userId: string): Promise<number>
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(data: CheckIn): Promise<CheckIn>
}