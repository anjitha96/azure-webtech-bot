// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check

const { ActivityHandler, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            const text = context.activity.text.toLowerCase();

            let reply = "I'm not sure I understand.";

            if (text.includes('hello') || text.includes('hi')) {
                reply = 'Hello! How can I help you today?';
            } else if (text.includes('price')) {
                reply = 'Our pricing depends on the service. Please visit the pricing page.';
            } else if (text.includes('support')) {
                reply = 'You can reach our support at support@example.com.';
            }

            await context.sendActivity(MessageFactory.text(reply, reply));
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded ?? [];
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
