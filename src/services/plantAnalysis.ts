import { getOpenAIClient } from '../api/openai';
import { getMockPhotoAnalysis } from './mockPlantData';
import { apiRateLimiter } from '../utils/rateLimiter';

export interface PlantAnalysisResult {
  identification: {
    name: string;
    scientificName: string;
    confidence: number;
    family?: string;
    genus?: string;
    species?: string;
  };
  plantInfo: {
    name: string;
    scientificName: string;
    description: string;
    careInstructions: {
      watering: string;
      light: string;
      temperature: string;
      humidity: string;
      fertilizer: string;
      soil: string;
    };
    toxicity: {
      toxic: boolean;
      toxicTo: string[];
      symptoms: string[];
      severity: 'low' | 'moderate' | 'high';
    };
    growthHabits: {
      size: string;
      growthRate: string;
      bloomTime?: string;
    };
  };
  diseaseCheck: {
    hasDisease: boolean;
    diseaseInfo?: {
      name: string;
      description: string;
      symptoms: string[];
      treatment: string[];
      prevention: string[];
      severity: 'mild' | 'moderate' | 'severe';
      commonCauses: string[];
    };
  };
}

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysisResult> => {
  try {
    // Check rate limiter
    if (!apiRateLimiter.canMakeRequest()) {
      console.warn('Rate limit hit, using mock data');
      return getMockPhotoAnalysis();
    }

    const client = getOpenAIClient();
    
    const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a plant identification expert. Analyze this plant image and respond with ONLY a valid JSON object (no additional text, no markdown formatting, no code blocks). Use this exact structure:

{
  "identification": {
    "name": "Common plant name",
    "scientificName": "Scientific name",
    "confidence": 0.85,
    "family": "Plant family",
    "genus": "Genus",
    "species": "Species"
  },
  "plantInfo": {
    "name": "Common plant name",
    "scientificName": "Scientific name", 
    "description": "Detailed plant description",
    "careInstructions": {
      "watering": "Water when soil is dry, typically every 7-10 days",
      "light": "Bright indirect light",
      "temperature": "65-75°F (18-24°C)",
      "humidity": "40-60% humidity",
      "fertilizer": "Monthly during growing season",
      "soil": "Well-draining potting mix"
    },
    "toxicity": {
      "toxic": false,
      "toxicTo": [],
      "symptoms": [],
      "severity": "low"
    },
    "growthHabits": {
      "size": "Medium sized plant",
      "growthRate": "Moderate",
      "bloomTime": "Spring to summer"
    }
  },
  "diseaseCheck": {
    "hasDisease": false,
    "diseaseInfo": null
  }
}

If disease is detected, include diseaseInfo object with name, description, symptoms array, treatment array, prevention array, severity, and commonCauses array.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
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
        name: result.identification?.name || 'Unknown Plant',
        scientificName: result.identification?.scientificName || 'Unknown species',
        confidence: result.identification?.confidence || 0.5,
        family: result.identification?.family,
        genus: result.identification?.genus,
        species: result.identification?.species,
      },
      plantInfo: {
        name: result.plantInfo?.name || result.identification?.name || 'Unknown Plant',
        scientificName: result.plantInfo?.scientificName || result.identification?.scientificName || 'Unknown species',
        description: result.plantInfo?.description || 'Unable to provide detailed description.',
        careInstructions: {
          watering: result.plantInfo?.careInstructions?.watering || 'Water when soil feels dry',
          light: result.plantInfo?.careInstructions?.light || 'Bright indirect light',
          temperature: result.plantInfo?.careInstructions?.temperature || '65-75°F (18-24°C)',
          humidity: result.plantInfo?.careInstructions?.humidity || 'Average household humidity',
          fertilizer: result.plantInfo?.careInstructions?.fertilizer || 'Monthly during growing season',
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
        hasDisease: result.diseaseCheck?.hasDisease || false,
        diseaseInfo: result.diseaseCheck?.diseaseInfo || undefined
      }
    };
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Raw response:', content);
    throw new Error('Failed to parse AI response');
  }
  
  } catch (apiError) {
    console.warn('API unavailable, using mock data for demo:', apiError);
    // Return mock data when API is unavailable
    return getMockPhotoAnalysis();
  }
};