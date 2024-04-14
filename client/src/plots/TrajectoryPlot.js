import Plot from 'react-plotly.js';
import {useGetTrajectory, useGetVectors} from "../api/hooks";
import {OrbitProgress} from "react-loading-indicators";
import {useEffect, useMemo, useState} from "react";
import {useSessionDataContext} from "../context/SessionDataContext";
import {useResizeDetector} from 'react-resize-detector';
import {plotStyles} from "../styles";
import {enforcePlotRange} from "./plot-utils";
import {accelerationArrow, normalAccelerationArrow, speedArrow, tangentialAccelerationArrow} from "./arrows";
import {useDriverContext} from "../context/DriverContext";
import {useLapContext} from "../context/LapContext";

export default function TrajectoryPlot({className}) {
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    const {year, round, session} = sessionData;
    const [trajectoryData, trajectoryDataLoading] = useGetTrajectory(year, round, session, currentDriver? currentDriver.driverNumber:null, currentLap);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const time = hoveredPoint !== null && trajectoryData !== null ? trajectoryData[hoveredPoint].time : null;
    const [vectors, vectorsLoading] = useGetVectors(year, round, session, currentDriver? currentDriver.driverNumber:null, currentLap, time);
    const {width, height, ref} = useResizeDetector();

    const minX = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.x / 10))) : null, [trajectoryData]);
    const minY = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.y / 10))) : null, [trajectoryData]);
    const maxX = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.x / 10))) : null, [trajectoryData]);
    const maxY = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.y / 10))) : null, [trajectoryData]);

    const xTolerance = (maxX - minX) * 0.05;
    const yTolerance = (maxY - minY) * 0.05;

    const [range, setRange] = useState({
        x0: minX,
        x1: maxX,
        y0: minY,
        y1: maxY
    });

    useEffect(() => {
        if (trajectoryData !== null) {
            setRange({
                x0: minX - xTolerance,
                x1: maxX + xTolerance,
                y0: minY - yTolerance,
                y1: maxY + yTolerance
            });
        }
    }, [trajectoryData]);

    function handleUpdate(state) {
        if (state.layout.xaxis.range[0] !== range.x0 || state.layout.xaxis.range[1] !== range.x1 ||
            state.layout.yaxis.range[0] !== range.y0 || state.layout.yaxis.range[1] !== range.y1) {
            const newRange = {
                x0: state.layout.xaxis.range[0],
                x1: state.layout.xaxis.range[1],
                y0: state.layout.yaxis.range[0],
                y1: state.layout.yaxis.range[1]
            }
            setRange(enforcePlotRange(range, newRange, minX - xTolerance, minY - yTolerance, maxX + xTolerance, maxY + yTolerance));
        }
    }


    const arrows = useMemo(() => {
        if (vectors === null || trajectoryData === null || hoveredPoint === null)
            return null;

        const x = trajectoryData[hoveredPoint].x / 10;
        const y = trajectoryData[hoveredPoint].y / 10;

        return [speedArrow(vectors, x, y), accelerationArrow(vectors, x, y), tangentialAccelerationArrow(vectors, x, y), normalAccelerationArrow(vectors, x, y)]
    }, [vectors, trajectoryData, hoveredPoint]);


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
                marker: {color: '#' + currentDriver?.teamColor ?? "00FF00"},
                hoverinfo: 'none'
            }
        ] : null, [trajectoryData]);

    const plotLayout = useMemo(() => {
        return {
            plot_bgcolor: plotStyles.plot_bgcolor,
            paper_bgcolor: plotStyles.paper_bgcolor,
            font: plotStyles.font,

            margin: {r: 0},

            width: width,
            height: height,
            xaxis: {
                title: 'X (m)',
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: 1,
                range: [range.x0, range.x1]
            },
            yaxis: {
                title: 'Y (m)',
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: plotStyles.axisGridwidth,
                range: [range.y0, range.y1],
            },
            dragmode: "pan",
            annotations: arrows
        }
    }, [width, height, arrows, range]);


    return (
        <div className={className + " overflow-clip"} ref={ref}>
            {trajectoryDataLoading ? <OrbitProgress size='large' color="#EFE2E2" variant='dotted'/> :
                trajectoryData !== null ?
                    <Plot className="w-full h-full"
                          data={plotData}
                          config={{
                              scrollZoom: true,
                              responsive: true,
                              displayModeBar: false,
                              doubleClick: 'reset'
                          }}
                          layout={plotLayout}
                          onHover={handleHover}
                          onUnhover={handleUnhover}
                          onUpdate={handleUpdate}

                    />
                    : null}
        </div>
    )
}
