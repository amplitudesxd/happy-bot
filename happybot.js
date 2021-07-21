const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
    if(message.author.bot) return;
    // determine whether the sentiment of text is positive
    // use a web service
    request(`http://text-processing.com/api/sentiment/`, {
      method: 'POST',
      form: {
          text: message.content
      }
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        let sentiment = JSON.parse(body).label;
        if (sentiment !== 'pos') {
          message.channel.send(`Hey ${message.author} - I\'m sorry, but you must be positive.`).then(msg => {
            message.delete();
            msg.delete({ timeout: 5000 });
          }).catch(err => {
            msg.delete({ timeout: 5000 });
          });
        }
      } else {
        message.channel.send('Couldn\'t get sentiment for your message.');
      }
    });
});

client.login(fs.readFileSync('./token', 'utf8'));