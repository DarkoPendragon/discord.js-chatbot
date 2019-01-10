# A Discord.js Chat Bot
This is a simple chatbot for Discord.js clients using the [cleverbot.io API](https://cleverbot.io/). If you need help or just want to chat, feel free to [join the discord server](https://discordapp.com/invite/FKYrX4X).    

# Installation
1. Get your API User and Key from https://cleverbot.io/keys
2. Have a [Discord app](https://discordapp.com/developers/applications/) setup and a bot token
2. In your working directory: `npm i discord.js-chatbot --save`

# Basic Usage
```js
// First we require the Discord.js library.
const Discord = require("discord.js");

// Now we make a new Discord.js Client.
const client = new Discord.Client();

// Lets put the chat bot data in the client for easier usage.
client.chat = require("./index.js");

// Now, we start the chatbot!
// Make sure your credentials are correct.
// cleverUser, cleverKey and cleverNick are all required options.
client.chat.ChatBot(client, {
  cleverUser: "cleverbot.io/keys user",
  cleverKey: "cleverbot.io/keys key",
  // cleverNick will be the session the bot uses from cleverbot.io.
  // This can be whatever you like.
  cleverNick: "session name"
});

// Now we login with the actual bot!
client.login("<super secret bot token here>")

```

# Options
There are a few other options you can pass as well. However, these are not needed.  

| Option | Type | Default | Description |  
| --- | --- | --- | --- |
| watchMention | Boolean | true | Whether or not to watch for messages starting with the clients mention. |
| watchName | Boolean | true | Whether or not to watch for messages starting with the clients username. |
| enableTyping | Boolean | true | Whether or not to send typing requests while fetching a response from cleverbot. |
| ignoredServers | Array | [ ] | An Array of sever ID's to ignore from the chat bot. |
| ignoredChannels | Array | [ ] | An array of channel ID's to ignore from the chat bot. |


# Custom Options Example
```js
const Discord = require("discord.js");
const client = new Discord.Client();
client.chat = require("./index.js");

client.chat.ChatBot(client, {
  cleverUser: "cleverbot.io/keys user",
  cleverKey: "cleverbot.io/keys key",
  cleverNick: "session name",
  enableTyping: false,
  ignoredServers: ["427239929924288532"],
  ignoredChannels: ["441425044351090689", "441393041824022528"],
  watchName: false,
  watchMention: false
  // I put those both to false for show, actually doing this will result in an error.
});

client.login("<super secret bot token here>")
```
