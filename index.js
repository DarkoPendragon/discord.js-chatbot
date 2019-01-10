const Discord = require("discord.js");
const request = require("request");
const PACKAGE = require("./package.json");

exports.ChatBot = (client, options) => {
  if (!options.cleverUser || !options.cleverKey || !options.cleverNick) {
    console.error(new Error("missing parameters to start bot"));
    process.exit(1);
  };
  if (options.watchMention == false && options.watchName == false) {
    console.error(new Error("watchMention or watchName must be enabled to run the chat bot"));
    process.exit(1);
  }
  
  class ChatBot {
    constructor(client, options) {
      this.cleverUser = (options && options.cleverUser) || null;
      this.cleverKey = (options && options.cleverKey) || null;
      this.cleverNick = (options && options.cleverNick) || null;
      this.watchMention = (options && options.watchMention) || true;
      this.watchName = (options && options.watchName) || true;
      this.enableTyping = (options && options.enableTyping) || true;
      this.ignoredChannels = (options && options.ignoredChannels) || [];
      this.ignoredServers = (options && options.ignoredServers) || [];
      this.client = client;
      this.passedOptions = options;
    };

    sessionNick(value) {
      if (!value) return this.cleverNick;
      this.cleverNick = value;
    }

    makeSession() {
      return new Promise((resolve, reject) => {
        request.post({
          url: "https://cleverbot.io/1.0/create",
          form: {
            user: this.cleverUser,
            key: this.cleverKey,
            nick: this.cleverNick
          }
        }, function(err, httpResponse, body) {
          try {
            if (err) reject(err);
            const parsed = JSON.parse(body);
            if (typeof parsed.status == undefined || parsed.status !== "success") {
              if (parsed.status == "Error: reference name already exists") resolve(this.cleverNick)
              reject(parsed.status);
            } else if (parsed.status == "success") {
              this.cleverNick = JSON.parse(body).nick;
              resolve(this.cleverNick);
            } else {
              reject(parsed.status);
            };
          } catch (e) {
            reject(e);
          };
        });
      });
    };

    chat(query) {
      return new Promise((resolve, reject) => {
        if (!query) reject(new Error("no text provided to query"));
        request.post({
          url: "https://cleverbot.io/1.0/ask",
          form: {
            user: this.cleverUser,
            key: this.cleverKey,
            nick: this.cleverNick,
            text: query
          }
        }, function(err, httpResponse, body) {
          try {
            if (err) reject(err);
            const parsed = JSON.parse(body);
            if (parsed.status !== "success") reject(parsed.status);
            if (!parsed.response) reject(new Error(`no response recived`));
            resolve(parsed.response);
          } catch (e) {
            reject(e);
          };
        });
      });;
    };
  };

  var chatbot = new ChatBot(client, options);
  chatbot.makeSession().then((res) => {
    if (res !== undefined) console.log(`cleverbot.io session created: ${res}`);
  }).catch((res) => {
    console.error(res);
  });
  exports.ChatBot = chatbot;
  exports.makeSession = chatbot.makeSession;
  exports.chat = chatbot.chat;

  client.on("ready", () => {
    console.log(`=--------------------------=\nChatBot Online.\nNode.js: ${process.version}\nVersion: ${PACKAGE.version}\n=--------------------------=`);
  });

  client.on("message", (msg) => {
    if (msg.author.bot) return;
    if (chatbot.ignoredServers.includes(msg.guild.id) || chatbot.ignoredChannels.includes(msg.channel.id)) return;
    if (chatbot.watchName && msg.content.toLowerCase().startsWith(msg.client.user.username)) {
      if (chatbot.enableTyping) msg.channel.startTyping(99);
      chatbot.chat(msg.content).then((res) => {
        if (chatbot.enableTyping) msg.channel.stopTyping(true);
        msg.reply(res);
      }).catch((res) => {
        if (chatbot.enableTyping) msg.channel.stopTyping(true);
        msg.channel.send("Something went wrong, try again in a bit!");
        console.error(`[${msg.guild.name}]` + res);
      });
    } else if (chatbot.watchMention && msg.content.toLowerCase().startsWith(`<@!${msg.client.user.id}>`) || msg.content.toLowerCase().startsWith(`<@${msg.client.user.id}>`)) {
      if (chatbot.enableTyping) msg.channel.startTyping(99);
      chatbot.chat(msg.content).then((res) => {
        if (chatbot.enableTyping) msg.channel.stopTyping(true);
        msg.reply(res);
      }).catch((res) => {
        if (chatbot.enableTyping) msg.channel.stopTyping(true);
        msg.channel.send("Something went wrong, try again in a bit!");
        console.error(`[${msg.guild.name}]` + res);
      });
    };
  })
};
