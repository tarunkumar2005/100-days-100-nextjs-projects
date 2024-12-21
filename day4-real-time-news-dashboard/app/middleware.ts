import axios from 'axios';

// Define your API list in the environment variables
const apiKeys = [
  process.env.WORLD_NEWS_API_KEY1!,
  process.env.WORLD_NEWS_API_KEY2!,
  process.env.WORLD_NEWS_API_KEY3!,
  process.env.WORLD_NEWS_API_KEY4!,
  process.env.WORLD_NEWS_API_KEY5!,
].filter(Boolean); // Remove any undefined keys

// Middleware to test if the API is working
const testApi = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await axios.get('https://api.worldnewsapi.com/top-news', {
      params: {
        "api-key": apiKey,
        "source-country": 'in',
        "language": 'en',
      },
      timeout: 5000, // Set a timeout to avoid hanging
    });

    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error with API key ${apiKey}:`, error.response?.data || error.message);
    } else {
      console.error(`Error with API key ${apiKey}:`, error);
    }
    return false;
  }
};

// Function to get a working API key
export const getWorkingApiKey = async (): Promise<string | null> => {
  for (const apiKey of apiKeys) {
    console.log(`Testing API key ${apiKey}...`);
    const isWorking = await testApi(apiKey);
    if (isWorking) {
      return apiKey;
    }
  }

  console.error('No working API key found');
  return null;
};