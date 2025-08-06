const { ActivityHandler } = require('botbuilder');
const { getAIResponse } = require('./openaiService'); // uses Azure SDK

class EchoBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;

            try {
                const aiReply = await getAIResponse(userMessage);
                await context.sendActivity(aiReply);
            } catch (error) {
                console.error('Azure OpenAI Error:', error.message);
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
