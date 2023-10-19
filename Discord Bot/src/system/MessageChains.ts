import * as Discord from "discord.js";

let chains: Map<string, string[]> = new Map<string, string[]>();

export function UpdateChain(channel: Discord.TextBasedChannel, message: string) {
    if (!chains.has(channel.id)) {
        chains.set(channel.id, [message]);
    } else {
        let chain: string[] = chains.get(channel.id);
        chain.push(message);

        if (chain.length > 2) {
            channel.send(message);
            chains.set(channel.id, []);
        } else {
            chains.set(channel.id, chain);
        }
    }
}