export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}

export enum CuisineType {
  Any = "Any",
  Italian = "Italian",
  Asian = "Asian",
  Mexican = "Mexican",
  Mediterranean = "Mediterranean",
  American = "American",
  Indian = "Indian",
  French = "French"
}

export enum CalorieGoal {
  Any = "Any",
  Light = "Light",       // < 400 kcal
  Balanced = "Balanced", // 400-700 kcal
  BulkUp = "BulkUp"      // > 700 kcal, high protein
}

export enum CreativityLevel {
  Traditional = "Traditional",
  Innovative = "Innovative"
}

export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string; // A short watercolor-esque description
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: string;
  cuisine: string;
  calories?: number;
  generatedAt?: string; // ISO Date string for history
}

export interface SavedRecipe extends Recipe {
  savedAt: string; // ISO Date string
  dateScheduled?: string; // ISO Date string (YYYY-MM-DD) for calendar
}

export interface FilterState {
  cuisine: CuisineType;
  difficulty: Difficulty | "Any";
  maxPrepTime: number; // in minutes
  calorieGoal: CalorieGoal;
  recipeCount: number;
  creativity: CreativityLevel;
}

export interface SearchSession {
  id: string;
  timestamp: string;
  ingredients: string[];
  filters: FilterState;
  recipes: Recipe[];
}