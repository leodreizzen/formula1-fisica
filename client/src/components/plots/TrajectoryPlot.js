import {OrbitProgress} from "react-loading-indicators";
import {useEffect, useMemo, useRef, useState} from "react";
import {trajectoryColor} from "../../styles";
import {
    enforceSameScaleHorizontal,
    enforceSameScaleVertical, getTolerancesPreservingAspectRatio,
} from "./plot-utils";
import {accelerationArrow, normalAccelerationArrow, speedArrow, tangentialAccelerationArrow} from "./arrows";
import {useVectorsContext} from "../../context/VectorsContext";
import BasePlot from "./BasePlot";
import {useResizeDetector} from "react-resize-detector";

export default function TrajectoryPlot({className, trajectoryData, hoveredPoint, setHoveredPoint}) {
    const {vectors, getVectorsFromTime} = useVectorsContext();
    const minX = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.x / 10))) : null, [trajectoryData]);
    const minY = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.y / 10))) : null, [trajectoryData]);
    const maxX = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.x / 10))) : null, [trajectoryData]);
    const maxY = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.y / 10))) : null, [trajectoryData]);
    const {width, height, ref} = useResizeDetector();
    const [xTolerance, yTolerance] = getTolerancesPreservingAspectRatio(minX, maxX, minY, maxY, width, height, 0.05, 0.05)

    function handleSizeChange(newSize, previousSize, ranges) {
        const xRangeInput = ranges.xRanges.get("xaxis")
        const yRangeInput = ranges.yRanges.get("yaxis")
        let previousRange = {x0: xRangeInput[0], x1: xRangeInput[1], y0: yRangeInput[0], y1: yRangeInput[1]}
        if (newSize.width !== previousSize.width) {
            const newRange = enforceSameScaleHorizontal(newSize.width, newSize.height, previousRange, minX, minY, maxX, maxY, xTolerance, yTolerance)
            ranges.xRanges.set("xaxis", [newRange.x0, newRange.x1])
            ranges.yRanges.set("yaxis", [newRange.y0, newRange.y1])
        } else if (newSize.height !== previousSize.height) {
            const newRange = enforceSameScaleVertical(newSize.width, newSize.height, previousRange, minX, minY, maxX, maxY, xTolerance, yTolerance)
            ranges.xRanges.set("xaxis", [newRange.x0, newRange.x1])
            ranges.yRanges.set("yaxis", [newRange.y0, newRange.y1])
        }
        return ranges
    }

    const arrows = useMemo(() => {
        if (vectors === null || trajectoryData === null || hoveredPoint === null)
            return null;
        const time = trajectoryData[hoveredPoint].time;
        const x = trajectoryData[hoveredPoint].x / 10;
        const y = trajectoryData[hoveredPoint].y / 10;
        const vectorsInTime = getVectorsFromTime(time);
        if (vectorsInTime === undefined)
            return [];
        return [speedArrow(vectorsInTime, x, y), accelerationArrow(vectorsInTime, x, y), tangentialAccelerationArrow(vectorsInTime, x, y), normalAccelerationArrow(vectorsInTime, x, y)]
    }, [vectors, trajectoryData, hoveredPoint, getVectorsFromTime]);


    function handleHover(data) {
        const index = data.points[0].pointIndex;
        setHoveredPoint(index);
    }

    function handleUnhover(data) {
        const index = data.points[0].pointIndex;
        if (hoveredPoint === index)
            setHoveredPoint(hovered => hovered === index ? null : hovered);
    }

    const plotData = useMemo(() =>
        trajectoryData ? [
            {
                x: trajectoryData.map(it => it.x / 10),
                y: trajectoryData.map(it => it.y / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: trajectoryColor},
                hoverinfo: 'none'
            }
        ] : null, [trajectoryData]);

    const plotLayout = useMemo(() => {
        return {
            margin: {r: 0, t: 0, b: 0, l: 0},
            xaxis: {
                title: 'X (m)',
                dtick: 200,
                tolerance: xTolerance / (maxX - minX),
            },
            yaxis: {
                title: 'Y (m)',
                dtick: 200,
                tolerance: yTolerance / (maxY - minY)
            },
            annotations: arrows
        }
    }, [arrows, xTolerance, yTolerance]);


    return (
        <div className={className + " overflow-clip"} ref={ref}>
            {trajectoryData === null ?
                <div className="h-full w-full flex items-center justify-center"><OrbitProgress size='large'
                                                                                               color="#EFE2E2"
                                                                                               variant='dotted'/></div>
                : <BasePlot className="w-full h-full p-0 m-0"
                            data={plotData}
                            layout={plotLayout}
                            config={{doubleClick: false}}
                            onHover={handleHover}
                            onUnhover={handleUnhover}
                            onSizeChangeRangeFilter={handleSizeChange}
                />
            }
        </div>
    )
}
