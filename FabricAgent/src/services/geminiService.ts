
import { GoogleGenAI, Chat } from "@google/genai";

// Ensure you have your API key set in your environment variables
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || " " });

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: 'You are FabricAgent AI, a helpful assistant specializing in Microsoft Fabric, Power BI, DAX, data modeling, and AI governance. Be concise, helpful, and provide code examples when relevant.',
  },
});


export async function* streamChatResponse(message: string): AsyncGenerator<string> {
    if (!apiKey) {
        yield "Error: Gemini API key is not configured. Please set the `API_KEY` environment variable.";
        return;
    }

    try {
        const result = await chat.sendMessageStream({ message });

        for await (const chunk of result) {
            yield chunk.text;
        }

    } catch (error) {
        console.error("Error in streamChatResponse:", error);
        yield "An error occurred while communicating with the AI. Please check the console for details.";
    }
}
