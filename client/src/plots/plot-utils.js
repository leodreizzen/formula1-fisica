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
    console.log(previousSize, newSize);

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