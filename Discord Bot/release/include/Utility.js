"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLOURS = exports.CapitiliseFirstLetter = exports.GenerateTimestamp = void 0;
function GenerateTimestamp() {
    return `[${new Date().toLocaleString().replace(",", "")}]`;
}
exports.GenerateTimestamp = GenerateTimestamp;
function CapitiliseFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}
exports.CapitiliseFirstLetter = CapitiliseFirstLetter;
exports.COLOURS = {
    PRIMARY: "#991ff0",
    FAIL: "#730e0e",
    LOADING: "#2a1d33"
};
