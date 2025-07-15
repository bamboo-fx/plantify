export interface PlantIdentification {
  id: string;
  name: string;
  scientificName: string;
  commonNames: string[];
  confidence: number;
  imageUri: string;
  createdAt: Date;
  family?: string;
  genus?: string;
  species?: string;
}

export interface PlantInfo {
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
    symptoms?: string[];
    severity: 'low' | 'moderate' | 'high';
  };
  growthHabits: {
    size: string;
    growthRate: string;
    bloomTime?: string;
  };
  images?: string[];
}

export interface PlantDisease {
  name: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  severity: 'mild' | 'moderate' | 'severe';
  commonCauses: string[];
}

export interface UserPlant {
  id: string;
  identificationId: string;
  nickname?: string;
  location: string;
  dateAdded: Date;
  lastWatered?: Date;
  nextWateringDue?: Date;
  wateringFrequency: number; // days
  notes: string[];
  photos: string[];
  healthStatus: 'healthy' | 'needs-attention' | 'sick';
}

export interface WateringReminder {
  id: string;
  plantId: string;
  plantName: string;
  dueDate: Date;
  completed: boolean;
  frequency: number;
}

export interface ExpertChatMessage {
  id: string;
  role: 'user' | 'expert';
  content: string;
  timestamp: Date;
  imageUri?: string;
}