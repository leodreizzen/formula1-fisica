import React, {useMemo, useState} from "react";
import {enforcePlotSingleAxisRange} from "./plot-utils";
import {plotStyles} from "../../styles";
import AutoSizePlot from "./AutoSizePlot";

export default function BasePlot({className, data, layout, config, tolerances = new Map(), ...props}) {
    /*
        Plot that gets the size of the parent, and does not allow the user to move outside the data range
        Supports multiple traces with different x and y-axis
        To allow some tolerance on the range, add a "tolerance" field to the axis in layout with the fraction of the size (ej: 0.1)
     */

    const xAxisAssignments = useMemo(
        () => {
            const res = new Map()
            data.forEach((trace) => {
                let axisName = "xaxis" + (trace.xaxis || "x").substring(1)
                if(axisName === "xaxis1")
                    axisName = "xaxis"
                if (!res.has(axisName)) {
                    res.set(axisName, [])
                }
                res.get(axisName).push(trace)
            });
            return res;
        }, [data]
    )
    const yAxisAssignments = useMemo(
        () => {
            const res = new Map()
            data.forEach((trace) => {
                let axisName = "yaxis" + (trace.yaxis || "y").substring(1)
                if(axisName === "yaxis1")
                    axisName = "yaxis"
                if (!res.has(axisName)) {
                    res.set(axisName, [])
                }
                res.get(axisName).push(trace)
            });
            return res;
        }, [data]
    )

    const xAxes = useMemo(() => [...xAxisAssignments.keys()], [xAxisAssignments])
    const yAxes = useMemo(() => [...yAxisAssignments.keys()], [yAxisAssignments])

    const minXs = useMemo(
        () => {
            const res = new Map()
            xAxisAssignments.forEach((traces, axis) => {
                res.set(axis, Math.min(...traces.map(trace => Math.min(...trace.x))));
            })
            return res;
        }, [xAxisAssignments])

    const maxXs = useMemo(
        () => {
            const res = new Map()
            xAxisAssignments.forEach((traces, axis) => {
                res.set(axis, Math.max(...traces.map(trace => Math.max(...trace.x))));
            })
            return res;
        }, [xAxisAssignments])

    const minYs = useMemo(
        () => {
            const res = new Map()
            yAxisAssignments.forEach((traces, axis) => {
                res.set(axis, Math.min(...traces.map(trace => Math.min(...trace.y))));
            })
            return res;
        }, [yAxisAssignments])

    const maxYs = useMemo(
        () => {
            const res = new Map()
            yAxisAssignments.forEach((traces, axis) => {
                res.set(axis, Math.max(...traces.map(trace => Math.max(...trace.y))));
            })
            return res;
        }, [yAxisAssignments])

    const [xRanges, setXRanges] = useState(
        initXRanges()
    )

    const [yRanges, setYRanges] = useState(
        initYRanges()
    )

    function initXRanges() {
        const res = new Map()
        xAxisAssignments.forEach((traces, axis) => {
            res.set(axis, [minXs.get(axis), maxXs.get(axis)])
        })
        return res;
    }

    function initYRanges() {
        const res = new Map()
        yAxisAssignments.forEach((traces, axis) => {
            res.set(axis, [minYs.get(axis), maxYs.get(axis)])
        })
        return res;
    }

    function handleUpdate(state) {
        const finalXRanges = new Map()
        const finalYRanges = new Map()
        let xChanged = false;
        let yChanged = false

        xAxes.forEach(axis => {
            const oldRange = xRanges.get(axis)
            const xSize = maxXs.get(axis) - minXs.get(axis)
            if(!state.layout[axis]){
                console.log("AXIS NOT FOUND", axis, state.layout)
                return
            }
            let tolerance =  xSize * (state.layout[axis].tolerance ?? 0)
            const newRange = state.layout[axis].range
            if (oldRange[0] !== newRange[0] || oldRange[1] !== newRange[1]) {
                {
                    const finalRange = enforcePlotSingleAxisRange(oldRange, newRange, minXs.get(axis) - tolerance, maxXs.get(axis) + tolerance)
                    finalXRanges.set(axis, finalRange)
                    xChanged = true
                }
            } else{
                finalXRanges.set(axis, oldRange)
            }

        })

        yAxes.forEach(axis => {
            const oldRange = yRanges.get(axis)
            const ySize = maxYs.get(axis) - minYs.get(axis)
            if(!state.layout[axis]){
                console.log("AXIS NOT FOUND", axis, state.layout)
                return
            }
            let tolerance =  ySize * (state.layout[axis].tolerance ?? 0)
            const newRange = state.layout[axis].range
            if (oldRange[0] !== newRange[0] || oldRange[1] !== newRange[1]) {
                {
                    const finalRange = enforcePlotSingleAxisRange(oldRange, newRange, minYs.get(axis) - tolerance , maxYs.get(axis) + tolerance)
                    finalYRanges.set(axis, finalRange)
                    yChanged = true
                }
            } else{
                finalYRanges.set(axis, oldRange)
            }

        })

        if (xChanged)
            setXRanges(finalXRanges)
        if (yChanged)
            setYRanges(finalYRanges)
        if (props.onUpdate) {
            props.onUpdate(state)
        }
    }

    const plotLayout = useMemo(() => {
        if (layout.xaxis1 !== undefined) {
            layout.xaxis = layout.xaxis1;
            delete layout.xaxis1;
        }

        if (layout.yaxis1 !== undefined) {
            layout.yaxis = layout.yaxis1;
            delete layout.yaxis1;
        }

        const l = {
            plot_bgcolor: plotStyles.plot_bgcolor,
            paper_bgcolor:
            plotStyles.paper_bgcolor,
            font:
            plotStyles.font,
            dragmode: "pan",
            ...layout
        }

        xAxes.forEach(axis => {
            const range = xRanges.get(axis)
            l[axis] = {
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: plotStyles.axisGridwidth,
                ...l[axis],
                range: range?[range[0], range[1]]:null
            }
        })

        yAxes.forEach(axis => {
            const range = yRanges.get(axis)
            l[axis] = {
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: plotStyles.axisGridwidth,
                ...l[axis],
                range: range?[range[0], range[1]]: null
            }
        })
        return l;
    }, [xRanges, yRanges, xAxes, yAxes, layout, layout.yaxis]);

    const plotConfig = {
        ...config,
        scrollZoom: true, displayModeBar: false
    }
    return <AutoSizePlot
        className = {className}
        data={data}
        layout={plotLayout}
        config={plotConfig}
        onUpdate={handleUpdate}
        {...props}
    />
}