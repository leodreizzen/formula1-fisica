import {trajectoryColor, speedColor} from "../../../../styles";
import {
    HiOutlineArrowLongUp,
    HiOutlineArrowLongRight,
    HiOutlineArrowLongLeft,
    HiOutlineArrowLongDown
} from "react-icons/hi2";
import {useResizeDetector} from "react-resize-detector";

export default function NeckForcesHoveredPointData({hoveredNeckForcesData}) {

    const {height, ref} = useResizeDetector();

    function arrowLength(force) {
        return (height / 575 * Math.min(120,Math.max(30, Math.abs(force) * 2)))
    }
    const arrowWidth = height / 575 * 80

    return (
        <div ref={ref} className="flex flex-col text-xs/4 lg:text-xs/5 xl:text-base 2xl:text-xl no-select">
            <p>Tiempo: {hoveredNeckForcesData.time.match(/(\d{2}):(\d{2})\.(\d{3})/)[0]}</p>
            <table className="table-auto">
                <thead>
                <tr>
                    <th></th>
                    <th>Frontal</th>
                    <th>Lateral</th>
                </tr>
                </thead>
                <tbody>
                <tr style={{color: trajectoryColor}}>
                    <th>fuerzas del cuello</th>
                    <td className="text-red-600">{(hoveredNeckForcesData.frontal_neck_force / 10).toFixed(2)} N</td>
                    <td className="text-blue-500">{(hoveredNeckForcesData.lateral_neck_force / 10).toFixed(2)} N</td>
                </tr>
                <tr style={{color: speedColor}}>
                    <th>"Fuerzas" G</th>
                    <td>{(hoveredNeckForcesData.frontal_g_force / 10).toFixed(2)} G</td>
                    <td>{(hoveredNeckForcesData.lateral_g_force / 10).toFixed(2)} G</td>
                </tr>
                </tbody>
            </table>
            <div className="relative">
                <div className="absolute z-10 top-1/2 left-1/2 -translate-y-1/2">
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 0 && <HiOutlineArrowLongRight
                        className="text-blue-700"
                        style={{transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block', width: arrowLength(hoveredNeckForcesData.lateral_neck_force / 10) + "px", height: arrowWidth + "px"}}
                        viewBox="4 0 24 24" preserveAspectRatio="none"/>}
                </div>
                <div className="z-10 absolute top-1/2 right-1/2 -translate-y-1/2 ">
                    {hoveredNeckForcesData.lateral_neck_force / 10 < 0 &&
                        <HiOutlineArrowLongLeft
                            className="text-blue-700"
                            style={{
                                transform: 'scaleX(1.5)',
                                transformOrigin: 'right',
                                display: 'inline-block',
                                width: arrowLength(hoveredNeckForcesData.lateral_neck_force / 10) + "px",
                                height: arrowWidth + "px"
                            }} viewBox="0 0 20 24" preserveAspectRatio="none"/>}
                </div>
                <div className="absolute z-10  left-1/2 -translate-x-1/2 bottom-1/2">
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 0 &&
                        <HiOutlineArrowLongUp
                            className="text-red-600 w-20"
                            style={{
                                transform: 'scaleY(1.5)',
                                transformOrigin: 'bottom',
                                display: 'inline-block',
                                height: arrowLength(hoveredNeckForcesData.frontal_neck_force / 10) + "px",
                                width: arrowWidth + "px"

                            }} viewBox="0 0 24 20" preserveAspectRatio="none"/>}
                </div>
                <div className="absolute z-10 top-1/2 left-1/2  -translate-x-1/2">
                    {hoveredNeckForcesData.frontal_neck_force / 10 < 0 &&
                        <HiOutlineArrowLongDown
                            className="text-red-600 w-20"
                            style={{
                                transform: 'scaleY(1.5)',
                                transformOrigin: 'top',
                                display: 'inline-block',
                                height: arrowLength(hoveredNeckForcesData.frontal_neck_force / 10) + "px",
                                width: arrowWidth + "px"
                            }} viewBox="0 4 24 24" preserveAspectRatio="none"/>}
                </div>
                <img src="/piloto.png" alt="pilot" className="rounded p-5"></img>
            </div>
        </div>
    )
}