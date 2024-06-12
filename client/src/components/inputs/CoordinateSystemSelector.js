export function CoordinateSystemSelector({ className, coordinateSystem, onCoordinateSystemChange, orderedSystems }) {
    const systemLabels = {
        cartesian: "Cartesianas",
        polar: "Polares",
        intrinsic: "Intrínsecas"
    };

    return (
        <div className={`${className}`}>
            {orderedSystems.map(system => (
                <div key={system} className="mt-4 mr-2 ml-2 w-full flex justify-center">
                    <input
                        type="radio"
                        id={system}
                        name="coordinateSystem"
                        value={system}
                        className="hidden"
                        checked={coordinateSystem === system}
                        onChange={onCoordinateSystemChange}
                    />
                    <label
                        htmlFor={system}
                        className={`no-select flex items-center justify-center p-2 border border-white rounded-full cursor-pointer w-28 ${
                            coordinateSystem === system ? "bg-blue-600 text-white" : "bg-white text-black"
                        }`}
                    >
                        {systemLabels[system]}
                    </label>
                </div>
            ))}
        </div>
    );
}
