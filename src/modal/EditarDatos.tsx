import { useState, useEffect } from "react"

// 1. Interfaz actualizada para coincidir con la base de datos
interface Usuario {
    id?: number;
    datos: string;
}

interface ModalEditarProps {
    usuario: Usuario | null; 
    isOpen: boolean;
    onClose: () => void;
    // Agregamos Promise<void> porque la función en el padre es async
    onSave: (datosActualizados: Usuario) => void | Promise<void>; 
}

export function ModalEditar({ usuario, isOpen, onClose, onSave }: ModalEditarProps) {
    // Estado para el input usando la propiedad 'datos'
    const [usuarioInput, setUsuarioInput] = useState("")
    const [formErrors, setFormErrors] = useState({ datos: "" })

    // Sincronizar el input con el usuario seleccionado cuando el modal se abre
    useEffect(() => {
        if (usuario) {
            setUsuarioInput(usuario.datos);
        }
    }, [usuario, isOpen]);

    const validarFormulario = (texto: string) => {
        if (texto.trim() === "") {
            setFormErrors({ datos: "El campo no puede estar vacío" });
            return false;
        }
        setFormErrors({ datos: "" });
        return true;
    }

    const handleSave = () => {
        if (validarFormulario(usuarioInput) && usuario) {
            // Enviamos el objeto con el ID original y el texto nuevo
            onSave({
                ...usuario,
                datos: usuarioInput,
            });
        }
    }

    if (!isOpen || !usuario) return null;

    return (
        <div className="fixed inset-0 bg-[#3a373796] bg-opacity-100 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-blue-500 text-2xl font-bold mb-6">Editar Registro</h2>

                <label className="font-semibold mb-2 block">Dato</label>
                <input
                    type="text"
                    value={usuarioInput}
                    onChange={(e) => setUsuarioInput(e.target.value)}
                    className="border-2 rounded-lg p-2 mb-3 w-full focus:outline-none focus:border-blue-500"
                />
                {formErrors.datos && <p className="text-red-500 text-sm mb-2">{formErrors.datos}</p>}

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

export default ModalEditar;
