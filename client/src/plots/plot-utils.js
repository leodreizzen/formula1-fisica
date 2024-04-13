export function enforcePlotRange(oldRange, newRange, minX, minY, maxX, maxY){
    let x0, x1, y0 ,y1;
    const previousSize = [oldRange.x1 - oldRange.x0, oldRange.y1 - oldRange.y0];
    const newSize = [newRange.x1 - newRange.x0, newRange.y1 - newRange.y0];

    //Treat zoom and pan independently
    let panX = false;
    let panY = false;
    if(newSize[0].toFixed(5) === previousSize[0].toFixed(5)){
        panX = true;
        // Horizontal pan
        if(newRange.x0 < oldRange.x0){
            x0 = Math.max(minX, newRange.x0);
            x1 = x0 + previousSize[0];
        }
        else{
            x1 = Math.min(maxX, newRange.x1);
            x0 = x1 - previousSize[0];
        }
    }
    if(newSize[1].toFixed(5) === previousSize[1].toFixed(5)){
        panY = true;
        // Vertical pan
        if(newRange.y0 < oldRange.y0){
            y0 = Math.max(minY, newRange.y0);
            y1 = y0 + previousSize[1];
        }
        else{
            y1 = Math.min(maxY, newRange.y1);
            y0 = y1 - previousSize[1];
        }
    }
    if(!panX){
        x0 = Math.max(minX, newRange.x0);
        x0 = Math.max(minX, newRange.x0);
        x1 = Math.min(maxX, newRange.x1);
    }
    if(!panY){
        y0 = Math.max(minY, newRange.y0);
        y1 = Math.min(maxY, newRange.y1);
    }


    return {
        x0: x0,
        x1: x1,
        y0: y0,
        y1: y1,
    }
}