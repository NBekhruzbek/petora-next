import { Direction } from "@/libs/enums/common.enum";
import { PetCategory, PetStatus } from "@/libs/enums/discoveryPet.enum";

export interface DiscoveryPetInput {
  petCategory: PetCategory;
  petStatus?: PetStatus;
  petName: string;
  petCountry: string;
  petImage: string;
  petDifficulty: number;
  petFerocious: number;
  petSpace: number;
  petGroups: number;
  petDescription: string;
  petLink: string;
  memberId?: string;
}

interface DPISearch {
  petCategory?: PetCategory[];
  petStatus?: PetStatus[];
  onlyLiked?: boolean;
  text?: string;
}

export interface DiscoveryPetsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: DPISearch;
}
