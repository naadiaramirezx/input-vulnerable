import { supabase } from './conexion';

// OBTENER DATOS
export const obtenerDatos = async () => {
    const { data, error } = await supabase
        .from('datos')
        .select('*');
    
    if (error) {
        console.error('Error al obtener:', error.message);
        return [];
    }
    return data;
};

// INSERTAR DATO
export const agregarDato = async (nuevoTexto) => {
    const { data, error } = await supabase
        .from('datos')
        .insert([{ datos: nuevoTexto }])
        .select(); // Para obtener el dato insertado

    if (error) console.error('Error al insertar:', error.message);
    return data;
};

// ELIMINAR DATO
export const eliminarDato = async (id) => {
    const { error } = await supabase
        .from('datos')
        .delete()
        .eq('id', id);

    if (error) console.error('Error al eliminar:', error.message);
};