import { useEffect, useState } from "react"
import ModalEditar from "../modal/EditarDatos"
import { obtenerDatos, agregarDato, eliminarDato, actualizarDato } from "../database/usuariosCrud"

export function Formulario() {
    interface Usuario {
        id?: number;
        datos: string;
    }

    const [usuarioInput, setUsuarioInput] = useState("")
    const [hpValue, setHpValue] = useState("")
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [formErrors, setFormErrors] = useState({ usuario: "" })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)

    useEffect(() => {
        const cargar = async () => {
            const data = await obtenerDatos();
            setUsuarios(data);
        }
        cargar();
    }, [])

    const handleEditarClick = (usuario: Usuario) => {
        setUsuarioEditando(usuario);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUsuarioEditando(null);
    }

    const handleSaveModal = async (datosActualizados: Usuario) => {
        if (!usuarioEditando?.id) return;
        const data = await actualizarDato(usuarioEditando.id, datosActualizados.datos);
        if (data) {
            setUsuarios(usuarios.map(user =>
                user.id === usuarioEditando.id ? { ...user, datos: data[0].datos } : user
            ));
            handleCloseModal();
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hpValue !== "") return;
        if (usuarioInput.trim() === "") {
            setFormErrors({ usuario: "El campo no puede estar vacío" });
            return;
        }
        const data = await agregarDato(usuarioInput);
        if (data) {
            setUsuarios([...usuarios, data[0]]);
            setUsuarioInput("");
            setFormErrors({ usuario: "" });
        } else {
            setFormErrors({ usuario: "Error de seguridad o servidor" });
        }
    }

    const handleEliminar = async (id?: number) => {
        if (!id || !window.confirm("¿Estás seguro?")) return;
        await eliminarDato(id);
        setUsuarios(usuarios.filter(user => user.id !== id));
    }

    return (
        <div className="bg-amber-50 min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                    <h2 className="text-blue-500 text-2xl font-bold mb-6">Inicia Sesión</h2>
                    <form className="flex flex-col p-4" onSubmit={handleSubmit}>
                        <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}>
                            <input
                                type="text"
                                tabIndex={-1}
                                autoComplete="off"
                                value={hpValue}
                                onChange={(e) => setHpValue(e.target.value)}
                            />
                        </div>
                        <label className="font-semibold mb-2">Usuario</label>
                        <input
                            type="text"
                            id="user_field_safe"
                            value={usuarioInput}
                            maxLength={100}
                            autoComplete="off"
                            onChange={(e) => setUsuarioInput(e.target.value)}
                            placeholder="Escribe algo seguro..."
                            className="border-2 rounded-2xl p-2 mb-3 focus:outline-none focus:border-blue-500"
                        />
                        {formErrors.usuario && <p className="text-red-500 font-semibold text-sm mb-2">{formErrors.usuario}</p>}
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
                                        <th className="p-3 text-left">#</th>
                                        <th className="p-3 text-left w-2/3">Datos</th>
                                        <th className="p-3 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-100 border-b">
                                            <td className="p-3 font-bold text-black">
                                                {index + 1}
                                            </td>
                                            <td className="p-3 text-black break-words overflow-hidden max-w-[200px] sm:max-w-[400px]">
                                                {item.datos}
                                            </td>
                                            <td className="p-2">
                                                <div className="flex flex-col gap-2">
                                                    <button onClick={() => handleEditarClick(item)} className="bg-purple-500 text-white text-xs py-1 px-2 rounded">Editar</button>
                                                    <button onClick={() => handleEliminar(item.id)} className="bg-red-500 text-white text-xs py-1 px-2 rounded">Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

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

export default Formulario;