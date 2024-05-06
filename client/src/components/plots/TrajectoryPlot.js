import {OrbitProgress} from "react-loading-indicators";
import {useMemo} from "react";
import {
    enforceSameScaleHorizontal,
    enforceSameScaleVertical, getTolerancesPreservingAspectRatio, getTrajectoryExtremes,
} from "./plot-utils";
import {accelerationArrow, normalAccelerationArrow, speedArrow, tangentialAccelerationArrow} from "./arrows";
import {useVectorsContext} from "../../context/VectorsContext";
import BasePlot from "./BasePlot";
import {useResizeDetector} from "react-resize-detector";
import {useGetDrifting} from "../../api/hooks";

export default function TrajectoryPlot({className, trajectoryData, hoveredPoint, setHoveredPoint}) {
    const MARGINS = {r: 150, t: 0, b: 0, l: 0}; // IMPORTANTE: r debe ser mayor que el ancho del texto más largo de la leyenda
    const LEGEND_ITEM_WIDTH = 30;

    const {vectors, getVectorsFromTime} = useVectorsContext();
    const {minX, minY, maxX, maxY} = useMemo(()=>getTrajectoryExtremes(trajectoryData), [trajectoryData]);
    const {width, height, ref} = useResizeDetector();

    function getPaperWidth(width){
        return width - MARGINS.l - MARGINS.r;
    }
    function getPaperHeight(height){
        return height - MARGINS.t - MARGINS.b;
    }

    const [xTolerance, yTolerance] = getTolerancesPreservingAspectRatio(minX, maxX, minY, maxY, getPaperWidth(width), getPaperHeight(height) , 0.05, 0.05)


    function handleSizeChange(newSize, previousSize, ranges) {
        const xRangeInput = ranges.xRanges.get("xaxis")
        const yRangeInput = ranges.yRanges.get("yaxis")
        let previousRange = {x0: xRangeInput[0], x1: xRangeInput[1], y0: yRangeInput[0], y1: yRangeInput[1]}

        const previousPaperSize = {width: getPaperWidth(previousSize.width), height: getPaperHeight(previousSize.height)}
        const newPaperSize = {width: getPaperWidth(newSize.width), height: getPaperHeight(newSize.height)}

        if (newPaperSize.width !== previousPaperSize.width) {
            const newRange = enforceSameScaleHorizontal(newPaperSize.width, newPaperSize.height, previousRange, minX, minY, maxX, maxY, xTolerance, yTolerance)
            ranges.xRanges.set("xaxis", [newRange.x0, newRange.x1])
            ranges.yRanges.set("yaxis", [newRange.y0, newRange.y1])
        } else if (newPaperSize.height !== previousPaperSize.height) {
            const newRange = enforceSameScaleVertical(newPaperSize.width, newPaperSize.height, previousRange, minX, minY, maxX, maxY, xTolerance, yTolerance)
            ranges.xRanges.set("xaxis", [newRange.x0, newRange.x1])
            ranges.yRanges.set("yaxis", [newRange.y0, newRange.y1])
        }
        return ranges
    }

    const arrows = useMemo(() => {
        if (vectors === null || trajectoryData === null || hoveredPoint === null)
            return null;
        const time = trajectoryData[hoveredPoint].time;
        const x = trajectoryData[hoveredPoint].cartesian.x / 10;
        const y = trajectoryData[hoveredPoint].cartesian.y / 10;
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
    const plotData = useMemo(() => {
        const colorBarThickness = 7;

        let data = [];

        if (trajectoryData) {
            data.push({
                x: trajectoryData.map(it => it.x / 10),
                y: trajectoryData.map(it => it.y / 10),
                name: "Trayectoria",
                type: "scatter",
                mode: "lines",
                marker: {color: trajectoryData, hoverinfo: 'none'},
                showlegend: false
            })
        }
        if (driftingData) {
            data.push({
                x: driftingData.map(it => it.x / 10),
                y: driftingData.map(it => it.y / 10),
                name: "Derrapes",
                type: "scatter",
                mode: "markers",
                // color: driftingData.map(it => it.drifting),
                marker: {
                    color: driftingData.map(it => it.drifting),
                    colorscale: 'YlOrRd',
                    hoverinfo: 'none',
                    colorbar: {
                        xref:"container",
                        yref:"container",
                        x: 1 - (MARGINS.r)/width / 2,
                        y: 0.5,
                        len: 0.8,
                        yanchor: "middle",
                        xanchor: "center",
                        tickvals: driftingData.map(it => it.drifting),
                        ticktext: driftingData.map(it => it.drifting),
                        orientation: 'v',
                        thickness: colorBarThickness,
                        tickwidth: 0,
                        textfont: {size: 1},
                        dthick: 1,
                    }
                },
                hoverinfo: 'none'
            })
        }
        return data;
    }, [trajectoryData, driftingData]);

    const plotLayout = useMemo(() => {
        return {
            margin: MARGINS,
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
            annotations: arrows,
            legend:{
                xref: "container",
                x: 1 - MARGINS.r / width / 2,
                valign: "middle",
                xanchor: "center",
                y: 1,
                itemwidth: LEGEND_ITEM_WIDTH,
                entrywidth: MARGINS.r - LEGEND_ITEM_WIDTH - 15,
            }
        }
    }, [arrows, xTolerance, yTolerance]);


    return (
        <div className={className + " overflow-clip"} ref={ref}>
            {trajectoryData === null || driftingData === null ?
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
