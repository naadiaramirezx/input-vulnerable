import { useEffect, useState } from "react"
import ModalEditar from "../modal/EditarDatos"


export function Formulario() {

    interface Usuario {
        usuario: string
    }

    const [usuarioInput, setUsuarioInput] = useState("") //constante para el input del usuario
    const [usuarios, setUsuarios] = useState<Usuario[]>([]) //esta constante almacena los usuarios
    const [formErrors, setFormErrors] = useState<{ usuario: string }>({
        usuario: ""
    }) //const para los errores del formulario
    const [isModalOpen, setIsModalOpen] = useState(false) //estado para controlar si el modal está abierto
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null) //estado para guardar el usuario que se está editando

    //validacion de formulario
    const validarFormulario = (usuario: string) => {
        if (usuario === "") { //si el usuario es vacio
            setFormErrors({ usuario: "El campo de usuario no puede estar vacío" })
            return false
        }
        setFormErrors({ usuario: "" })
        return true
    }

    //manejar envio del formulario
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (validarFormulario(usuarioInput)) {
    //         try {
    //             const response = await fetch('https://mysql-seguridad.alwaysdata.net/usuariosCrud.php', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({ usuario: usuarioInput })
    //             });

    //             const json = await response.json().catch(() => ({}));
    //             console.log('POST response:', json);

    //             if (response.ok) {
    //                 setUsuarios([...usuarios, { usuario: usuarioInput }]);
    //                 setUsuarioInput("");
    //             } else {
    //                 setFormErrors({ usuario: json.error || 'Error al insertar datos' });
    //                 console.error('Server error:', json);
    //             }
    //         } catch (error) {
    //             console.error("Error al insertar datos:", error);
    //             setFormErrors({ usuario: 'Error de red al insertar datos' });
    //         }
    //     }
    // }

    //manejar apertura del modal de edición
    const handleEditarClick = (usuario: Usuario) => {
        setUsuarioEditando(usuario)
        setIsModalOpen(true)
    }

    //manejar cierre del modal
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setUsuarioEditando(null)
    }

    //manejar guardado de datos editados
    const handleSaveModal = (datosActualizados: Usuario) => {
        setUsuarios(usuarios.map(user =>
            user.usuario === usuarioEditando?.usuario ? datosActualizados : user
        ))
        handleCloseModal()
    }

    //manejar eliminación de usuario
    const handleEliminar = (usuarioAEliminar: string) => {
        setUsuarios(usuarios.filter(user => user.usuario !== usuarioAEliminar))
    }

    //const para cargar datos a la bd
    // useEffect(() => {
    //     fetch('https://mysql-seguridad.alwaysdata.net/usuariosCrud.php')
    //         .then(res => res.json())
    //         .then(data => {
    //             setUsuarios(data.map((u: any) => ({ usuario: u.users })))
    //         });
    // }, []);

    return (
        <div className="bg-amber-50 min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                    <h2 className="text-blue-500 text-2xl font-bold mb-6">Inicia Sesión</h2>
                    <form className="flex flex-col p-4" >
                        <label className="font-semibold mb-2">Usuario</label>
                        <input
                            type="text"
                            id="user"
                            value={usuarioInput}
                            onChange={(e) => setUsuarioInput(e.target.value)} //cuando cambia el input se actualiza la variable(usuario)
                            placeholder="Usuario"
                            className="border-2 rounded-2xl p-2 mb-3 focus:outline-none focus:border-blue-500"
                        />
                        {formErrors.usuario && <p className="text-red-500 font-semibold text-sm mb-2">{formErrors.usuario}</p>} {/*mensaje de error */}

                        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 font-semibold">Ingresar</button>
                    </form>
                </div>

                {usuarios.length > 0 && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-blue-500 text-2xl font-bold mb-6">Tabla de Registros</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-500 text-white">
                                        <th className="border border-blue-500 p-3 text-left">Usuario</th>
                                        <th className="border border-blue-500 p-3 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* el .mpa mapea cada elemento de la lista de usuarios y los muestra en la tabla */}
                                    {usuarios.map((users) => (
                                        <tr key={users.usuario} className="hover:bg-gray-100">

                                            <td className="border border-gray-300 p-3">{users.usuario}</td>
                                            <td className="border border-gray-300 p-3">
                                                <button
                                                    onClick={() => handleEditarClick(users)}
                                                    className="bg-purple-500 text-white py-2 px-4  mr-4 rounded-lg  font-semibold">Editar</button>
                                                <button
                                                    onClick={() => handleEliminar(users.usuario)}
                                                    className="bg-red-500 text-white py-2 px-4 rounded-lg  font-semibold">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal para editar usuario */}
                {usuarioEditando && (
                    <ModalEditar
                        usuario={usuarioEditando}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSave={handleSaveModal}
                    />
                )}
            </div>
        </div>
    )
}

export default Formulario