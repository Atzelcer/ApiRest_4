class APIService {
    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getPersonas(page = 1, perPage = 10, search = '') {
        const params = new URLSearchParams({
            page,
            per_page: perPage,
            ...(search && { search })
        });
        return this.request(`/personas?${params}`);
    }

    async getPersona(id) {
        return this.request(`/personas/${id}`);
    }

    async createPersona(data) {
        return this.request('/personas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updatePersona(id, data) {
        return this.request(`/personas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deletePersona(id) {
        return this.request(`/personas/${id}`, {
            method: 'DELETE'
        });
    }
}
