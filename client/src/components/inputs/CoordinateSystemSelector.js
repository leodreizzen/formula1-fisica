export function CoordinateSystemSelector({ className, coordinateSystem, onCoordinateSystemChange, availableSystems }) {
    return (
        <div className={`${className} flex flex-col items-start`}>
            {availableSystems.includes("cartesian") && (
                <div className="mt-4 w-full flex justify-center">
                    <input
                        type="radio"
                        id="cartesian"
                        name="coordinateSystem"
                        value="cartesian"
                        className="hidden"
                        checked={coordinateSystem === "cartesian"}
                        onChange={onCoordinateSystemChange}
                    />
                    <label
                        htmlFor="cartesian"
                        className={`no-select flex items-center justify-center p-2 border border-white rounded-full cursor-pointer w-28 ${
                            coordinateSystem === "cartesian" ? "bg-blue-600 text-white" : "bg-white text-black"
                        }`}
                    >
                        Cartesianas
                    </label>
                </div>
            )}
            {availableSystems.includes("polar") && (
                <div className="mt-4 w-full flex justify-center">
                    <input
                        type="radio"
                        id="polar"
                        name="coordinateSystem"
                        value="polar"
                        className="hidden"
                        checked={coordinateSystem === "polar"}
                        onChange={onCoordinateSystemChange}
                    />
                    <label
                        htmlFor="polar"
                        className={`no-select flex items-center justify-center p-2 border border-white rounded-full cursor-pointer w-28 ${
                            coordinateSystem === "polar" ? "bg-blue-600 text-white" : "bg-white text-black"
                        }`}
                    >
                        Polares
                    </label>
                </div>
            )}
            {availableSystems.includes("intrinsic") && (
                <div className="mt-4 w-full flex justify-center">
                    <input
                        type="radio"
                        id="intrinsic"
                        name="coordinateSystem"
                        value="intrinsic"
                        className="hidden"
                        checked={coordinateSystem === "intrinsic"}
                        onChange={onCoordinateSystemChange}
                    />
                    <label
                        htmlFor="intrinsic"
                        className={`no-select flex items-center justify-center p-2 border border-white rounded-full cursor-pointer w-28 ${
                            coordinateSystem === "intrinsic" ? "bg-blue-600 text-white" : "bg-white text-black"
                        }`}
                    >
                        Intrínsecas
                    </label>
                </div>
            )}
        </div>
    );
}
