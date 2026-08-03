import { PetCategory, PetStatus } from "@/libs/enums/discoveryPet.enum";
import { MeLiked } from "../like/like";

export interface DiscoveryPet {
  _id: string;
  petCategory: PetCategory;
  petStatus: PetStatus;
  petName: string;
  petCountry: string;
  petImage: string;
  petDifficulty: number;
  petFerocious: number;
  petSpace: number;
  petGroups: number;
  petDescription: string;
  petLink?: string;
  petLikes: number;
  petViews: number;
  petRank: number;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation */
  meLiked?: MeLiked[];
}

export interface DiscoveryPetTotalCounter {
  total: number;
}

export interface DiscoveryPets {
  list: DiscoveryPet[];
  metaCounter: DiscoveryPetTotalCounter[];
}
