const axios = require("axios");

this.onMessage(async (context, next) => {
    const userInput = context.activity.text;

    const endpoint = "https://web-ai-bot.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-02-15-preview";
    const apiKey = "7ioim5GAzOx4d1yeFVFDaLaPvhP3ub0QNjmHGVYuw9TDKe4gPrYLJQQJ99BHACYeBjFXJ3w3AAABACOGa6bJ";

    try {
        const response = await axios.post(endpoint,
            {
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: userInput }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": apiKey
                }
            }
        );

        const botReply = response.data.choices[0].message.content;
        await context.sendActivity(botReply);
    } catch (error) {
        console.error("Error from Azure OpenAI:", error.response?.data || error.message);
        await context.sendActivity("Sorry, something went wrong with AI.");
    }

    await next();
});
