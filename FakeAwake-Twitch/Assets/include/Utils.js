exports.Clamp = function(value, lower, upper) {
    if (value > upper) {
        return upper;
    } else if (value < lower) {
        return lower;
    } else {
        return value;
    }
}

exports.GetTimeStamp = function() {
    const DateTime = new Date();
    
    return `[${("0" + DateTime.getDate()).slice(-2)}/${("0" + (DateTime.getMonth() + 1)).slice(-2)}/${DateTime.getFullYear()} ${("0" + DateTime.getHours()).slice(-2)}:${("0" + DateTime.getMinutes()).slice(-2)}:${("0" + DateTime.getSeconds()).slice(-2)}]`;
}

exports.CapitilizeFirstLetter = function (text) {
    return text[0].toUpperCase() + text.slice(1);
}