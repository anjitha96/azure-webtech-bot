const axios = require('axios');

this.onMessage(async (context, next) => {
  const userInput = context.activity.text;

  // Call Azure OpenAI
  const response = await axios.post(
    'https://<your-resource-name>.openai.azure.com/openai/deployments/<your-deployment-id>/chat/completions?api-version=2024-02-15-preview',
    {
      messages: [{ role: 'user', content: userInput }],
      temperature: 0.7
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': '<your-api-key>'
      }
    }
  );

  const reply = response.data.choices[0].message.content;
  await context.sendActivity(reply);
  await next();
});
