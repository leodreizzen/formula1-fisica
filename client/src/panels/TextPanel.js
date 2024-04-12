export default function TextPanel({className}){
    return <div className={className + " bg-gray-300 h-20 flex-1"}>
        <p className="text-white">Aquí se mostrará información textual de la sesión seleccionada</p>
    </div>
}