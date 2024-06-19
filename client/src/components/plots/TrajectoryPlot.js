import {OrbitProgress} from "react-loading-indicators";
import {useMemo} from "react";
import {
    enforceSameScaleHorizontal,
    enforceSameScaleVertical, getTolerancesPreservingAspectRatio, getTrajectoryExtremes,
} from "./plot-utils";
import {accelerationArrow, normalAccelerationArrow, speedArrow, tangentialAccelerationArrow} from "./arrows";
import {useKinematicVectorsContext} from "../../context/KinematicVectorsContext";
import BasePlot from "./BasePlot";
import {useResizeDetector} from "react-resize-detector";
import {poleColor} from "../../styles";

export default function TrajectoryPlot({className, trajectoryData, hoveredPoint, setHoveredPoint}) {
    const MARGINS = {r: 150, t: 0, b: 0, l: 0}; // IMPORTANTE: r debe ser mayor que el ancho del texto más largo de la leyenda
    const LEGEND_ITEM_WIDTH = 30;

    const {vectors, getKinematicVectorsFromTime} = useKinematicVectorsContext();
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

    function handleHover(data) {
        const point = getPointFromHoverData(data)
        setHoveredPoint(point)
    }

    function getPointFromHoverData(data){
        const point = data.points[0]
        const index = data.points[0].pointIndex;
        if (point.curveNumber === 0)
            return index;
        else if (point.curveNumber === 1){
            const trajectoryPoint = trajectoryData.findIndex(it => it.cartesian.x / 10 === point.x && it.cartesian.y / 10 === point.y)
            if (trajectoryPoint !== undefined)
                return trajectoryPoint;
            else
                console.log("Point not found")
        }
        else
            throw new Error("Unknown curve");
    }


    const arrows = useMemo(() => {
        if (vectors === null || trajectoryData === null || hoveredPoint === null)
            return null;
        const time = trajectoryData[hoveredPoint].time;
        const x = trajectoryData[hoveredPoint].cartesian.x / 10;
        const y = trajectoryData[hoveredPoint].cartesian.y / 10;
        const vectorsInTime = getKinematicVectorsFromTime(time);
        if (vectorsInTime === undefined)
            return [];
        return [speedArrow(vectorsInTime, x, y), accelerationArrow(vectorsInTime, x, y), tangentialAccelerationArrow(vectorsInTime, x, y), normalAccelerationArrow(vectorsInTime, x, y)]
    }, [vectors, trajectoryData, hoveredPoint, getKinematicVectorsFromTime]);

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
            data.push({
                x: [trajectoryData[0].cartesian.x/10],
                y: [trajectoryData[0].cartesian.y/10],
                name: "Polo",
                type: "markers",
                mode: "markers",
                marker: {color: poleColor, hoverinfo: 'none'},
                showlegend: true
            })
        }
        return data;
    }, [trajectoryData, MARGINS.r, width]);

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
    }, [arrows, xTolerance, yTolerance, MARGINS, width, maxX, maxY, minX, minY]);

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
