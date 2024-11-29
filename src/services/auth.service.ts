
import api from '../api_axios';
import { Roles } from '../models/enums/roles_enum';

const API_URL = "/users"; // Cambia esto por tu URL

// Login del usuario
export const login = async (username: string, password: string) => {
    try {
        const response = await api.post(`${API_URL}/login/`, { username, password });
        
        if (response.data.token) {
            // Guarda el token en el localStorage
            localStorage.setItem('token', response.data.token);
            
            // Guarda los datos del usuario
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        console.log(error) 
    }
};

// Obtener el token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Obtener el usuario autenticado
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Logout del usuario
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const hasRole = (roles: Roles[]): boolean => {
    const user = getUser();

    if (user && user.roles) {
        // Verifica si el usuario tiene al menos uno de los roles
        return roles.some(role => user.roles.includes(role));
    }

    return false;
};

