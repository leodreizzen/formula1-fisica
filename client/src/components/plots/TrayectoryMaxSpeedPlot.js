import {OrbitProgress} from "react-loading-indicators";
import {useMemo} from "react";
import {
    enforceSameScaleHorizontal,
    enforceSameScaleVertical, getTolerancesPreservingAspectRatio, getTrajectoryExtremes,
} from "./plot-utils";
import {speedArrow, frictionArrow, normalFrictionArrow, tangentialFrictionArrow} from "./arrows";
import BasePlot from "./BasePlot";
import {useResizeDetector} from "react-resize-detector";


export default function TrajectoryMaxSpeedPlot({
                                                   className,
                                                   trajectoryData,
                                                   frictionData,
                                                   frictionInTime,
                                                   vectorsInTime,
                                                   hoveredPoint,
                                                   setHoveredPoint
                                               }) {
    const MARGINS = {r: 150, t: 0, b: 0, l: 0}; // IMPORTANTE: r debe ser mayor que el ancho del texto más largo de la leyenda
    const LEGEND_ITEM_WIDTH = 30;

    const {minX, minY, maxX, maxY} = useMemo(() => getTrajectoryExtremes(trajectoryData), [trajectoryData]);
    const {width, height, ref} = useResizeDetector();

    function getPaperWidth(width) {
        return width - MARGINS.l - MARGINS.r;
    }

    function getPaperHeight(height) {
        return height - MARGINS.t - MARGINS.b;
    }

    const [xTolerance, yTolerance] = getTolerancesPreservingAspectRatio(minX, maxX, minY, maxY, getPaperWidth(width), getPaperHeight(height), 0.05, 0.05)


    function handleSizeChange(newSize, previousSize, ranges) {
        const xRangeInput = ranges.xRanges.get("xaxis")
        const yRangeInput = ranges.yRanges.get("yaxis")
        let previousRange = {x0: xRangeInput[0], x1: xRangeInput[1], y0: yRangeInput[0], y1: yRangeInput[1]}

        const previousPaperSize = {
            width: getPaperWidth(previousSize.width),
            height: getPaperHeight(previousSize.height)
        }
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

    function handleHover(data) {
        const point = getPointFromHoverData(data)
        setHoveredPoint(point)
    }

    function getPointFromHoverData(data) {
        const point = data.points[0]
        const index = data.points[0].pointIndex;
        if (point.curveNumber === 0)
            return index;
        else if (point.curveNumber === 1) {
            const trajectoryPoint = trajectoryData.findIndex(it => it.cartesian.x / 10 === point.x && it.cartesian.y / 10 === point.y)
            if (trajectoryPoint !== undefined)
                return trajectoryPoint;
            else
                console.log("Point not found")
        } else
            throw new Error("Unknown curve");
    }


    const arrows = useMemo(() => {
        if (trajectoryData === null || hoveredPoint === null)
            return null;
        const x = trajectoryData[hoveredPoint].cartesian.x / 10;
        const y = trajectoryData[hoveredPoint].cartesian.y / 10;
        if (vectorsInTime === undefined || frictionInTime === undefined)
            return [];
        return [speedArrow(vectorsInTime, x, y), frictionArrow(frictionInTime, x, y), normalFrictionArrow(frictionInTime, x, y), tangentialFrictionArrow(frictionInTime, x, y)]
    }, [trajectoryData, hoveredPoint, frictionInTime, vectorsInTime]);

    function handleUnhover(data) {
        const index = getPointFromHoverData(data)
        if (hoveredPoint === index)
            setHoveredPoint(hovered => hovered === index ? null : hovered);
    }

    const plotData = useMemo(() => {
        const colorBarThickness = 7;

        let data = [];

        if (trajectoryData) {
            data.push({
                x: trajectoryData.map(it => it.cartesian.x / 10),
                y: trajectoryData.map(it => it.cartesian.y / 10),
                name: "Trayectoria",
                type: "scatter",
                mode: "lines",
                marker: {color: trajectoryData, hoverinfo: 'none'},
                showlegend: false
            })
        }

        if (frictionData) {
            const frictionDataWithMaxSpeed = frictionData.forces.filter(it => it.friction.hasMaxSpeed)
            if(frictionDataWithMaxSpeed) {
                data.push({
                    x: frictionDataWithMaxSpeed.map(it => (it.x / 10)),
                    y: frictionDataWithMaxSpeed.map(it => (it.y / 10)),
                    name: "v max / v",
                    type: "scatter",
                    mode: "markers",
                    showlegend: true,
                    text: frictionDataWithMaxSpeed.map(it => (it.module_velocity_xy / it.friction.maxSpeed).toFixed(4)),
                    marker: {
                        color: frictionDataWithMaxSpeed.map(it => it.module_velocity_xy / it.friction.maxSpeed),
                        colorscale: [
                            ['0.0', 'rgb(72, 248, 95)'],
                            ['0.1', 'rgb(90, 231, 93)'],
                            ['0.2', 'rgb(109, 214, 91)'],
                            ['0.3', 'rgb(127, 197, 90)'],
                            ['0.4', 'rgb(145, 180, 88)'],
                            ['0.5', 'rgb(164, 163, 86)'],
                            ['0.6', 'rgb(182, 145, 84)'],
                            ['0.7', 'rgb(200, 128, 82)'],
                            ['0.8', 'rgb(210, 111, 61)'],
                            ['0.9', 'rgb(237, 94, 79)'],
                            ['1.0', 'rgb(255,77,77)'],
                        ],
                        cmin: 0,
                        cmax: 1,
                        hoverinfo: 'none',
                        colorbar: {
                            xref: "container",
                            yref: "container",
                            x: 1 - (MARGINS.r) / width / 2,
                            y: 0.5,
                            len: 0.8,
                            yanchor: "middle",
                            xanchor: "center",
                            orientation: 'v',
                            thickness: colorBarThickness,
                            tickwidth: 0,
                            textfont: {size: 1}
                        }
                    },
                })
            }
        }
        return data;
    }, [trajectoryData, frictionData, MARGINS.r, width]);

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
            legend: {
                xref: "container",
                x: 1 - MARGINS.r / width / 2,
                valign: "middle",
                xanchor: "center",
                y: 1,
                itemwidth: LEGEND_ITEM_WIDTH,
                entrywidth: MARGINS.r - LEGEND_ITEM_WIDTH - 15,
            }
        }
    }, [arrows, xTolerance, yTolerance, MARGINS, width, maxX, maxY, minX, minY]);

    return (
        <div className={className + " overflow-clip"} ref={ref}>
            {trajectoryData === null || frictionData === null ?
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
