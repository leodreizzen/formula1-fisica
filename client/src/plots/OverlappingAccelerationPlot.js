import Plot from 'react-plotly.js';
export default function OverlappingAccelerationPlot({className, isDataLoading, accelerationData, timeUnit, traces}) {
    const {moduleTrace, tangentialTrace, normalTrace} = traces;

    return (
        <div className={className}>
            <Plot
                data={[
                    {...moduleTrace, xaxis: 'x1', yaxis: 'y1', name: "Módulo"},
                    {...tangentialTrace, xaxis: 'x1', yaxis: 'y1', name: "Tangencial"},
                    {...normalTrace, xaxis: 'x1', yaxis: 'y1', name: "Normal"},

                ]}
                layout={{
                    xaxis: {title: 'Tiempo [' + timeUnit + "]"},
                    yaxis: {title: 'Aceleración [m/s²]'},
                    responsive: true,
                    dragmode: "pan",
                    margin: {t:20},
                }}
                config={{responsive: true, scrollZoom: true, displayModeBar: false}}
            />
        </div>
    )
}
