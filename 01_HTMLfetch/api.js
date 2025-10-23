const API_URL = 'http://localhost:8000/api';

const api = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    getPersonas: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/personas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    getPersona: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/personas/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    crearPersona: async (data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/personas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear persona');
        }
        
        return response.json();
    },

    actualizarPersona: async (id, data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/personas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar persona');
        }
        
        return response.json();
    },

    eliminarPersona: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/personas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar persona');
        }
        
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    }
};