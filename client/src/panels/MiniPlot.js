import Plot from "react-plotly.js";
import {useDriverContext} from "../context/DriverContext";
import {plotStyles} from "../styles";
import {useMemo} from "react";

export function MiniPlot({className, trajectoryData, hoveredPoint}) {

    const radius = 0.05;
    const minX = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.x / 10))) : null, [trajectoryData]);
    const minY = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.y / 10))) : null, [trajectoryData]);
    const maxX = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.x / 10))) : null, [trajectoryData]);
    const maxY = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.y / 10))) : null, [trajectoryData]);

    const xSize = useMemo(() => maxX - minX, [maxX, minX]);
    const ySize = useMemo(() => maxY - minY, [maxY, minY]);

    const range = {
        x0: trajectoryData[hoveredPoint].x / 10 - xSize * radius,
        x1: trajectoryData[hoveredPoint].x / 10 + ySize * radius,
        y0: trajectoryData[hoveredPoint].y / 10 - xSize * radius,
        y1: trajectoryData[hoveredPoint].y / 10 + ySize * radius
    }
    const {currentDriver} = useDriverContext();
    return (
        <Plot
            data={[{
                x: trajectoryData.map(it => it.x / 10),
                y: trajectoryData.map(it => it.y / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: '#' + currentDriver?.teamColor ?? "00FF00"},
                hoverinfo: 'none'
            }]}

            layout={{
                plot_bgcolor: plotStyles.plot_bgcolor,
                paper_bgcolor: plotStyles.paper_bgcolor,
                font: {...plotStyles.font, size: 10},

                margin: {r: 0, t: 0, b: 0, l: 0},

                xaxis: {
                    title: 'X (m)',
                    color: "transparent",
                    gridcolor: plotStyles.gridColor,
                    gridwidth: 1,
                    range: [range.x0, range.x1]
                },
                yaxis: {
                    title: 'Y (m)',
                    color: "transparent",
                    gridcolor: plotStyles.gridColor,
                    gridwidth: plotStyles.axisGridwidth,
                    range: [range.y0, range.y1],
                },
                height: 180, //TODO hacer dinámico
                width: 200
            }}
            config={{
                scrollZoom: false,
                responsive: true,
                displayModeBar: false,
                doubleClick: 'none'
            }}
        />
    )
}