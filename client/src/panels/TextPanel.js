export default function TextPanel({className}){
    return <div className={className + " bg-gray-300 h-auto min-h-48 w-72"}>
        <p className="text-white">Aquí se mostrará información textual de la sesión seleccionada</p>
    </div>
}