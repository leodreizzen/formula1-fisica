import {accelerationColor, normalAccelerationColor, speedColor, tangentialAccelerationColor} from "../../styles";

export function speedArrow(vectors, x, y) {
    const speedX = vectors.speed.vX / 10;
    const speedY = vectors.speed.vY / 10;

    return {
        ax: x,
        ay: y,
        x: x + speedX,
        y: y + speedY,
        xref: 'x',
        yref: 'y',
        axref: 'x',
        ayref: 'y',
        text: '',
        arrowhead: 1,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: speedColor,
    }
}

export function tangentialAccelerationArrow(vectors, x, y) {
    const versorX = vectors.versors.tangent.x;
    const versorY = vectors.versors.tangent.y;
    const tangential = vectors.acceleration.aTangential / 10;

    const arrowX = versorX * tangential;
    const arrowY = versorY * tangential;


    return {
        ax: x,
        ay: y,
        x: x + arrowX,
        y: y + arrowY,
        xref: 'x',
        yref: 'y',
        axref: 'x',
        ayref: 'y',
        text: '',
        arrowhead: 1,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: tangentialAccelerationColor
    }
}

export function normalAccelerationArrow(vectors, x, y) {
    const versorX = vectors.versors.normal.x;
    const versorY = vectors.versors.normal.y;
    const aNormal = vectors.acceleration.aNormal / 10;

    const arrowX = versorX * aNormal;
    const arrowY = versorY * aNormal;

    return {
        ax: x,
        ay: y,
        x: x + arrowX,
        y: y + arrowY,
        xref: 'x',
        yref: 'y',
        axref: 'x',
        ayref: 'y',
        text: '',
        arrowhead: 1,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: normalAccelerationColor
    }
}


export function accelerationArrow(vectors, x, y) {
    const accelerationX = vectors.acceleration.aX / 10;
    const accelerationY = vectors.acceleration.aY / 10;

    return {
        ax: x,
        ay: y,
        x: x + accelerationX,
        y: y + accelerationY,
        xref: 'x',
        yref: 'y',
        axref: 'x',
        ayref: 'y',
        text: '',
        arrowhead: 1,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: accelerationColor,
    }
}
