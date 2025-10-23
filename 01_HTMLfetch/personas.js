let personas = [];
let personasFiltradas = [];
const modal = document.getElementById('modal');
const closeModal = document.getElementsByClassName('close')[0];
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');

if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

document.getElementById('btnNuevo').addEventListener('click', () => {
    limpiarFormulario();
    document.getElementById('tituloModal').textContent = 'Nueva Persona';
    modal.style.display = 'block';
});

closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

searchInput.addEventListener('input', (e) => {
    filtrarPersonas(e.target.value);
});

btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    filtrarPersonas('');
});

document.getElementById('formPersona').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('personaId').value;
    const data = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        ci: document.getElementById('ci').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value
    };
    
    try {
        if (id) {
            const result = await api.actualizarPersona(id, data);
            alert('Persona actualizada correctamente');
        } else {
            const result = await api.crearPersona(data);
            alert('Persona creada correctamente');
        }
        modal.style.display = 'none';
        cargarPersonas();
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
});

async function cargarPersonas() {
    try {
        const data = await api.getPersonas();
        if (Array.isArray(data)) {
            personas = data;
        } else if (data.data && Array.isArray(data.data)) {
            personas = data.data;
        } else {
            personas = [];
        }
        personasFiltradas = personas;
        renderizarTabla();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar personas');
    }
}

function filtrarPersonas(texto) {
    const busqueda = texto.toLowerCase().trim();
    
    if (busqueda === '') {
        personasFiltradas = personas;
    } else {
        personasFiltradas = personas.filter(persona => {
            const nombres = (persona.nombres || '').toLowerCase();
            const apellidos = (persona.apellidos || '').toLowerCase();
            const ci = (persona.ci || '').toLowerCase();
            const direccion = (persona.direccion || '').toLowerCase();
            const telefono = (persona.telefono || '').toLowerCase();
            const email = (persona.email || '').toLowerCase();
            const id = (persona.id || '').toString();
            
            return nombres.includes(busqueda) ||
                   apellidos.includes(busqueda) ||
                   ci.includes(busqueda) ||
                   direccion.includes(busqueda) ||
                   telefono.includes(busqueda) ||
                   email.includes(busqueda) ||
                   id.includes(busqueda);
        });
    }
    
    renderizarTabla();
}

function renderizarTabla() {
    const tabla = document.getElementById('tablaPersonas');
    
    if (personasFiltradas.length === 0) {
        tabla.innerHTML = '<p class="no-results">No se encontraron resultados</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>CI</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    personasFiltradas.forEach(persona => {
        html += `
            <tr>
                <td>${persona.id || ''}</td>
                <td>${persona.nombres || ''}</td>
                <td>${persona.apellidos || ''}</td>
                <td>${persona.ci || ''}</td>
                <td>${persona.direccion || ''}</td>
                <td>${persona.telefono || ''}</td>
                <td>${persona.email || ''}</td>
                <td>
                    <button class="btn-editar" onclick="editar(${persona.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminar(${persona.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    if (searchInput.value.trim() !== '') {
        html += `<p class="result-count">Mostrando ${personasFiltradas.length} de ${personas.length} personas</p>`;
    }
    
    tabla.innerHTML = html;
}

async function editar(id) {
    try {
        const persona = personas.find(p => p.id === id);
        document.getElementById('personaId').value = persona.id;
        document.getElementById('nombres').value = persona.nombres;
        document.getElementById('apellidos').value = persona.apellidos;
        document.getElementById('ci').value = persona.ci || '';
        document.getElementById('direccion').value = persona.direccion || '';
        document.getElementById('telefono').value = persona.telefono || '';
        document.getElementById('email').value = persona.email || '';
        document.getElementById('tituloModal').textContent = 'Editar Persona';
        modal.style.display = 'block';
    } catch (error) {
        alert('Error al cargar persona');
    }
}

async function eliminar(id) {
    if (confirm('¿Está seguro de eliminar esta persona?')) {
        try {
            const result = await api.eliminarPersona(id);
            alert('Persona eliminada correctamente');
            cargarPersonas();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar: ' + error.message);
        }
    }
}

function limpiarFormulario() {
    document.getElementById('personaId').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('ci').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('email').value = '';
}

cargarPersonas();