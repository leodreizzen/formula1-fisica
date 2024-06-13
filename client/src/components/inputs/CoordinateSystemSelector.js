export function CoordinateSystemSelector({ className, currentSystem, onCoordinateSystemChange }) {
    const systemLabels = {
        cartesian: "Cartesianas",
        polar: "Polares",
        intrinsic: "Intrínsecas"
    }

    const coordinateSystems = ["cartesian", "polar", "intrinsic"];

    return (
        <div className={`${className}`}>
            {coordinateSystems.map(system => (
                <div key={system} className="mt-4 mx-2 w-full flex justify-center">
                    <input
                        type="radio"
                        id={system}
                        name="coordinateSystemSelector"
                        value={system}
                        className="hidden"
                        checked={currentSystem === system}
                        onChange={onCoordinateSystemChange}
                    />
                    <label
                        htmlFor={system}
                        className={`no-select flex items-center justify-center p-2 border border-white rounded-full cursor-pointer w-28 ${
                            currentSystem === system ? "bg-blue-600 text-white" : "bg-white text-black"
                        }`}
                    >
                        {systemLabels[system]}
                    </label>
                </div>
            ))}
        </div>
    );
}
