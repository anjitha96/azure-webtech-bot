// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const restify = require('restify');
const { CloudAdapter, ConfigurationBotFrameworkAuthentication } = require('botbuilder');

// Import your custom bot
const { ChatBot } = require('./bot'); // Make sure you exported `ChatBot` from bot.js

// Create HTTP server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening at ${server.url}`);
    console.log('\nBot is running. Open Bot Framework Emulator to test.');
});

// Set up authentication
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType || '',
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId || ''
});

// Create adapter
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Error handler
adapter.onTurnError = async (context, error) => {
    console.error(`\n[onTurnError] unhandled error: ${error}`);
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );
    await context.sendActivity('Oops! Something went wrong.');
};

// Create your bot instance
const myBot = new ChatBot();

// Handle incoming messages
server.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, (context) => myBot.run(context));
});

// Handle WebSocket connections for streaming
server.on('upgrade', async (req, socket, head) => {
    const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);
    streamingAdapter.onTurnError = adapter.onTurnError;
    await streamingAdapter.process(req, socket, head, (context) => myBot.run(context));
});
