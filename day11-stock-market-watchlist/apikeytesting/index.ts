const axios = require('axios');

// List of your API keys
const apiKeys = [
  'ctn66r9r01qjlgirh4s0ctn66r9r01qjlgirh4sg',
  'ctnpaj9r01qn483l1jogctnpaj9r01qn483l1jp0',
  'ctnpo4pr01qn483l2do0ctnpo4pr01qn483l2dog',
  'ctnpobhr01qn483l2e80ctnpobhr01qn483l2e8g',
  'ctnpohhr01qn483l2emgctnpohhr01qn483l2en0',
  'ctnpoopr01qn483l2f70ctnpoopr01qn483l2f7g',
  'ctnpovhr01qn483l2fmgctnpovhr01qn483l2fn0',
  'ctnpp61r01qn483l2g50ctnpp61r01qn483l2g5g',
  'ctnppchr01qn483l2gl0ctnppchr01qn483l2glg',
  'ctnppjpr01qn483l2h90ctnppjpr01qn483l2h9g',
  'ctnpprhr01qn483l2hrgctnpprhr01qn483l2hs0',
  'ctnpq21r01qn483l2id0ctnpq21r01qn483l2idg',
  'ctnpq8hr01qn483l2itgctnpq8hr01qn483l2iu0',
  'ctnpqfhr01qn483l2jcgctnpqfhr01qn483l2jd0',
  'ctnpqm9r01qn483l2jsgctnpqm9r01qn483l2jt0',
  'ctod0fhr01qpsuefbl70ctod0fhr01qpsuefbl7g',
  'ctod7q1r01qpsuefc3kgctod7q1r01qpsuefc3l0',
  'ctoe7vpr01qpsuefe750ctoe7vpr01qpsuefe75g',
  'ctoe8a1r01qpsuefe7s0ctoe8a1r01qpsuefe7sg',
  'ctoe8ihr01qpsuefe8f0ctoe8ihr01qpsuefe8fg',
  'ctoe8qhr01qpsuefe920ctoe8qhr01qpsuefe92g',
  'ctoe939r01qpsuefe9lgctoe939r01qpsuefe9m0',
  'ctoe9bpr01qpsuefea90ctoe9bpr01qpsuefea9g',
  'ctoe9mhr01qpsuefeb10ctoe9mhr01qpsuefeb1g',
  'ctoe9v1r01qpsuefebk0ctoe9v1r01qpsuefebkg',
  'ctoea89r01qpsuefec9gctoea89r01qpsuefeca0',
  'ctoeag9r01qpsuefectgctoeag9r01qpsuefecu0',
  'ctoeaq1r01qpsuefedlgctoeaq1r01qpsuefedm0',
  'ctoeb29r01qpsuefee8gctoeb29r01qpsuefee90',
  'ctoeblhr01qpsuefefh0ctoeblhr01qpsuefefhg',
  'ctoebu9r01qpsuefeg60ctoebu9r01qpsuefeg6g',
  'ctoecc1r01qpsuefeh2gctoecc1r01qpsuefeh30',
  'ctoeclhr01qpsuefehogctoeclhr01qpsuefehp0',
  'ctoectpr01qpsuefeic0ctoectpr01qpsuefeicg',
  'ctoed79r01qpsuefej0gctoed79r01qpsuefej10',
  'ctoedf1r01qpsuefejjgctoedf1r01qpsuefejk0',
  'ctoedlpr01qpsuefek30ctoedlpr01qpsuefek3g',
  'ctoedthr01qpsuefekm0ctoedthr01qpsuefekmg',
  'ctoee59r01qpsuefel6gctoee59r01qpsuefel70',
  'ctoeed9r01qpsuefelq0ctoeed9r01qpsuefelqg'
];

// The URL to test
const url = "https://finnhub.io/api/v1/news?category=general";

// Function to test the API keys
async function testApiKeys() {
  const results = [];

  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Finnhub-Token': key
        }
      });

      // Check if the status is 200 (OK)
      if (response.status === 200) {
        results.push({ key, status: 'Working' });
        console.log(`API Key ${key} is Working`);
      } else {
        results.push({ key, status: 'Not Working' });
        console.log(`API Key ${key} is Not Working`);
      }
    } catch (error) {
      // If there is an error (e.g., invalid key)
      results.push({ key, status: 'Not Working' });
      console.log(`API Key ${key} is Not Working`);
    }
  }

  console.log("\nFinal Results:");
  console.log(results);
}

testApiKeys();