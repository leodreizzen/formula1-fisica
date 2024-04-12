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
                    title:'Aceleraciones en función del tiempo',
                    xaxis: {title: 'Tiempo [' + timeUnit + "]"},
                    responsive: true
                }}
            />
        </div>
    )
}
