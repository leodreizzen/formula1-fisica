export function dateUTC_to_LocalTimezone(utcString) {
    const utcDate = new Date(utcString);
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localDate = new Date(utcDate.getTime() - (timezoneOffset * 60 * 1000));

    return localDate.toLocaleString();
}

export function timeDeltaToTimeUnit(timeDelta, timeUnitString){
    const parts = timeDelta.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)\.(\d+)/);

    if(!parts){
        console.error("Tiempo inválido: ", timeDelta);
        return null;
    }

    const seconds = parseInt(parts[1]) * 24 * 3600 + parseInt(parts[2]) * 3600 + parseInt(parts[3]) * 60 +
        parseInt(parts[4]) * 3600 + parseInt(parts[5]) * 60 + parseInt(parts[6]) +
        parseFloat("0." + parts[7]);

    let timeInUnit;
    switch (timeUnitString) {
        case 'min':
            timeInUnit = seconds / 60;
            break;
        case 'h':
            timeInUnit = seconds / (60 * 60);
            break;
        case 's':
            timeInUnit = seconds;
            break;
        case 'ms':
            timeInUnit = seconds * 1000;
            break;
        default:
            console.error("Unidad de tiempo inválida: ", timeUnitString);
            timeInUnit = null;
    }

    return timeInUnit;
}

