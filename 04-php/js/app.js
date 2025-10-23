const API_URL = 'http://127.0.0.1:8000/api';

class ApiClient {
    constructor() {
        this.token = null;
    }

    async login(email, password) {
        try {
            const response = await fetch('api.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success && data.token) {
                this.token = data.token;
                return { success: true };
            }
            
            return { success: false, message: data.message || 'Credenciales incorrectas' };
        } catch (error) {
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }

    async checkSession() {
        try {
            const response = await fetch('api.php?action=check');
            const data = await response.json();
            
            if (data.loggedIn && data.token) {
                this.token = data.token;
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    async logout() {
        await fetch('api.php?action=logout');
        this.token = null;
    }

    async obtenerPersonas() {
        const response = await fetch(`${API_URL}/personas`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
        
        const data = await response.json();
        return data.data.data || data.data || [];
    }

    async crearPersona(datos) {
        const response = await fetch(`${API_URL}/personas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(datos)
        });
        
        return await response.json();
    }

    async actualizarPersona(id, datos) {
        const response = await fetch(`${API_URL}/personas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(datos)
        });
        
        return await response.json();
    }

    async eliminarPersona(id) {
        const response = await fetch(`${API_URL}/personas/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
        
        return await response.json();
    }
}

class LoginApp {
    constructor() {
        this.apiClient = new ApiClient();
        this.init();
    }

    init() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btnLogin = document.getElementById('btnLogin');
        const mensaje = document.getElementById('mensaje');
        
        btnLogin.disabled = true;
        btnLogin.textContent = 'CONECTANDO...';
        mensaje.className = 'mensaje loading';
        mensaje.textContent = 'Conectando con el servidor...';
        
        const result = await this.apiClient.login(email, password);
        
        if (result.success) {
            mensaje.className = 'mensaje success';
            mensaje.textContent = 'Login exitoso. Redirigiendo...';
            
            setTimeout(() => {
                window.location.href = 'dashboard.php';
            }, 500);
        } else {
            mensaje.className = 'mensaje error';
            mensaje.textContent = result.message;
            btnLogin.disabled = false;
            btnLogin.textContent = 'INGRESAR';
        }
    }
}

class DashboardApp {
    constructor() {
        this.apiClient = new ApiClient();
        this.personas = [];
        this.personaSeleccionada = null;
        this.modal = null;
        this.init();
    }

    async init() {
        const isLoggedIn = await this.apiClient.checkSession();
        
        if (!isLoggedIn) {
            window.location.href = 'login.php';
            return;
        }
        
        this.setupElements();
        this.setupEventListeners();
        await this.cargarPersonas();
    }

    setupElements() {
        this.modal = document.getElementById('modalPersona');
        this.closeModal = document.querySelector('.close');
        this.formPersona = document.getElementById('formPersona');
        this.tbody = document.getElementById('tbodyPersonas');
        this.txtBuscar = document.getElementById('txtBuscar');
    }

    setupEventListeners() {
        document.getElementById('btnLogout').addEventListener('click', () => this.logout());
        document.getElementById('btnCrear').addEventListener('click', () => this.abrirModal());
        document.getElementById('btnEditar').addEventListener('click', () => this.editarPersona());
        document.getElementById('btnEliminar').addEventListener('click', () => this.eliminarPersona());
        document.getElementById('btnActualizar').addEventListener('click', () => this.cargarPersonas());
        
        this.closeModal.addEventListener('click', () => this.cerrarModal());
        this.formPersona.addEventListener('submit', (e) => this.guardarPersona(e));
        document.getElementById('btnCancelar').addEventListener('click', () => this.cerrarModal());
        this.txtBuscar.addEventListener('input', () => this.buscarPersonas());
        
        window.addEventListener('click', (e) => {
            if (e.target == this.modal) {
                this.cerrarModal();
            }
        });
    }

    async cargarPersonas() {
        try {
            this.personas = await this.apiClient.obtenerPersonas();
            this.mostrarPersonas(this.personas);
        } catch (error) {
            this.tbody.innerHTML = '<tr><td colspan="7" class="loading">Error al cargar datos</td></tr>';
        }
    }

    mostrarPersonas(lista) {
        this.tbody.innerHTML = '';
        
        if (lista.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay personas registradas</td></tr>';
            return;
        }
        
        lista.forEach(persona => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${persona.id}</td>
                <td>${persona.nombres}</td>
                <td>${persona.apellidos}</td>
                <td>${persona.ci}</td>
                <td>${persona.direccion}</td>
                <td>${persona.telefono}</td>
                <td>${persona.email}</td>
            `;
            
            tr.addEventListener('click', () => this.seleccionarPersona(persona, tr));
            tr.addEventListener('dblclick', () => {
                this.seleccionarPersona(persona, tr);
                this.editarPersona();
            });
            
            this.tbody.appendChild(tr);
        });
    }

    seleccionarPersona(persona, fila) {
        document.querySelectorAll('tbody tr').forEach(tr => tr.classList.remove('selected'));
        fila.classList.add('selected');
        this.personaSeleccionada = persona;
    }

    abrirModal(persona = null) {
        document.getElementById('modalTitulo').textContent = persona ? 'EDITAR PERSONA' : 'CREAR PERSONA';
        document.getElementById('personaId').value = persona?.id || '';
        document.getElementById('nombres').value = persona?.nombres || '';
        document.getElementById('apellidos').value = persona?.apellidos || '';
        document.getElementById('ci').value = persona?.ci || '';
        document.getElementById('direccion').value = persona?.direccion || '';
        document.getElementById('telefono').value = persona?.telefono || '';
        document.getElementById('emailPersona').value = persona?.email || '';
        
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.textContent = persona ? 'ACTUALIZAR' : 'GUARDAR';
        btnGuardar.style.background = persona ? '#3498db' : '#27ae60';
        
        this.modal.style.display = 'block';
    }

    cerrarModal() {
        this.modal.style.display = 'none';
        this.formPersona.reset();
    }

    async guardarPersona(e) {
        e.preventDefault();
        
        const id = document.getElementById('personaId').value;
        const datos = {
            nombres: document.getElementById('nombres').value,
            apellidos: document.getElementById('apellidos').value,
            ci: document.getElementById('ci').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('emailPersona').value
        };
        
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'GUARDANDO...';
        
        try {
            let result;
            if (id) {
                result = await this.apiClient.actualizarPersona(id, datos);
            } else {
                result = await this.apiClient.crearPersona(datos);
            }
            
            if (result.success) {
                alert(id ? 'Persona actualizada exitosamente' : 'Persona creada exitosamente');
                this.cerrarModal();
                await this.cargarPersonas();
            } else {
                alert('Error: ' + (result.message || 'No se pudo guardar'));
            }
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            btnGuardar.disabled = false;
            btnGuardar.textContent = id ? 'ACTUALIZAR' : 'GUARDAR';
        }
    }

    editarPersona() {
        if (!this.personaSeleccionada) {
            alert('Seleccione una persona de la tabla');
            return;
        }
        this.abrirModal(this.personaSeleccionada);
    }

    async eliminarPersona() {
        if (!this.personaSeleccionada) {
            alert('Seleccione una persona de la tabla');
            return;
        }
        
        if (!confirm(`¿Está seguro de eliminar a ${this.personaSeleccionada.nombres} ${this.personaSeleccionada.apellidos}?`)) {
            return;
        }
        
        try {
            const result = await this.apiClient.eliminarPersona(this.personaSeleccionada.id);
            
            if (result.success) {
                alert('Persona eliminada exitosamente');
                this.personaSeleccionada = null;
                await this.cargarPersonas();
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    buscarPersonas() {
        const filtro = this.txtBuscar.value.toLowerCase();
        
        if (!filtro) {
            this.mostrarPersonas(this.personas);
            return;
        }
        
        const filtradas = this.personas.filter(p => 
            p.id.toString().includes(filtro) ||
            p.nombres.toLowerCase().includes(filtro) ||
            p.apellidos.toLowerCase().includes(filtro) ||
            p.ci.toLowerCase().includes(filtro)
        );
        
        this.mostrarPersonas(filtradas);
    }

    async logout() {
        if (confirm('¿Está seguro de cerrar sesión?')) {
            await this.apiClient.logout();
            window.location.href = 'login.php';
        }
    }
}

if (document.getElementById('loginForm')) {
    new LoginApp();
}

if (document.getElementById('tablaPersonas')) {
    new DashboardApp();
}
