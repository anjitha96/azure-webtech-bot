// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check

const { ActivityHandler, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${ context.activity.text }`;
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const welcomeText = 'Hello and welcome!';
            await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
