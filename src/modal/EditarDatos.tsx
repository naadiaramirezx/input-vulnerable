import { useState } from "react"

interface Usuario {
    usuario: string
}

interface ModalEditarProps {
    usuario: Usuario 
    isOpen: boolean
    onClose: () => void
    onSave: (datosActualizados: Usuario) => void //los datos actualizados son los datos del usuario que se edita
}

export function ModalEditar({ usuario, isOpen, onClose, onSave }: ModalEditarProps) {

    const [usuarioInput, setUsuarioInput] = useState(usuario?.usuario || "") //este const almacena el input en usuario
    const [formErrors, setFormErrors] = useState<{ usuario: string}>({
        usuario: "",
        
    })

    // Validar formulario
    const validarFormulario = (usuario: string) => {
        if (usuario === "") {
            setFormErrors({ usuario: "El campo de usuario no puede estar vacío" })
            return false
        }
        setFormErrors({ usuario: "" })
        return true
    }

    // Manejar guardado de datos editados
    const handleSave = () => {
        if (validarFormulario(usuarioInput) && usuario) {
            onSave({
                usuario: usuarioInput,
            })
            onClose()
        }
    }

    if (!isOpen || !usuario) return null // Si el modal no está abierto o no hay usuario, no renderiza nada

    return (
        <div className="fixed inset-0 bg-[#3a373796] bg-opacity-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-blue-500 text-2xl font-bold mb-6">Editar Datos de Usuario</h2>

                <label className="font-semibold mb-2 block">Usuario</label>
                <input
                    type="text"
                    value={usuarioInput}
                    onChange={(e) => setUsuarioInput(e.target.value)}
                    className="border-2 rounded-lg p-2 mb-3 w-full focus:outline-none focus:border-blue-500"
                />
                {formErrors.usuario && <p className="text-red-500 text-sm mb-2">{formErrors.usuario}</p>}

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 font-semibold"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-semibold"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalEditar