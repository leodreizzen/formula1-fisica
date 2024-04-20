import {useResizeDetector} from "react-resize-detector";
import Plot from "react-plotly.js";

export default function AutoSizePlot({className, ...props}){
    const {width, height, ref} = useResizeDetector();
    return (
        <div ref={ref} className={className}>
            <Plot
                className="h-full w-full"
                {...props}
                layout={{...(props.layout), width: width, height: height, autosize: true}}
                config={{...props.config, responsive: true}}
            />
        </div>
    )
}