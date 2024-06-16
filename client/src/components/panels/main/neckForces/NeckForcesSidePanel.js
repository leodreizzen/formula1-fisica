import NeckForcesHoveredPointData from "./NeckForcesHoveredPointData"

export default function
    NeckForcesSidePanel({ className, hoveredNeckForcesData }) {

    return <div className={className + " bg-[hsl(218,80,10)] rounded-[2rem] p-4 flex"}>
        <div className="m-auto w-full h-full flex flex-col">
            {hoveredNeckForcesData ? (
                <>
                    <NeckForcesHoveredPointData className=" w-full" hoveredNeckForcesData={hoveredNeckForcesData} />
                </>
            ) : <p className="text-white font-bold text-xl">Pasa el mouse sobre el gráfico para ver los datos</p>}
        </div>
    </div>
}