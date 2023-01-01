const STATUS_COLOR = {
    "OK": "#ff0000",
    "WARN": "#ffff00",
    "ERROR": "#ff0000"
}

function StatusColor(type = '') {
    switch (type.toUpperCase()) {
        default:
            return '#ffffff';

        case 'ERROR':
            return '#ff0000'; // Red

        case 'WARN':
            return '#ffff00'; // Yellow

        case 'OK':
            return '#7d46e3'; // Purple
    }
}

function InvalidCommandMessage() {
    return 'User entered invalid command.';
}

module.exports = {
    StatusColor,
    InvalidCommandMessage
}