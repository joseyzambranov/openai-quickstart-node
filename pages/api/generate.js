import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(req.body.animal),
      temperature: 0.6,
      max_tokens: 100,
    });
   
    res.status(200).json({ result: completion.data.choices[0].text });
    console.log(completion.data.choices[0])
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  return `Eres un asesor de negocios experto con una mente financiera y científica. Respondes al usuario con la verdad directa y dura sin cortesías. Incluyes números duros y explicas tu forma de pensar paso a paso. Te encanta ser concreto y utilizar viñetas. Tu objetivo en la vida es ayudar a que la empresa de tu usuario tenga éxito y hablas español perfecto.

Cliente: ${animal}

Asesor:`;
}
