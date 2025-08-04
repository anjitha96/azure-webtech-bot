const { ActivityHandler } = require('botbuilder');
const axios = require('axios');

const API_KEY = process.env.AZURE_OPENAI_KEY;
const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT; // ends with '/openai/deployments/<deployment>/chat/completions?api-version=2023-07-01-preview'
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;

            const headers = {
                'Content-Type': 'application/json',
                'api-key': API_KEY,
            };

            const azureOpenAIEndpoint = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=2023-07-01-preview`;

            const data = {
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 1000,
            };

            try {
                const response = await axios.post(azureOpenAIEndpoint, data, { headers });
                const reply = response.data.choices[0].message.content;
                await context.sendActivity(reply);
            } catch (error) {
                console.error('Azure OpenAI error:', error.response?.data || error.message);
                await context.sendActivity('Sorry, something went wrong with the AI response.');
            }

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const welcomeText = 'Hello! I’m your Azure AI chatbot.';
            for (const member of context.activity.membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(welcomeText);
                }
            }
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
