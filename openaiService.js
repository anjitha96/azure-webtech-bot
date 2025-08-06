// openaiService.js

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient(
  process.env.OPENAI_API_BASE,
  new AzureKeyCredential(process.env.OPENAI_API_KEY)
);

async function getAIResponse(prompt) {
  const deploymentId = process.env.OPENAI_DEPLOYMENT_ID;

  const response = await client.getChatCompletions(deploymentId, [
    { role: "user", content: prompt }
  ]);

  return response.choices[0].message.content;
}

module.exports = { getAIResponse };
