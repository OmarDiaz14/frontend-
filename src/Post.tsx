import { useState } from 'react';
import axios from 'axios';



export const MiFormulario = () => {
    const [ID, setNombre] = useState('');
    const [Codigo, setEmail] = useState('');
    const [Descripcion, setDescripcion] = useState ('')

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault(); // Evita el comportamiento por defecto del formulario

        const nuevoUsuario = {
            id_seccion: ID,
            codigo: Codigo,
            descripcion: Descripcion
        };

        axios.post(import.meta.env.VITE_API_URL + '/cuadro/seccion/', nuevoUsuario)
            .then(response => {
                console.log('Usuario creado:', response.data);
            })
            .catch(error => {
                console.error('Error al crear usuario:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>ID_Seccion:</label>
            <input type="text" value={ID} onChange={(e) => setNombre(e.target.value)} />
            <label>Codigo:</label>
            <input type="text" value={Codigo} onChange={(e) => setEmail(e.target.value)} />
            <label>Descripcion:</label>
            <input type="text" value={Descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
            <button type="submit">Crear Usuario</button>
        </form>
    );
};