import { getOpenAIClient } from '../api/openai';

export const getExpertChatResponse = async (
  message: string, 
  imageBase64?: string
): Promise<string> => {
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
};