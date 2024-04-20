import {useResizeDetector} from "react-resize-detector";
import Plot from "react-plotly.js";
import {useEffect, useRef} from "react";

export default function AutoSizePlot({className, onSizeChange, ...props}){
    /*
        Plot that gets the size of the parent
        onSizeRange: function that gets called when the size of the plot changes. It receives the new size and the previous size
     */
    const {width, height, ref} = useResizeDetector();
    const previousSize = useRef({width: 0, height: 0});
    useEffect(() => {
        if(width !== undefined && height !== undefined ) {
            if(onSizeChange)
                onSizeChange({width, height}, {width: previousSize.current.width, height: previousSize.current.height});
            previousSize.current = {width, height};
        }
    }, [width, height]);
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