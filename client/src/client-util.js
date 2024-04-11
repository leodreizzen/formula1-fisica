export function dateUTC_to_LocalTimezone(utcString) {
    var utcDate = new Date(utcString);
    var timezoneOffset = utcDate.getTimezoneOffset();
    var localDate = new Date(utcDate.getTime() - (timezoneOffset * 60 * 1000));

    return localDate.toLocaleString();
}

export function dateUTC_to_dateTime(utcString){
    const utcDate = new Date(utcString);

    const date = utcDate.toLocaleDateString();
    const time = utcDate.toLocaleTimeString();
    const timezoneOffset = utcDate.getTimezoneOffset();

    return `${date} ${time} (UTC${timezoneOffset >= 0 ? '-' : '+'}${Math.abs(timezoneOffset / 60)})`;
}

export function dateUTC_to_timeUnit(utcString, timeUnitString){
    var utcDate = new Date(utcString);
    var timeInMilliseconds = utcDate.getTime();
    var timeInUnit
    switch (timeUnitString) {
        case 'min':
            timeInUnit = timeInMilliseconds / (1000 * 60);
            break;
        case 'h':
            timeInUnit = timeInMilliseconds / (1000 * 60 * 60);
            break;
        case 's':
            timeInUnit = timeInUnit = timeInMilliseconds / 1000;
            break;
        default:
            timeInUnit = timeInMilliseconds * 1000000; //nanosegundos
            break;
    }
    return timeInUnit;
}
