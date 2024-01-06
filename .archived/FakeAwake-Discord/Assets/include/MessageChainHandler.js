class MessageChain {
    channel = null;
    array = [];

    Resolve(message) {
        if (message.author.id === "707698652076048406") return;

        if (message.content === this.array[0] || this.array.length === 0) this.array.push(message.content);
        else this.array = [];

        if (this.array.length === 3) {
            message.channel.send(this.array[0]);
            this.array = [];
        }
    }

    constructor(message) {
        this.channel = message.channel;
        this.array.push(message.content);
    }
}

var MessageChains = [];
var chain_exists = false;

function Resolve(message) {
    chain_exists = false;

    for (var instance of MessageChains) {
        if (instance.channel.id === message.channel.id) {
            instance.Resolve(message);
            chain_exists = true;
            break;
        }
    }

    if (!chain_exists) MessageChains.push(new MessageChain(message));
}

module.exports = {
    Resolve
}