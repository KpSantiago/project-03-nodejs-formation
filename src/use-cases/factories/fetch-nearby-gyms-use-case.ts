import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository";
import { FetchNerbyGymsUseCase } from "../fetch-nearby-gyms";

export function makeFetchNerbyGymsUseCase() {
    const gymRepository = new PrismaGymsRepository();
    const nearbyGymsUseCase = new FetchNerbyGymsUseCase(gymRepository);

    return nearbyGymsUseCase;
}