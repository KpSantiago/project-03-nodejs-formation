import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../GymsRepository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { getDistanceBetweenCordinates } from "../../utils/get-distance-between-cordinates";

export class InMemoryGymRepository implements GymsRepository {
    items: Gym[] = [];

    async findById(id: string) {
        const gym = this.items.find(g => g.id == id);

        if (!gym) {
            return null;
        }

        return gym;
    }

    async searchMany(query: string, page: number): Promise<Gym[]> {
        return this.items
            .filter(gym => gym.title.toLocaleLowerCase().includes(query.toLowerCase()))
            .slice((page - 1) * 20, page * 20);
    }

    async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
        return this.items
            .filter(gym => {
                const distance = getDistanceBetweenCordinates({ latitude: params.latitude, longitude: params.longitude }, { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() })

                return distance < 10;
            })
    }

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Decimal(data.latitude.toString()),
            longitude:  data.longitude ? new Decimal(data.longitude.toString()) : new Decimal(0),
            created_at: new Date()

        }
        this.items.push(gym);

        return gym;
    }

}