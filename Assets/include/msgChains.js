class Chain {
    CHANNEL_ID = 0;
    Stack = [];

    ParseChain(msg) {
        if (this.Stack.includes(msg.content)) {
            this.Stack.push(msg.content);

            if (Stack.length === 3) {
                msg.channel.send(msg.content)
                this.Stack = [];
            }
        } else {
            this.Stack = [];
        }
    }

    constructor(msg) {
        this.CHANNEL_ID = msg.channel.id;
        this.Stack.push(msg.content);
    }
}

var ChainArray = [];

function Evaluate(msg) {
    var ChainExists = false;

    for (var i = 0; i < ChainArray.length; i++) {
        if (ChainArray[i].CHANNEL_ID === msg.channel.id) {
            ChainArray[i].ParseChain(msg);
            ChainExists = true;
        }
    }

    if (!ChainExists) {
        ChainArray.push(new Chain(msg));
    }
}