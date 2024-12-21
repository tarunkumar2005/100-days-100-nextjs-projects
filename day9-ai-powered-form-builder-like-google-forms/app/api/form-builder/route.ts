import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { APIResponse } from '@/types/form';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `You are an AI assistant helping to build a form. Interpret the user's request and respond with a JSON object containing an array of actions to take and the relevant details. Possible actions include: createForm, addField, editLabel, addPlaceholder, setValidation, addOptions, reorderFields, deleteField, addSection, enableField, disableField, setConditionalLogic, changeTheme, customizeStyles, changeFormName. Field types are: text, checkbox, radio, dropdown, file, date, time, number, range, section. For field-related actions, include the full field object with all relevant properties. For form-wide actions, include the formName. For reordering, provide clear instructions in the reorderInstructions property. For theme changes, specify 'light' or 'dark' in the themeChoice property. For style customization, provide a customStyles object with CSS-like properties. IMPORTANT: Respond ONLY with the JSON object, without any additional text or formatting.`;

function stripMarkdown(text: string): string {
  return text.replace(/\`\`\`json\s*|\s*\`\`\`/gi, '').trim();
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will respond with JSON objects containing arrays of actions only." }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const response = await result.response;
    const responseText = response.text();

    const strippedResponse = stripMarkdown(responseText);
    console.log('Stripped response:', strippedResponse);

    let parsedResponse: { actions: APIResponse[] };
    try {
      parsedResponse = JSON.parse(strippedResponse);
    } catch {
      console.error('Failed to parse Gemini response as JSON:', strippedResponse);
      return NextResponse.json({ error: 'Invalid response from AI', rawResponse: strippedResponse }, { status: 500 });
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error in form-builder API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}