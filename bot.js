// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check

const { ActivityHandler, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text.toLowerCase();

            if (userMessage.includes("hello")) {
                await context.sendActivity("Hi there! How can I help you today?");
            } else if (userMessage.includes("help")) {
                await context.sendActivity("Sure! I can assist you with billing, support, or general inquiries.");
            } else {
                await context.sendActivity("Sorry, I didn’t understand that. Can you rephrase?");
            }

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const welcomeText = 'Hello and welcome!';
            const membersAdded = context.activity.membersAdded ?? [];
            for (let i = 0; i < membersAdded.length; ++i) {
                if (membersAdded[i].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
