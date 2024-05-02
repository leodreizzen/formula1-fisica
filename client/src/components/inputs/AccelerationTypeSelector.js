import { plotStyles } from "../../styles";

export default function AccelerationTypeSelector({ onChange, value }) {
    return (
        <div className="flex flex-row w-full">
            <div>
                <input
                    id="module"
                    type="radio"
                    value="module"
                    checked={value === "module"}
                    onChange={onChange}
                    className="mr-2 ml-4 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="module" className="radio-label text-lg text-gray-900 dark:text-gray-300">Modulo</label>
            </div>
            <div>
                <input
                    id="tangential"
                    type="radio"
                    value="tangential"
                    checked={value === "tangential"}
                    onChange={onChange}
                    className="mr-2 ml-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="tangential" className="radio-label text-lg text-gray-900 dark:text-gray-300">Tangencial</label>
            </div>
            <div>
                <input
                    id="normal"
                    type="radio"
                    value="normal"
                    checked={value === "normal"}
                    onChange={onChange}
                    className="mr-2 ml-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="normal" className="radio-label text-lg text-gray-900 dark:text-gray-300">Normal</label>
            </div>
            {/* Estilos agregados a los labels */}
            <style>{`
                .radio-label {
                    font-family: ${plotStyles.font.family};
                    font-size: ${plotStyles.font.size}px;
                    color: ${plotStyles.font.color};
                }
            `}</style>
        </div>
    );
}