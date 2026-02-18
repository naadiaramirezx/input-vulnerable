import { useEffect, useState } from "react"
import ModalEditar from "../modal/EditarDatos"
// 1. Importa el cliente de supabase que configuraste
import { supabase } from "../database/conexion"
export function Formulario() {
    // 2. Ajustamos la interfaz a tu base de datos real (id y datos)
    interface Usuario {
        id?: number;
        datos: string;
    }

    const [usuarioInput, setUsuarioInput] = useState("")
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [formErrors, setFormErrors] = useState({ usuario: "" })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)

    const validarFormulario = (usuario: string) => {
        if (usuario === "") {
            setFormErrors({ usuario: "El campo no puede estar vacío" })
            return false
        }
        setFormErrors({ usuario: "" })
        return true
    }

    useEffect(() => {
        const leerDatos = async () => {
            const { data, error } = await supabase
                .from('datos') // Nombre de tu tabla
                .select('*')

            if (error) console.error('Error:', error)
            else setUsuarios(data || [])
        }
        leerDatos()
    }, [])

    //manejar envio del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validarFormulario(usuarioInput)) {
            try {
                const { data, error } = await supabase
                    .from('datos')
                    .insert([{ datos: usuarioInput }])
                    .select() // select() devuelve el objeto insertado con su ID

                if (error) throw error;

                if (data) {
                    setUsuarios([...usuarios, data[0]]);
                    setUsuarioInput("");
                }
            } catch (error) {
                console.error("Error:", error);
                setFormErrors({ usuario: 'Error al conectar con Supabase' });
            }
        }
    }

    const handleEliminar = async (idAEliminar?: number) => {
        if (!idAEliminar) return;

        const { error } = await supabase
            .from('datos')
            .delete()
            .eq('id', idAEliminar)

        if (error) {
            console.error('Error al eliminar:', error)
        } else {
            setUsuarios(usuarios.filter(user => user.id !== idAEliminar))
        }
    }

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
    const handleSaveModal = async (datosActualizados: Usuario) => {
        try {
            // 1. Actualizamos en Supabase usando el ID
            const { error } = await supabase
                .from('datos')
                .update({ datos: datosActualizados.datos })
                .eq('id', usuarioEditando?.id);

            if (error) throw error;

            // 2. Actualizamos el estado local para que se vea el cambio en la tabla
            setUsuarios(usuarios.map(user =>
                user.id === usuarioEditando?.id ? { ...user, datos: datosActualizados.datos } : user
            ));

            handleCloseModal();
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("No se pudo actualizar el registro");
        }
    }


    return (
        <div className="bg-amber-50 min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                    <h2 className="text-blue-500 text-2xl font-bold mb-6">Inicia Sesión</h2>
                    <form className="flex flex-col p-4" onSubmit={handleSubmit}>
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
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-500 text-white">
                                        <th className="border border-blue-500 p-3 text-left">Id</th>
                                        <th className="border border-blue-500 p-3 text-left w-2/3">Datos</th>
                                        <th className="border border-blue-500 p-3 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* el .mpa mapea cada elemento de la lista de usuarios y los muestra en la tabla */}
                                    {usuarios.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-100">

                                            <td className="border border-gray-300 p-3">{item.id}</td>
                                            <td className="border border-gray-300 p-3 max-w-xs truncate">{item.datos}</td>
                                            <td className="border border-gray-300 p-2 w-32"> {/* Ancho fijo pequeño para acciones */}
                                                <div className="flex flex-col gap-2">
                                                    <button className="bg-purple-500 ... text-sm py-1">Editar</button>
                                                    <button className="bg-red-500 ... text-sm py-1">Eliminar</button>
                                                </div>
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