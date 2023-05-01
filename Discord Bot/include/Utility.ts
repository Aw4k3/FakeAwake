export function GenerateTimestamp(): string {
    return `[${new Date().toLocaleString().replace(",", "")}]`;
}

export function CapitiliseFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

export const COLOURS = {
    PRIMARY: "#991ff0",
    FAIL: "#730e0e",
    LOADING: "#2a1d33"
};