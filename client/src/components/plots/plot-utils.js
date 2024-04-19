export function enforcePlotRange(oldRange, newRange, minX, minY, maxX, maxY){
    const xRange = enforcePlotSingleAxisRange([oldRange.x0, oldRange.x1], [newRange.x0, newRange.x1], minX, maxX);
    const yRange = enforcePlotSingleAxisRange([oldRange.y0, oldRange.y1], [newRange.y0, newRange.y1], minY, maxY);
    return{
        x0: xRange[0],
        x1: xRange[1],
        y0: yRange[0],
        y1: yRange[1]
    }
}

export function enforcePlotSingleAxisRange(oldRange, newRange, min, max) {
    const previousSize = oldRange[1] - oldRange[0];
    const newSize = newRange[1] - newRange[0];

    let x0, x1;
    if(newSize.toFixed(5) === previousSize.toFixed(5)){
        // pan
        if(newRange[0] < oldRange[0]){
            x0 = Math.max(min, newRange[0]);
            x1 = x0 + previousSize;
        }
        else{
            x1 = Math.min(max, newRange[1]);
            x0 = x1 - previousSize;
        }
    } else{
        // zoom
        x0 = Math.max(min, newRange[0]);
        x1 = Math.min(max, newRange[1]);
    }

    if(isNaN(x0) || isNaN(x1))
        throw new Error("Invalid range") // throw to avoid infinite loop
    return [x0, x1];
}

export function enforceSameScaleHorizontal(width, height, range, minX, minY, maxX, maxY, xTolerance, yTolerance) {
    const xSize = range.x1 - range.x0;
    const aspectRatio = width / height
    let newYSize = xSize / aspectRatio;
    let newXSize = xSize;
    let x0, y0;
    let yCenter = (range.y0 + range.y1) / 2;
    if (newYSize > maxY - minY + 2 * yTolerance) {
        newYSize = maxY - minY + 2 * yTolerance;
        newXSize = newYSize * aspectRatio;
    }
    if (yCenter - newYSize / 2 < minY - yTolerance) {
        y0 = minY - yTolerance;
    } else if (yCenter + newYSize / 2 > maxY + yTolerance) {
        y0 = maxY + yTolerance - newYSize;
    } else {
        y0 = yCenter - newYSize / 2;
    }
    x0 = range.x0;
    return {
        x0: x0,
        x1: x0 + newXSize,
        y0: y0,
        y1: y0 + newYSize
    };
}

export function enforceSameScaleVertical(width, height, range, minX, minY, maxX, maxY, xTolerance, yTolerance) {
    const ySize = range.y1 - range.y0;
    const aspectRatio = width / height
    let newYSize = ySize;
    let newXSize = ySize * aspectRatio;
    let x0, y0;
    let xCenter = (range.x0 + range.x1) / 2;
    if (newXSize > maxX - minX + 2 * xTolerance) {
        newXSize = maxX - minX + 2 * xTolerance;
        newYSize = newXSize / aspectRatio;
    }
    if (xCenter - newXSize / 2 < minX - xTolerance) {
        x0 = minX - xTolerance;
    } else if (xCenter + newXSize / 2 > maxX + xTolerance) {
        x0 = maxX + xTolerance - newXSize;
    } else {
        x0 = xCenter - newXSize / 2;
    }
    y0 = range.y0;
    return {
        x0: x0,
        x1: x0 + newXSize,
        y0: y0,
        y1: y0 + newYSize
    };
}

export function getTolerancesPreservingAspectRatio(minX, maxX, minY, maxY, width, height, xToleranceFraction, yToleranceFraction){
    let xTolerance = (maxX - minX) * xToleranceFraction ;
    /*
    set yTolerance to keep the same aspect ratio
    (sizeX + 2tx)/(sizeY + 2*tY) = width/height
    (sizeX + 2tx)/(width/height) = sizeY + 2*ty
    (sizeX + 2tx) / (width/height) - sizeY = 2*ty
    [(sizeX + 2tx) / (width/height) - sizeY)]/2= ty
    */
    let yTolerance = ((maxX - minX + 2*xTolerance) / (width / height) - (maxY - minY))/2;
    if(yTolerance < 0) {
        // Same, but for xTolerance
        yTolerance = (maxY - minY) * yToleranceFraction;
        xTolerance = ((maxY - minY + 2*yTolerance) / (height/width) - (maxX - minX))/2;
    }
    return [xTolerance, yTolerance];
}