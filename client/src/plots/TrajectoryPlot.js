import Plot from 'react-plotly.js';

export default function TrajectoryPlot({className, trajectoryData}){
    return (
      <Plot
        data={[
          {
            x: trajectoryData.map(it => it.x / 10),
            y: trajectoryData.map(it => it.y / 10),
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          }
        ]}
        layout={ {width: 600, height: 600} }
      />
    );
}
