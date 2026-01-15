export enum AppView {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  DETAIL = 'DETAIL',
  DOCTOR = 'DOCTOR',
  IDENTIFY = 'IDENTIFY',
}

export interface PlantCare {
  light: string;
  water: string;
  soil: string;
  temperature: string;
  humidity: string;
  fertilizer: string;
}

export interface PlantData {
  name: string;
  scientificName: string;
  description: string;
  care: PlantCare;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  imageUrl?: string; // Optional placeholder URL
}

export interface SearchResult {
  name: string;
  scientificName: string;
  shortDescription: string;
  imageUrl?: string;
}

export interface DiagnosisResult {
  diagnosis: string;
  solution: string;
  prevention: string;
}