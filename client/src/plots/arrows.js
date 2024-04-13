export function speedArrow(vectors, x, y) {
    const speedX = vectors.speed.vX;
    const speedY = vectors.speed.vY;

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
        arrowhead: 10,
        arrowsize: 2,
        arrowwidth: 1,
        arrowcolor: 'blue',
    }
}

export function tangentialAccelerationArrow(vectors, x, y) {
    const versorX = vectors.versors.tangent.x;
    const versorY = vectors.versors.tangent.y;
    const tangential = vectors.acceleration.aTangential;

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
        arrowhead: 10,
        arrowsize: 2,
        arrowwidth: 1,
        arrowcolor: 'light-blue',
    }
}

export function normalAccelerationArrow(vectors, x, y) {
    const versorX = vectors.versors.normal.x;
    const versorY = vectors.versors.normal.y;
    const aNormal = vectors.acceleration.aNormal;

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
        arrowhead: 10,
        arrowsize: 2,
        arrowwidth: 1,
        arrowcolor: 'light-blue',
    }
}


export function accelerationArrow(vectors, x, y) {
    const accelerationX = vectors.acceleration.aX;
    const accelerationY = vectors.acceleration.aY;

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
        arrowhead: 10,
        arrowsize: 2,
        arrowwidth: 1,
        arrowcolor: 'red',
    }
}
