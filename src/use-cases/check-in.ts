import { CheckInRepository } from "../repositories/CheckInRepository";
import { GymsRepository } from "../repositories/GymsRepository";
import { getDistanceBetweenCordinates } from "../utils/get-distance-between-cordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOFCheckInError } from "./errors/max-number-of-check-in-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { CheckIn } from "@prisma/client";

export interface CheckInBodyRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number
}

export interface CheckInResponseBody {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(private checkInRepository: CheckInRepository, private gymRepository: GymsRepository) { }

    public async execute(data: CheckInBodyRequest) {
        const gym = await this.gymRepository.findById(data.gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const hasACheckInOnTheDay = await this.checkInRepository.findByUserIdOndDate({
            userId: data.userId,
            date: new Date()
        })

        if (hasACheckInOnTheDay) {
            throw new MaxNumberOFCheckInError()
        }

        const distanceBetweenUserAndGym = getDistanceBetweenCordinates(
            {
                latitude: data.userLatitude,
                longitude: data.userLongitude
            },
            {
                latitude: Number(gym.latitude),
                longitude: Number(gym.longitude)
            }
        );

        const MAX_DISTANCE_IN_KILOMETERS = 0.1;

        if (distanceBetweenUserAndGym > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError();
        }

        const checkIn = await this.checkInRepository.create({
            gym_id: data.gymId,
            user_id: data.userId
        })

        return { checkIn }
    }
}