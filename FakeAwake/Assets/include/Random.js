function RandFloat(min, max) {
    return min + Math.random() * Math.floor(max - min); //Inclusive Min, Exclusive Max
}

function RandInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min)); //Inclusive Min, Exclusive Max
}

function RandHex() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

function RandBool() {
    var x = RandInt(0, 2);
    if (x > 0) {
        return true;
    } else {
        return false;
    }
}

function RandHexColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

function FromJSON(object) {
    var i = RandInt(0, Object.keys(object).length)
    return {
        KEY: Object.keys(object)[i],
        VALUE: object[Object.values(object)[i]]
    };
}

module.exports = {
    RandFloat,
    RandInt,
    RandHex,
    RandBool,
    RandHexColor,
    FromJSON
}