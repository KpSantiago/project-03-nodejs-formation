import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository";
import { CreaetGymUseCase } from "../create-gym";

export function makeCreateGymUseCase(){
   const gymRepository = new PrismaGymsRepository();
   const createGymUseCase = new CreaetGymUseCase(gymRepository);

   return createGymUseCase;
}