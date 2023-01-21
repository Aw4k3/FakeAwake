// @ts-check

const Discord = require('discord.js');
const Random = require('../../include/Random.js');
const Status = require('../../include/Status.js');

var instances = [];

class Card {
    suit = null;
    worth = 0;

    SUITS = [
       "♣", // Clubs
       "♠", // Spades
       "♥", // Hearts
       "♦️" // Diamonds
    ];

    WORTHS = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "Jack",
        "Queen",
        "King"
    ];

    Roll() {
        this.suit = this.SUITS[Random.RandInt(0, this.SUITS.length)];
        this.worth = Random.RandInt(0, this.WORTHS.length) + 1;
    }

    GetStringFormat() {
        return `${this.WORTHS[this.worth - 1]}${this.suit}`;
    }

    constructor() {
        this.Roll();
    }
}

class Hand {
    cards = [new Card() ];
    total_worth = 0;

    DrawCard() {
        while (true) {
            var card = new Card();
            if (!this.cards.includes(card)) {
                this.cards.push(card);
                break;
            }
        }

        this.total_worth = 0;
        for (var card of this.cards) this.total_worth += card.worth;
    }

    GetStringFormat() {
        var result = [];
        for (var card of this.cards) result.push(card.GetStringFormat());
        return result.join("\n");
    }

    constructor() {
        this.total_worth = 69;
        while (this.total_worth > 21) {
            this.cards = [];
            this.DrawCard();
            this.DrawCard();
        }
    }
}

class Player {
    hand = new Hand();
    bust = false;
    stand = false;
    fold = false;
    winable = true;
    user = null;

    Hit() {
        this.hand.DrawCard();
        if (this.hand.total_worth > 21) {
            this.bust = true;
            this.winable = false;
        }
    }

    Stand() {
        this.stand = true;
    }

    Fold() {
        this.fold = true;
        this.winable = false;
    }

    constructor(user) {
        this.user = user;
    }
}

class Instance {
    id = Random.RandHex();
    message = null;
    players = [];

    stats = [
        {
            name: "",
            value: "",
            inline: true
        },
        {
            name: "",
            value: "",
            inline: true
        }
    ];

    embed = new Discord.MessageEmbed()
        .setTitle(`Blackjack | Instance ID: ${this.id}`)
        .setColor(Status.StatusColor('OK'))
        .setFooter(`pee pee poo poo`);

    buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('hit')
                .setLabel('Hit')
                .setStyle('PRIMARY'),
            new Discord.MessageButton()
                .setCustomId('stand')
                .setLabel('Stand')
                .setStyle('PRIMARY'),
            new Discord.MessageButton()
                .setCustomId('fold')
                .setLabel('Fold')
                .setStyle('DANGER')
    );

    DisableButtons() {
        this.buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('hit')
                    .setLabel('Hit')
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                new Discord.MessageButton()
                    .setCustomId('stand')
                    .setLabel('Stand')
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                new Discord.MessageButton()
                    .setCustomId('fold')
                    .setLabel('Fold')
                    .setStyle('DANGER')
                    .setDisabled(true)
            );
    }

    FakeAwakesTurn() {
        while (true) {
            var value = Random.RandInt(0, 101);

            if (value < 91) {
                this.players[1].Hit();
                if (this.players[1].bust) {
                    this.stats[1].value = `${this.players[1].hand.GetStringFormat()}\n[BUSTED]`;
                    break;
                } else {
                    this.stats[1].value = this.players[1].hand.GetStringFormat();
                }
            } else {
                this.players[1].Stand();
                this.stats[1].value = `${this.players[1].hand.GetStringFormat()}\n[STAND]`;
                break;
            }
        }

        this.CompareAndDisplayScore();
    }

    CompareAndDisplayScore(message) {
        for (var i = 0; i < this.stats.length; i++) {
            this.stats[i].name = `${this.players[i].user.username}'s Hand (${this.players[i].hand.total_worth})`;
            this.stats[i].value = this.players[i].hand.GetStringFormat();
        }

        if (this.players[0].hand.total_worth > this.players[1].hand.total_worth && this.players[0].winable) this.embed.setDescription(`${this.players[0].user} is the winner!`);
        else if (this.players[1].hand.total_worth > this.players[0].hand.total_worth && this.players[1].winable) this.embed.setDescription(`${this.players[1].user} is the winner!`);
        else this.embed.setDescription(`No one is the winner! You both suck gg :)`);

        this.message.edit({ embeds: [this.embed], components: [this.buttons] });
    }

    constructor(message, client) {
        this.players = [new Player(message.author), new Player(client.user)];

        for (var i = 0; i < this.stats.length; i++) {
            this.stats[i].name = `${this.players[i].user.username}'s Hand`;
            this.stats[i].value = this.players[i].hand.GetStringFormat();
        }

        this.embed.setFields(this.stats);

        message.channel.send({ embeds: [this.embed], components: [this.buttons] }).then(message => this.message = message);

        client.on('interactionCreate', interaction => {
            if (interaction.customId === "hit") {
                this.players[0].Hit();
                if (this.players[0].bust) {
                    this.stats[0].value = `${this.players[0].hand.GetStringFormat()}\n[BUSTED]`;
                    this.DisableButtons();
                    this.FakeAwakesTurn();
                } else {
                    this.stats[0].value = this.players[0].hand.GetStringFormat();
                }
            }

            if (interaction.customId === "stand") {
                this.players[0].Stand();
                this.stats[0].value = `${this.players[0].hand.GetStringFormat()}\n[STAND]`;
                this.DisableButtons();
                this.FakeAwakesTurn();
            }

            if (interaction.customId === "fold") {
                this.players[0].Stand();
                this.stats[0].value = `${this.players[0].hand.GetStringFormat()}\n[FOLD]`;
                this.DisableButtons();
                this.FakeAwakesTurn();
            }

            this.embed.setFields(this.stats);
            interaction.update({ embeds: [this.embed], components: [this.buttons] });
        });
    }
}

function Run(message, args, args_with_case, client) {
    instances.push(new Instance(message, client));

    return true;
}

module.exports = {
    NSFW: false,
    name: "blackjack",
    aliases: [
        ["blackjack"],
        ["bj"]
    ],
    Run
}