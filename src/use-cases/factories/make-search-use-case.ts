import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository";

import { SearchGymUseCase } from "../search-gyms";

export function makeSearchGymUseCase() {
    const gymRepository = new PrismaGymsRepository();
    const searchGymUseCase = new SearchGymUseCase(gymRepository);

    return searchGymUseCase;
}