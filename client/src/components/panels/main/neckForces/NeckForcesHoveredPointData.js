import { trajectoryColor, speedColor } from "../../../../styles";
import { HiOutlineArrowLongUp, HiOutlineArrowLongRight, HiOutlineArrowLongLeft, HiOutlineArrowLongDown } from "react-icons/hi2";
export default function NeckForcesHoveredPointData({ hoveredNeckForcesData }) {

    return (
        <div className="flex flex-col text-xs/4 lg:text-xs/5 xl:text-base 2xl:text-xl no-select">
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
                    <tr style={{ color: trajectoryColor }}>
                        <th>fuerzas del cuello</th>
                        <td className="text-red-600">{(hoveredNeckForcesData.frontal_neck_force / 10).toFixed(2)}</td>
                        <td className="text-blue-500">{(hoveredNeckForcesData.lateral_neck_force / 10).toFixed(2)}</td>
                    </tr>
                    <tr style={{ color: speedColor }}>
                        <th>"Fuerzas" G</th>
                        <td>{(hoveredNeckForcesData.frontal_g_force / 10).toFixed(2)}</td>
                        <td>{(hoveredNeckForcesData.lateral_g_force / 10).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <div className="relative">
                <div className="absolute z-10 top-1/2 left-1/2 -translate-y-1/2">
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 0 && hoveredNeckForcesData.lateral_neck_force / 10 <= 5 && <HiOutlineArrowLongRight className=" text-blue-700 h-auto w-8" style={{ transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 5 && hoveredNeckForcesData.lateral_neck_force / 10 <= 10 && <HiOutlineArrowLongRight className=" text-blue-700 h-auto w-12" style={{ transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 10 && hoveredNeckForcesData.lateral_neck_force / 10 <= 20 && <HiOutlineArrowLongRight className=" text-blue-700 h-auto w-16" style={{ transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 20 && hoveredNeckForcesData.lateral_neck_force / 10 <= 30 && <HiOutlineArrowLongRight className=" text-blue-700 h-auto w-20" style={{ transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 30 && hoveredNeckForcesData.lateral_neck_force / 10 <= 50 && <HiOutlineArrowLongRight className=" text-blue-700 h-auto w-24" style={{ transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 50 && hoveredNeckForcesData.lateral_neck_force / 10 <= 70 && <HiOutlineArrowLongRight className=" text-blue-700 h-auto w-28" style={{ transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 > 70 && <HiOutlineArrowLongRight className=" text-blue-700 h-auto w-32" style={{ transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block' }} />}
                </div>
                <div div className="z-10 absolute top-1/2 right-1/2 -translate-y-1/2 ">
                    {hoveredNeckForcesData.lateral_neck_force / 10 < 0 && hoveredNeckForcesData.lateral_neck_force / 10 >= -5 && <HiOutlineArrowLongLeft className="text-blue-700 h-auto w-8" style={{ transform: 'scaleX(1.5)', transformOrigin: 'right', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 < -5 && hoveredNeckForcesData.lateral_neck_force / 10 >= -10 && <HiOutlineArrowLongLeft className="text-blue-700 h-auto w-12" style={{ transform: 'scaleX(1.5)', transformOrigin: 'right', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 < -10 && hoveredNeckForcesData.lateral_neck_force / 10 >= -20 && <HiOutlineArrowLongLeft className="text-blue-700 h-auto w-16" style={{ transform: 'scaleX(1.5)', transformOrigin: 'right', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 < -20 && hoveredNeckForcesData.lateral_neck_force / 10 >= -30 && <HiOutlineArrowLongLeft className="text-blue-700 h-auto w-20" style={{ transform: 'scaleX(1.5)', transformOrigin: 'right', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 < -30 && hoveredNeckForcesData.lateral_neck_force / 10 >= -50 && <HiOutlineArrowLongLeft className="text-blue-700 h-auto w-24" style={{ transform: 'scaleX(1.5)', transformOrigin: 'right', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 < -50 && hoveredNeckForcesData.lateral_neck_force / 10 >= -70 && <HiOutlineArrowLongLeft className="text-blue-700 h-auto w-28" style={{ transform: 'scaleX(1.5)', transformOrigin: 'right', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.lateral_neck_force / 10 < -70 && <HiOutlineArrowLongLeft className="text-blue-700 h-auto w-32" style={{ transform: 'scaleX(1.5)', transformOrigin: 'right', display: 'inline-block' }} />}

                </div>
                <div className="absolute z-10  left-1/2 -translate-x-1/2 bottom-1/2">
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 0 && hoveredNeckForcesData.frontal_neck_force / 10 <= 5 && <HiOutlineArrowLongUp className="text-red-600 h-8 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'bottom', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 5 && hoveredNeckForcesData.frontal_neck_force / 10 <= 10 && <HiOutlineArrowLongUp className="text-red-600 h-12 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'bottom', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 10 && hoveredNeckForcesData.frontal_neck_force / 10 <= 20 && <HiOutlineArrowLongUp className=" text-red-600 h-16 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'bottom', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 20 && hoveredNeckForcesData.frontal_neck_force / 10 <= 30 && <HiOutlineArrowLongUp className=" text-red-600 h-20 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'bottom', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 30 && hoveredNeckForcesData.frontal_neck_force / 10 <= 50 && <HiOutlineArrowLongUp className=" text-red-600 h-24 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'bottom', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 50 && hoveredNeckForcesData.frontal_neck_force / 10 <= 70 && <HiOutlineArrowLongUp className=" text-red-600 h-28 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'bottom', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 > 70 && <HiOutlineArrowLongUp className=" text-red-600 h-32 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'bottom', display: 'inline-block' }} />}
                </div>
                <div className="absolute z-10 top-1/2 left-1/2  -translate-x-1/2">
                    {hoveredNeckForcesData.frontal_neck_force / 10 < 0 && hoveredNeckForcesData.frontal_neck_force / 10 >= -5 && <HiOutlineArrowLongDown className="text-red-600 h-8 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'top', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 < -5 && hoveredNeckForcesData.frontal_neck_force / 10 >= -10 && <HiOutlineArrowLongDown className="text-red-600 h-12 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'top', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 < -10 && hoveredNeckForcesData.frontal_neck_force / 10 >= -20 && <HiOutlineArrowLongDown className="text-red-600 h-16 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'top', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 < -20 && hoveredNeckForcesData.frontal_neck_force / 10 >= -30 && <HiOutlineArrowLongDown className="text-red-600 h-20 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'top', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 < -30 && hoveredNeckForcesData.frontal_neck_force / 10 >= -50 && <HiOutlineArrowLongDown className="text-red-600 h-24 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'top', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 < -50 && hoveredNeckForcesData.frontal_neck_force / 10 >= -70 && <HiOutlineArrowLongDown className="text-red-600 h-28 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'top', display: 'inline-block' }} />}
                    {hoveredNeckForcesData.frontal_neck_force / 10 < -70 && <HiOutlineArrowLongDown className="text-red-600 h-32 w-auto" style={{ transform: 'scaleY(1.5)', transformOrigin: 'top', display: 'inline-block' }} />}
                </div>
                <img src="/piloto.png" alt="pilot" className="rounded p-5"></img>
            </div>
        </div>
    )
}