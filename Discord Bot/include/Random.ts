export function RandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function RandomFloat(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}