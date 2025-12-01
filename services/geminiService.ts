import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, FilterState, CuisineType, CalorieGoal, CreativityLevel } from "../types";
import { Language } from "../i18n";

// Initialize Gemini
// Note: process.env.API_KEY is handled by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The name of the dish." },
    description: { type: Type.STRING, description: "A short, appetizing description of the dish." },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of ingredients with quantities."
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step cooking instructions."
    },
    prepTimeMinutes: { type: Type.INTEGER, description: "Preparation time in minutes." },
    cookTimeMinutes: { type: Type.INTEGER, description: "Cooking time in minutes." },
    difficulty: { type: Type.STRING, description: "Difficulty level (Easy, Medium, Hard)." },
    cuisine: { type: Type.STRING, description: "The cuisine type of the dish." },
    calories: { type: Type.INTEGER, description: "Estimated calories per serving." }
  },
  required: ["title", "description", "ingredients", "instructions", "prepTimeMinutes", "cookTimeMinutes", "difficulty", "cuisine"]
};

// Main schema wrapper to allow array return
const recipeResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      items: recipeItemSchema
    }
  },
  required: ["recipes"]
};

const getLanguageInstruction = (lang: Language): string => {
  switch (lang) {
    case 'zh-HK': return "Respond in Traditional Chinese (Hong Kong Cantonese colloquial style where appropriate for '今日食乜餸').";
    case 'zh-TW': return "Respond in Traditional Chinese (Taiwan style).";
    case 'zh-CN': return "Respond in Simplified Chinese.";
    case 'ja': return "Respond in Japanese.";
    default: return "Respond in English.";
  }
};

const getCalorieInstruction = (goal: CalorieGoal, count: number): string => {
  switch (goal) {
    case CalorieGoal.Light: return "Keep calories under 400kcal per serving. Focus on light, low-fat ingredients.";
    case CalorieGoal.Balanced: return "Keep calories between 400-700kcal per serving. Ensure a good balance of protein, carbs, and fats.";
    case CalorieGoal.BulkUp: return "Ensure high protein and calories (>700kcal). Good for muscle building.";
    case CalorieGoal.Any:
        if (count >= 3) {
            return "Ensure variety in calorie counts: Generate at least one 'Light' (<400kcal), one 'Balanced' (400-700kcal), and one 'Bulk Up' (>700kcal) recipe.";
        }
        return "";
    default: return "";
  }
};

export const generateRecipe = async (
  ingredients: string[], 
  filters: FilterState,
  language: Language
): Promise<Recipe[]> => {
  try {
    const cuisinePrompt = filters.cuisine !== CuisineType.Any ? `Cuisine style: ${filters.cuisine}.` : "Cuisine style: Any.";
    const difficultyPrompt = filters.difficulty !== "Any" ? `Difficulty: ${filters.difficulty}.` : "";
    const timePrompt = filters.maxPrepTime > 0 ? `Maximum total time (prep + cook): ${filters.maxPrepTime} minutes.` : "";
    const caloriePrompt = getCalorieInstruction(filters.calorieGoal, filters.recipeCount);
    const countPrompt = `Generate exactly ${filters.recipeCount} distinct recipe(s).`;
    const languageInstruction = getLanguageInstruction(language);

    // Creativity Logic
    let creativityPrompt = "";
    let temperature = 0.7; // Default balanced

    if (filters.creativity === CreativityLevel.Traditional) {
        creativityPrompt = "Strictly follow traditional, well-established culinary recipes. Do not invent fusion dishes or experimental combinations. Keep it authentic and recognizable.";
        temperature = 0.3; // Lower temperature for more deterministic/standard results
    } else if (filters.creativity === CreativityLevel.Innovative) {
        creativityPrompt = "Be highly creative and innovative. You are encouraged to create unique fusion dishes, modern twists, or interesting new combinations using the ingredients provided.";
        temperature = 0.95; // Higher temperature for more creativity
    }

    const prompt = `
      Create ${filters.recipeCount} unique and delicious recipe(s) using these ingredients: ${ingredients.join(", ")}.
      You may assume the user has basic pantry staples (salt, pepper, oil, water, flour, sugar).
      
      Constraints:
      ${cuisinePrompt}
      ${difficultyPrompt}
      ${timePrompt}
      ${caloriePrompt}
      ${countPrompt}
      ${languageInstruction}
      ${creativityPrompt}

      The output must be a valid JSON object matching the schema.
      Ensure the fields 'title', 'description', 'ingredients', 'instructions', 'difficulty', 'cuisine' are in the requested language.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeResponseSchema,
        temperature: temperature,
      }
    });

    const text = response.text;
    if (!text) return [];

    const parsed = JSON.parse(text);
    
    // Check if recipes exists, otherwise fallback (Gemini might sometimes just return the array if prompted poorly, but schema enforces object with recipes property)
    const recipesArray = parsed.recipes || (Array.isArray(parsed) ? parsed : []);

    return recipesArray.map((r: any) => ({
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      ...r
    }));

  } catch (error) {
    console.error("Error generating recipe:", error);
    return [];
  }
};