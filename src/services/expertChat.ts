import { getOpenAIClient } from '../api/openai';

export const getExpertChatResponse = async (
  message: string, 
  imageBase64?: string
): Promise<string> => {
  try {
    const client = getOpenAIClient();
  
  const messages: any[] = [
    {
      role: "system",
      content: "You are an expert botanist and plant care specialist. Provide detailed, accurate, and helpful advice. If you see plant diseases or issues, mention them and provide treatment recommendations."
    }
  ];

  if (imageBase64) {
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: message
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${imageBase64}`
          }
        }
      ]
    });
  } else {
    messages.push({
      role: "user",
      content: message
    });
  }
  
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    max_tokens: 2048,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "I'm sorry, I'm having trouble responding right now. Please try again.";
  
  } catch (apiError) {
    console.warn('Expert chat API unavailable:', apiError);
    
    // Provide helpful mock responses based on common questions
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('water')) {
      return "Most houseplants prefer to dry out slightly between waterings. Check the soil with your finger - if the top 1-2 inches feel dry, it's time to water. Overwatering is more harmful than underwatering for most plants.";
    } else if (lowerMessage.includes('light')) {
      return "Most houseplants thrive in bright, indirect light. This means near a window but not in direct sunlight, which can scorch leaves. If your plant is getting leggy or losing color, it may need more light.";
    } else if (lowerMessage.includes('yellow')) {
      return "Yellow leaves can indicate several issues: overwatering (most common), underwatering, too much direct sun, or natural aging. Check your watering routine first, and ensure the plant has proper drainage.";
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('bug')) {
      return "Common indoor plant pests include aphids, spider mites, and scale insects. Try wiping leaves with a damp cloth, increase humidity, and isolate affected plants. Neem oil or insecticidal soap can help with persistent infestations.";
    } else {
      return "I'm currently running in demo mode. For specific plant care questions, I recommend checking our Plant Disease Guide or Light Tracker in the More tab. You can also try searching for your plant using the Manual Entry feature for detailed care instructions.";
    }
  }
};