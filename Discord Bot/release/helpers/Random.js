"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomFloat = exports.RandomInteger = void 0;
function RandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.RandomInteger = RandomInteger;
function RandomFloat(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.RandomFloat = RandomFloat;
