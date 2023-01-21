function Clamp(value, lower, upper) {
    if (value > upper) {
        return upper;
    } else if (value < lower) {
        return lower;
    } else {
        return value;
    }
}

function loop_iterator(value, lower, upper, decrement = false) {
    if (decrement) {
        value--;
    } else {
        value++;
    }

    if (value > upper) {
        return lower;
    } else if (value < lower) {
        return upper;
    } else {
        return value;
    }
}

function GetTimeStamp() {
    const DateTime = new Date();
    return `[${("0" + DateTime.getDate()).slice(-2)}/${("0" + (DateTime.getMonth() + 1)).slice(-2)}/${DateTime.getFullYear()} ${("0" + DateTime.getHours()).slice(-2)}:${("0" + DateTime.getMinutes()).slice(-2)}:${("0" + DateTime.getSeconds()).slice(-2)}]`;
}

function GetDate(format = 'short') {
    const DateTime = new Date();
    const MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    switch (format) {
        case 'short':
            return `${("0" + DateTime.getDate()).slice(-2)}/${("0" + (DateTime.getMonth() + 1)).slice(-2)}/${DateTime.getFullYear()}`;

        case 'long':
            return `${("0" + DateTime.getDate()).slice(-2)} ${MONTHS[DateTime.getMonth()]} ${DateTime.getFullYear()}`;
    }

}

function CapitilizeFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1);
}

module.exports = {
    Clamp,
    loop_iterator,
    GetTimeStamp,
    GetDate,
    CapitilizeFirstLetter
}