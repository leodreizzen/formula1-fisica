import {trajectoryColor, speedColor} from "../../../../styles";
import {
    HiOutlineArrowLongUp,
    HiOutlineArrowLongRight,
    HiOutlineArrowLongLeft,
    HiOutlineArrowLongDown
} from "react-icons/hi2";
import clsx from "clsx";

export default function NeckForcesHoveredPointData({hoveredNeckForcesData}) {

    function lateralArrowWidthClass(force) {
        return clsx(
            {
                "w-8": force <= 5,
                "w-12": force > 5 && force <= 10,
                "w-16": force > 10 && force <= 20,
                "w-20": force > 20 && force <= 30,
                "w-24": force > 30 && force <= 50,
                "w-28": force > 50 && force <= 70,
                "w-32": force > 70
            }
        )
    }

        function verticalArrowHeightClass(force) {
            return clsx(
                {
                    "h-8": force <= 5,
                    "h-12": force > 5 && force <= 10,
                    "h-16": force > 10 && force <= 20,
                    "h-20": force > 20 && force <= 30,
                    "h-24": force > 30 && force <= 50,
                    "h-28": force > 50 && force <= 70,
                    "h-32": force > 70
                }
            )
        }

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
                    <tr style={{color: trajectoryColor}}>
                        <th>fuerzas del cuello</th>
                        <td className="text-red-600">{(hoveredNeckForcesData.frontal_neck_force / 10).toFixed(2)}</td>
                        <td className="text-blue-500">{(hoveredNeckForcesData.lateral_neck_force / 10).toFixed(2)}</td>
                    </tr>
                    <tr style={{color: speedColor}}>
                        <th>"Fuerzas" G</th>
                        <td>{(hoveredNeckForcesData.frontal_g_force / 10).toFixed(2)}</td>
                        <td>{(hoveredNeckForcesData.lateral_g_force / 10).toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="relative">
                    <div className="absolute z-10 top-1/2 left-1/2 -translate-y-1/2">
                        {hoveredNeckForcesData.lateral_neck_force / 10 > 0 && <HiOutlineArrowLongRight
                            className={clsx("text-blue-700 h-auto", lateralArrowWidthClass(hoveredNeckForcesData.lateral_neck_force / 10))}
                            style={{transform: 'scaleX(1.5)', transformOrigin: 'left', display: 'inline-block'}}
                        viewBox="4 0 24 24"/>}
                    </div>
                    <div className="z-10 absolute top-1/2 right-1/2 -translate-y-1/2 ">
                        {hoveredNeckForcesData.lateral_neck_force / 10 < 0 &&
                            <HiOutlineArrowLongLeft className={clsx("text-blue-700 h-auto", -hoveredNeckForcesData.lateral_neck_force / 10)} style={{
                                transform: 'scaleX(1.5)',
                                transformOrigin: 'right',
                                display: 'inline-block'
                            }} viewBox="0 0 20 24"/>}
                    </div>
                    <div className="absolute z-10  left-1/2 -translate-x-1/2 bottom-1/2">
                        {hoveredNeckForcesData.frontal_neck_force / 10 > 0 &&
                            <HiOutlineArrowLongUp className={clsx("text-red-600 w-auto", verticalArrowHeightClass(hoveredNeckForcesData.frontal_neck_force / 10))} style={{
                                transform: 'scaleY(1.5)',
                                transformOrigin: 'bottom',
                                display: 'inline-block'
                            }} viewBox="0 0 24 20"/>}
                    </div>
                    <div className="absolute z-10 top-1/2 left-1/2  -translate-x-1/2">
                        {hoveredNeckForcesData.frontal_neck_force / 10 < 0 &&
                            <HiOutlineArrowLongDown className={clsx("text-red-600 w-auto", verticalArrowHeightClass(-hoveredNeckForcesData.frontal_neck_force / 10))} style={{
                                transform: 'scaleY(1.5)',
                                transformOrigin: 'top',
                                display: 'inline-block'
                            }} viewBox="0 4 24 24"/>}
                    </div>
                    <img src="/piloto.png" alt="pilot" className="rounded p-5"></img>
                </div>
            </div>
        )
    }