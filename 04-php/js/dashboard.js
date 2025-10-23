const API_URL = 'http://127.0.0.1:8000/api';
let token = null;
let personas = [];
let personaSeleccionada = null;

const modal = document.getElementById('modalPersona');
const closeModal = document.querySelector('.close');
const formPersona = document.getElementById('formPersona');
const tbody = document.getElementById('tbodyPersonas');
const txtBuscar = document.getElementById('txtBuscar');

async function init() {
    token = await obtenerToken();
    if (!token) {
        window.location.href = 'login.php';
        return;
    }
    
    await cargarPersonas();
    setupEventListeners();
}

async function obtenerToken() {
    try {
        const response = await fetch('api.php?action=check');
        const data = await response.json();
        
        if (data.loggedIn && data.token) {
            return data.token;
        }
        return null;
    } catch {
        return null;
    }
}

function setupEventListeners() {
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('btnCrear').addEventListener('click', () => abrirModal());
    document.getElementById('btnEditar').addEventListener('click', editarPersona);
    document.getElementById('btnEliminar').addEventListener('click', eliminarPersona);
    document.getElementById('btnActualizar').addEventListener('click', cargarPersonas);
    closeModal.addEventListener('click', cerrarModal);
    formPersona.addEventListener('submit', guardarPersona);
    document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
    txtBuscar.addEventListener('input', buscarPersonas);
    
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            cerrarModal();
        }
    });
}

async function cargarPersonas() {
    try {
        const response = await fetch(`${API_URL}/personas`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        personas = data.data.data || data.data || [];
        mostrarPersonas(personas);
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Error al cargar datos</td></tr>';
    }
}

function mostrarPersonas(lista) {
    tbody.innerHTML = '';
    
    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay personas registradas</td></tr>';
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
        
        tr.addEventListener('click', () => seleccionarPersona(persona, tr));
        tr.addEventListener('dblclick', () => {
            seleccionarPersona(persona, tr);
            editarPersona();
        });
        
        tbody.appendChild(tr);
    });
}

function seleccionarPersona(persona, fila) {
    document.querySelectorAll('tbody tr').forEach(tr => tr.classList.remove('selected'));
    fila.classList.add('selected');
    personaSeleccionada = persona;
}

function abrirModal(persona = null) {
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
    
    modal.style.display = 'block';
}

function cerrarModal() {
    modal.style.display = 'none';
    formPersona.reset();
}

async function guardarPersona(e) {
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
        const url = id ? `${API_URL}/personas/${id}` : `${API_URL}/personas`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(id ? 'Persona actualizada exitosamente' : 'Persona creada exitosamente');
            cerrarModal();
            await cargarPersonas();
        } else {
            alert('Error: ' + (data.message || 'No se pudo guardar'));
        }
    } catch (error) {
        alert('Error al guardar: ' + error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = id ? 'ACTUALIZAR' : 'GUARDAR';
    }
}

function editarPersona() {
    if (!personaSeleccionada) {
        alert('Seleccione una persona de la tabla');
        return;
    }
    abrirModal(personaSeleccionada);
}

async function eliminarPersona() {
    if (!personaSeleccionada) {
        alert('Seleccione una persona de la tabla');
        return;
    }
    
    if (!confirm(`¿Está seguro de eliminar a ${personaSeleccionada.nombres} ${personaSeleccionada.apellidos}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/personas/${personaSeleccionada.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Persona eliminada exitosamente');
            personaSeleccionada = null;
            await cargarPersonas();
        } else {
            alert('Error al eliminar');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function buscarPersonas() {
    const filtro = txtBuscar.value.toLowerCase();
    
    if (!filtro) {
        mostrarPersonas(personas);
        return;
    }
    
    const filtradas = personas.filter(p => 
        p.id.toString().includes(filtro) ||
        p.nombres.toLowerCase().includes(filtro) ||
        p.apellidos.toLowerCase().includes(filtro) ||
        p.ci.toLowerCase().includes(filtro)
    );
    
    mostrarPersonas(filtradas);
}

async function logout() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        await fetch('api.php?action=logout');
        window.location.href = 'login.php';
    }
}

init();
