

export default function AccelerationTypeSelector({ onChange, value }) {
    return (
        <div className="flex flex-row w-full">
            <label>
                <input
                    type="radio"
                    value="module"
                    checked={value === "module"}
                    onChange={onChange}
                    className="mr-2 ml-4"
                />
                Modulo
            </label>
            <label>
                <input
                    type="radio"
                    value="tangential"
                    checked={value === "tangential"}
                    onChange={onChange}
                    className="mr-2 ml-3"
                />
                Tangencial
            </label>
            <label>
                <input
                    type="radio"
                    value="normal"
                    checked={value === "normal"}
                    onChange={onChange}
                    className="mr-2 ml-3"
                />
                Normal
            </label>
        </div>
    );
}