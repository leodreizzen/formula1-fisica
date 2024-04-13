import Plot from 'react-plotly.js';
import {useGetTrajectory, useGetVectors} from "../api/hooks";
import {OrbitProgress} from "react-loading-indicators";
import {useContext, useMemo, useState} from "react";
import {SessionDataContext} from "../context/SessionDataContext";
import { useResizeDetector } from 'react-resize-detector';
import {plotStyles} from "../styles";
import {enforcePlotRange} from "./plot-utils";

export default function TrajectoryPlot({className, currentDriver: selectedDriver, currentLap}) {
    const sessionData = useContext(SessionDataContext);
    const {year, round, session} = sessionData;
    const [trajectoryData, trajectoryDataLoading] = useGetTrajectory(year, round, session, selectedDriver, currentLap);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const time = hoveredPoint !== null ? trajectoryData[hoveredPoint].time : null;
    const [vectors, vectorsLoading] = useGetVectors(year, round, session, selectedDriver, currentLap, time);
    const { width, height, ref } = useResizeDetector();



    function speedArrow(x, y) {
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

    function tangentialAccelerationArrow(x, y) {
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

    function normalAccelerationArrow(x, y) {
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


    function accelerationArrow(x, y) {
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

    const minX = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.x/10))) : null, [trajectoryData]);
    const minY = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.y/10))) : null, [trajectoryData]);
    const maxX = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.x/10))) : null, [trajectoryData]);
    const maxY = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.y/10))) : null, [trajectoryData]);

    //TODO PONER UN USEFFECT O SIMILAR PORQUE minX etc arrancan en null
    const [range, setRange] = useState({
        x0: minX,
        x1: maxX,
        y0: minY,
        y1: maxY
    });

    function handleUpdate(state){
       if (state.layout.xaxis.range[0] === range.x0 && state.layout.xaxis.range[1] === range.x1 &&
            state.layout.yaxis.range[0] === range.y0 && state.layout.yaxis.range[1] === range.y1)
            return;
       const newRange = {
              x0: state.layout.xaxis.range[0],
              x1: state.layout.xaxis.range[1],
              y0: state.layout.yaxis.range[0],
              y1: state.layout.yaxis.range[1]
       }
       const {x0, x1, y0, y1} = enforcePlotRange(range, newRange, minX, minY, maxX, maxY)

        setRange({
            x0: x0,
            x1: x1,
            y0: y0,
            y1: y1,
        })
    }


    const arrows = useMemo(() => {
        if (vectors === null || trajectoryData[hoveredPoint] === undefined)
            return null;

        const x = trajectoryData[hoveredPoint].x / 10;
        const y = trajectoryData[hoveredPoint].y / 10;

        return [speedArrow(x,y), accelerationArrow(x, y), tangentialAccelerationArrow(x, y), normalAccelerationArrow(x, y)]
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

    return (
        <div className={className + " overflow-clip"} ref={ref}>
            {trajectoryDataLoading ? <OrbitProgress size='large' color="#EFE2E2" variant='dotted'/> :
                trajectoryData !== null ?
                    <Plot className="w-full h-full"
                        data={[
                            {
                                x: trajectoryData.map(it => it.x / 10),
                                y: trajectoryData.map(it => it.y / 10),
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: '#00FF00'},
                                hoverinfo:'none'
                            }
                        ]}
                        config={{
                            scrollZoom: true,
                            responsive: true,
                            displayModeBar: false
                        }}
                        layout={{
                            plot_bgcolor:plotStyles.plot_bgcolor,
                            paper_bgcolor: plotStyles.paper_bgcolor,
                            font: plotStyles.font,

                            margin:{r:15},

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
                                range: [range.y0, range.y1]
                            },
                            title: 'Trayectoria en coordenadas cartesianas',
                            dragmode: "pan",
                            annotations: arrows
                        }}
                        onHover={handleHover}
                        onUnhover={handleUnhover}
                        onUpdate={handleUpdate}

                    />
                    : null}
        </div>
    )
}
