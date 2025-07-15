import { PlantAnalysisResult } from './plantAnalysis';

// Mock plant database for when API is unavailable
const mockPlantDatabase: Record<string, PlantAnalysisResult> = {
  // Common houseplants
  'monstera': {
    identification: {
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      confidence: 0.92,
      family: 'Araceae',
      genus: 'Monstera',
      species: 'deliciosa'
    },
    plantInfo: {
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      description: 'Also known as the Swiss Cheese Plant, Monstera deliciosa is a popular tropical houseplant native to Central America. It\'s famous for its large, glossy leaves with distinctive splits and holes (fenestrations) that develop as the plant matures. This climbing plant can grow quite large indoors and is beloved for its dramatic, architectural appearance.',
      careInstructions: {
        watering: 'Water when the top 1-2 inches of soil feel dry, typically every 1-2 weeks. Reduce watering in winter. Ensure good drainage to prevent root rot.',
        light: 'Bright, indirect light. Can tolerate some direct morning sun but avoid harsh afternoon sun which can scorch the leaves.',
        temperature: '65-80°F (18-27°C). Avoid temperatures below 60°F (15°C) and cold drafts.',
        humidity: '50-70% humidity preferred. Use a humidifier, pebble tray, or group with other plants to increase humidity.',
        fertilizer: 'Feed monthly during spring and summer with balanced liquid fertilizer diluted to half strength. No fertilizer needed in winter.',
        soil: 'Well-draining potting mix with good aeration. A mix of peat, perlite, and bark works well.'
      },
      toxicity: {
        toxic: true,
        toxicTo: ['dogs', 'cats', 'children'],
        symptoms: ['mouth irritation', 'difficulty swallowing', 'vomiting', 'drooling'],
        severity: 'moderate'
      },
      growthHabits: {
        size: '6-10 feet tall indoors, 3-4 feet wide',
        growthRate: 'Fast growing in ideal conditions',
        bloomTime: 'Rarely blooms indoors'
      }
    },
    diseaseCheck: {
      hasDisease: false
    }
  },
  
  'snake plant': {
    identification: {
      name: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      confidence: 0.95,
      family: 'Asparagaceae',
      genus: 'Sansevieria',
      species: 'trifasciata'
    },
    plantInfo: {
      name: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      description: 'Also known as Mother-in-Law\'s Tongue, the Snake Plant is one of the most popular and resilient houseplants. Native to West Africa, it features thick, upright leaves with dark green coloration and yellow edges. It\'s renowned for its air-purifying qualities and extreme tolerance to neglect, making it perfect for beginners.',
      careInstructions: {
        watering: 'Water every 2-4 weeks, allowing soil to dry completely between waterings. Water less frequently in winter. Overwatering is the main cause of problems.',
        light: 'Tolerates low to bright indirect light. Can handle some direct sun but not necessary for healthy growth.',
        temperature: '60-80°F (15-27°C). Very tolerant of temperature fluctuations.',
        humidity: 'Average household humidity (30-50%). Very tolerant of dry air.',
        fertilizer: 'Feed once or twice during growing season with diluted liquid fertilizer. Not necessary but promotes growth.',
        soil: 'Well-draining cactus or succulent potting mix. Regular potting soil with added perlite also works.'
      },
      toxicity: {
        toxic: true,
        toxicTo: ['dogs', 'cats'],
        symptoms: ['nausea', 'vomiting', 'diarrhea'],
        severity: 'low'
      },
      growthHabits: {
        size: '2-4 feet tall, 6-12 inches wide',
        growthRate: 'Slow to moderate growth',
        bloomTime: 'Occasionally produces fragrant white flowers'
      }
    },
    diseaseCheck: {
      hasDisease: false
    }
  },

  'pothos': {
    identification: {
      name: 'Golden Pothos',
      scientificName: 'Epipremnum aureum',
      confidence: 0.90,
      family: 'Araceae',
      genus: 'Epipremnum',
      species: 'aureum'
    },
    plantInfo: {
      name: 'Golden Pothos',
      scientificName: 'Epipremnum aureum',
      description: 'One of the most popular trailing houseplants, Golden Pothos is native to the Solomon Islands. It features heart-shaped leaves with golden-yellow variegation and can trail several feet long. It\'s incredibly easy to care for and propagate, earning it the nickname "Devil\'s Ivy" for its resilience.',
      careInstructions: {
        watering: 'Water when top inch of soil feels dry, typically every 1-2 weeks. Can tolerate some drought but grows best with consistent moisture.',
        light: 'Medium to bright indirect light. Can tolerate low light but variegation may fade. Avoid direct sun.',
        temperature: '65-75°F (18-24°C). Tolerates normal household temperatures well.',
        humidity: '40-50% humidity. Adapts to average household humidity but appreciates occasional misting.',
        fertilizer: 'Monthly during spring and summer with balanced liquid fertilizer. Can survive without regular fertilizing.',
        soil: 'Well-draining potting mix. Not picky about soil type as long as it drains well.'
      },
      toxicity: {
        toxic: true,
        toxicTo: ['dogs', 'cats', 'children'],
        symptoms: ['mouth irritation', 'difficulty swallowing', 'vomiting'],
        severity: 'moderate'
      },
      growthHabits: {
        size: 'Trails 6-10 feet long, leaves 2-4 inches',
        growthRate: 'Fast growing',
        bloomTime: 'Rarely blooms indoors'
      }
    },
    diseaseCheck: {
      hasDisease: false
    }
  },

  'peace lily': {
    identification: {
      name: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      confidence: 0.88,
      family: 'Araceae',
      genus: 'Spathiphyllum',
      species: 'wallisii'
    },
    plantInfo: {
      name: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      description: 'Peace Lilies are elegant houseplants native to tropical Americas and southeastern Asia. They\'re known for their glossy dark green leaves and distinctive white flower bracts (spathes) that appear periodically. They\'re excellent air purifiers and relatively easy to care for, making them popular for homes and offices.',
      careInstructions: {
        watering: 'Keep soil consistently moist but not waterlogged. Water when top inch feels slightly dry. They will droop dramatically when thirsty.',
        light: 'Medium to bright indirect light. Can tolerate lower light but may not flower. Avoid direct sunlight.',
        temperature: '65-80°F (18-27°C). Sensitive to cold drafts and temperatures below 60°F.',
        humidity: '40-50% or higher. Benefits from increased humidity, especially in winter.',
        fertilizer: 'Monthly during growing season with balanced liquid fertilizer. Reduce or stop in winter.',
        soil: 'Well-draining potting mix that retains some moisture. Peat-based mixes work well.'
      },
      toxicity: {
        toxic: true,
        toxicTo: ['dogs', 'cats', 'children'],
        symptoms: ['mouth irritation', 'difficulty swallowing', 'vomiting', 'skin irritation'],
        severity: 'moderate'
      },
      growthHabits: {
        size: '1-3 feet tall and wide',
        growthRate: 'Moderate growth rate',
        bloomTime: 'Spring through fall with proper care'
      }
    },
    diseaseCheck: {
      hasDisease: false
    }
  }
};

// Generic fallback for unknown plants
const getGenericPlantInfo = (plantName: string): PlantAnalysisResult => ({
  identification: {
    name: plantName,
    scientificName: 'Species identification pending',
    confidence: 0.75,
    family: 'Plant family unknown',
    genus: 'Genus unknown',
    species: 'Species unknown'
  },
  plantInfo: {
    name: plantName,
    scientificName: 'Species identification pending',
    description: `This appears to be ${plantName}. While we couldn't identify the exact species, here are general care guidelines that work for most houseplants. For specific care instructions, try using our Expert Chat feature with a photo.`,
    careInstructions: {
      watering: 'Water when the top 1-2 inches of soil feel dry. Most plants prefer to dry out slightly between waterings.',
      light: 'Bright, indirect light is ideal for most houseplants. Avoid direct sunlight which can scorch leaves.',
      temperature: '65-75°F (18-24°C) is comfortable for most indoor plants. Avoid cold drafts.',
      humidity: '40-50% humidity is ideal. Use a humidifier or pebble tray if your home is dry.',
      fertilizer: 'Feed monthly during spring and summer with balanced liquid fertilizer. Reduce or stop in winter.',
      soil: 'Well-draining potting mix. Most houseplants prefer soil that drains well but retains some moisture.'
    },
    toxicity: {
      toxic: false,
      toxicTo: [],
      symptoms: [],
      severity: 'low'
    },
    growthHabits: {
      size: 'Variable size depending on species',
      growthRate: 'Growth rate varies by species',
      bloomTime: 'Flowering depends on species and care'
    }
  },
  diseaseCheck: {
    hasDisease: false
  }
});

export const getMockPlantData = (searchTerm: string): PlantAnalysisResult => {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // Check for exact matches first
  if (mockPlantDatabase[normalizedSearch]) {
    return mockPlantDatabase[normalizedSearch];
  }
  
  // Check for partial matches
  for (const [key, data] of Object.entries(mockPlantDatabase)) {
    if (normalizedSearch.includes(key) || key.includes(normalizedSearch)) {
      return data;
    }
  }
  
  // Check scientific names
  for (const data of Object.values(mockPlantDatabase)) {
    const scientificLower = data.identification.scientificName.toLowerCase();
    if (scientificLower.includes(normalizedSearch) || normalizedSearch.includes(scientificLower)) {
      return data;
    }
  }
  
  // Return generic info if no match found
  return getGenericPlantInfo(searchTerm);
};

// Mock data for photo analysis (simulates AI vision analysis)
export const getMockPhotoAnalysis = (): PlantAnalysisResult => {
  // Randomly select from our database for demo purposes
  const plants = Object.values(mockPlantDatabase);
  const randomPlant = plants[Math.floor(Math.random() * plants.length)];
  
  // Slightly reduce confidence for photo analysis
  return {
    ...randomPlant,
    identification: {
      ...randomPlant.identification,
      confidence: Math.max(0.7, randomPlant.identification.confidence - 0.1)
    }
  };
};