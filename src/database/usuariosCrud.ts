import { supabase } from './conexion';

// Interfaz para TypeScript
interface Usuario {
    id?: number;
    datos: string;
}

const sanitizar = (texto: string): string => {
    return texto.replace(/<[^>]*>?/gm, '').trim();
};

export const obtenerDatos = async (): Promise<Usuario[]> => {
    const { data, error } = await supabase
        .from('datos')
        .select('*')
        .order('id', { ascending: true });
    
    if (error) {
        console.error('Error de acceso:', error.message);
        return [];
    }
    return data || [];
};

export const agregarDato = async (nuevoTexto: string) => {
    const textoSeguro = sanitizar(nuevoTexto);
    if (!textoSeguro) return null;

    const { data, error } = await supabase
        .from('datos')
        .insert([{ datos: textoSeguro }])
        .select();

    if (error) return null;
    return data;
};

export const eliminarDato = async (id: number) => {
    const { error } = await supabase
        .from('datos')
        .delete()
        .eq('id', id);
    if (error) console.error('Error al eliminar:', error.message);
};

export const actualizarDato = async (id: number, textoActualizado: string) => {
    const textoSeguro = sanitizar(textoActualizado);
    
    const { data, error } = await supabase
        .from('datos')
        .update({ datos: textoSeguro }) 
        .eq('id', id)                   
        .select();                      

    if (error) {
        console.error('Error en Supabase:', error.message);
        return null;
    }
    return data; // Esto devuelve un array con el objeto actualizado [ {id: 1, datos: '...' } ]
};