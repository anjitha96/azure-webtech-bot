const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios');
require('dotenv').config();

class MyBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;

            try {
                // Azure OpenAI Chat Completions API request
                const response = await axios.post(
                    `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2023-07-01-preview`,
                    {
                        messages: [
                            { role: 'system', content: 'You are a helpful AI assistant.' },
                            { role: 'user', content: userMessage }
                        ]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'api-key': process.env.AZURE_OPENAI_API_KEY
                        }
                    }
                );

                const aiResponse = response.data.choices[0].message.content;

                await context.sendActivity(MessageFactory.text(aiResponse));
            } catch (error) {
                console.error('Error communicating with Azure OpenAI:', error.response?.data || error.message);
                await context.sendActivity("Sorry, something went wrong with the AI response.");
            }

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const welcomeText = 'Hello! I’m your Azure AI chatbot.';
            for (const member of context.activity.membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText));
                }
            }
            await next();
        });
    }
}

module.exports.MyBot = MyBot;
