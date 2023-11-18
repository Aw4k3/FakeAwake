"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChains = exports.UpdateChain = void 0;
let chains = new Map();
function UpdateChain(channel, message) {
    if (!chains.has(channel.id)) {
        chains.set(channel.id, [message]);
    }
    else {
        let chain = chains.get(channel.id);
        if (chain[0] == message)
            chain.push(message);
        else
            chain = [message];
        console.log(chain);
        if (chain.length > 2) {
            channel.send(message);
            chains.set(channel.id, []);
        }
        else {
            chains.set(channel.id, chain);
        }
    }
}
exports.UpdateChain = UpdateChain;
function GetChains() {
    return chains;
}
exports.GetChains = GetChains;
