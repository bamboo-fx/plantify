import { getOpenAIClient } from '../api/openai';
import { PlantAnalysisResult } from './plantAnalysis';
import { getMockPlantData } from './mockPlantData';
import { apiRateLimiter } from '../utils/rateLimiter';

export const analyzeManualPlantEntry = async (plantName: string): Promise<PlantAnalysisResult> => {
  try {
    // Check rate limiter
    if (!apiRateLimiter.canMakeRequest()) {
      console.warn('Rate limit hit, using mock data for:', plantName);
      return getMockPlantData(plantName);
    }

    const client = getOpenAIClient();
    
    const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `You are a plant identification expert. I'm looking for information about "${plantName}". Please provide detailed plant information in JSON format with the following exact structure (no additional text, no markdown formatting, no code blocks):

{
  "identification": {
    "name": "Common plant name",
    "scientificName": "Scientific name",
    "confidence": 0.95,
    "family": "Plant family",
    "genus": "Genus",
    "species": "Species"
  },
  "plantInfo": {
    "name": "Common plant name",
    "scientificName": "Scientific name", 
    "description": "Detailed plant description including appearance, origin, and characteristics",
    "careInstructions": {
      "watering": "Detailed watering instructions with frequency",
      "light": "Light requirements (bright indirect, full sun, etc.)",
      "temperature": "Ideal temperature range in °F and °C",
      "humidity": "Humidity requirements and tips",
      "fertilizer": "Fertilizer type and schedule",
      "soil": "Soil type and drainage requirements"
    },
    "toxicity": {
      "toxic": true/false,
      "toxicTo": ["dogs", "cats", "children", "horses"],
      "symptoms": ["symptom1", "symptom2"],
      "severity": "low/moderate/high"
    },
    "growthHabits": {
      "size": "Mature size (height x width)",
      "growthRate": "Growth rate (slow/moderate/fast)",
      "bloomTime": "Blooming season if applicable"
    }
  },
  "diseaseCheck": {
    "hasDisease": false,
    "diseaseInfo": null
  }
}

If the plant name is unclear or you cannot identify it with confidence, set confidence to a lower value and provide the best match with a note in the description. Always provide complete care instructions even for common plants.`
      }
    ],
    max_tokens: 2048,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content || '';
  
  // Clean and parse the JSON response
  let cleanedResponse = content.trim();
  
  // Remove any markdown code blocks
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  // Try to find JSON object in the response
  const jsonStart = cleanedResponse.indexOf('{');
  const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
  
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
  }

  try {
    const result = JSON.parse(cleanedResponse);
    
    // Validate and provide defaults
    return {
      identification: {
        name: result.identification?.name || plantName,
        scientificName: result.identification?.scientificName || 'Unknown species',
        confidence: result.identification?.confidence || 0.8,
        family: result.identification?.family,
        genus: result.identification?.genus,
        species: result.identification?.species,
      },
      plantInfo: {
        name: result.plantInfo?.name || result.identification?.name || plantName,
        scientificName: result.plantInfo?.scientificName || result.identification?.scientificName || 'Unknown species',
        description: result.plantInfo?.description || 'Plant information provided based on name lookup.',
        careInstructions: {
          watering: result.plantInfo?.careInstructions?.watering || 'Water when soil feels dry to touch',
          light: result.plantInfo?.careInstructions?.light || 'Bright indirect light',
          temperature: result.plantInfo?.careInstructions?.temperature || '65-75°F (18-24°C)',
          humidity: result.plantInfo?.careInstructions?.humidity || 'Average household humidity (40-60%)',
          fertilizer: result.plantInfo?.careInstructions?.fertilizer || 'Monthly during growing season with balanced fertilizer',
          soil: result.plantInfo?.careInstructions?.soil || 'Well-draining potting soil'
        },
        toxicity: {
          toxic: result.plantInfo?.toxicity?.toxic || false,
          toxicTo: result.plantInfo?.toxicity?.toxicTo || [],
          symptoms: result.plantInfo?.toxicity?.symptoms || [],
          severity: result.plantInfo?.toxicity?.severity || 'low'
        },
        growthHabits: {
          size: result.plantInfo?.growthHabits?.size || 'Variable size',
          growthRate: result.plantInfo?.growthHabits?.growthRate || 'Moderate',
          bloomTime: result.plantInfo?.growthHabits?.bloomTime
        }
      },
      diseaseCheck: {
        hasDisease: false,
        diseaseInfo: undefined
      }
    };
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Raw response:', content);
    throw new Error('Failed to parse plant information response');
  }
  
  } catch (apiError) {
    console.warn('API unavailable, using mock data for demo:', apiError);
    // Return mock data when API is unavailable
    return getMockPlantData(plantName);
  }
};