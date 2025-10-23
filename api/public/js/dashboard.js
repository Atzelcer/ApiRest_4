let api;
let currentPage = 1;
let searchTerm = '';
let modal;
let sortField = 'id';
let sortDirection = 'asc';
let currentData = [];

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:8000/api';
    const TOKEN = document.querySelector('meta[name="api-token"]').content;
    
    api = new APIService(API_URL, TOKEN);
    modal = new bootstrap.Modal(document.getElementById('personaModal'));
    
    cargarPersonas();
    
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarPersonas();
    });
});

async function cargarPersonas(page = 1) {
    try {
        mostrarCargando();
        const result = await api.getPersonas(page, 10, searchTerm);
        currentData = result.data.data;
        const pagination = result.data;
        
        ordenarDatos();
        mostrarPersonas(currentData);
        mostrarPaginacion(pagination);
        actualizarEstadisticas(pagination);
    } catch (error) {
        mostrarAlerta('ERROR AL CARGAR PERSONAS: ' + error.message, 'danger');
    }
}

function ordenarDatos() {
    currentData.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'id') {
            aVal = parseInt(aVal);
            bVal = parseInt(bVal);
        } else {
            aVal = (aVal || '').toString().toLowerCase();
            bVal = (bVal || '').toString().toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
}

function ordenarTabla(field) {
    if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortDirection = 'asc';
    }
    
    ordenarDatos();
    mostrarPersonas(currentData);
    actualizarIconosOrden();
}

function actualizarIconosOrden() {
    document.querySelectorAll('.sortable').forEach(th => {
        const svg = th.querySelector('svg');
        if (svg) {
            svg.innerHTML = '<path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>';
            svg.style.opacity = '0.3';
        }
    });
    
    const activeHeader = Array.from(document.querySelectorAll('.sortable')).find(th => {
        return th.textContent.toLowerCase().includes(sortField.toLowerCase());
    });
    
    if (activeHeader) {
        const svg = activeHeader.querySelector('svg');
        if (svg) {
            svg.style.opacity = '1';
            if (sortDirection === 'asc') {
                svg.innerHTML = '<path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>';
            } else {
                svg.innerHTML = '<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>';
            }
        }
    }
}

function mostrarPersonas(personas) {
    const tbody = document.getElementById('tableBody');
    
    if (personas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <div class="text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
                        </svg>
                        <h5>NO SE ENCONTRARON RESULTADOS</h5>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = personas.map(p => `
        <tr class="fade-in">
            <td><span class="badge bg-secondary">${p.id}</span></td>
            <td class="fw-semibold">${p.nombres}</td>
            <td class="fw-semibold">${p.apellidos}</td>
            <td><span class="badge bg-info text-dark">${p.ci}</span></td>
            <td><small class="text-muted">${p.direccion}</small></td>
            <td>
                <span class="badge bg-light text-dark border">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-telephone-fill me-1" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                    ${p.telefono}
                </span>
            </td>
            <td>
                <small class="text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-envelope-fill me-1" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                    </svg>
                    ${p.email}
                </small>
            </td>
            <td class="text-center">
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-light" onclick="abrirModalEditar(${p.id})" title="Editar persona">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                        EDITAR
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarPersona(${p.id})" title="Eliminar persona">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                        ELIMINAR
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    setTimeout(() => actualizarIconosOrden(), 100);
}

function mostrarPaginacion(pagination) {
    const container = document.getElementById('pagination');
    const totalPages = pagination.last_page;
    const currentPage = pagination.current_page;

    html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cargarPersonas(${currentPage - 1}); return false;">
                ANTERIOR
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="cargarPersonas(${i}); return false;">
                        ${i}
                    </a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cargarPersonas(${currentPage + 1}); return false;">
                SIGUIENTE
            </a>
        </li>
    `;

    container.innerHTML = html;
}

function actualizarEstadisticas(pagination) {
    document.getElementById('totalPersonas').textContent = pagination.total;
    document.getElementById('paginaActual').textContent = pagination.current_page;
    currentPage = pagination.current_page;
}

function buscarPersonas() {
    searchTerm = document.getElementById('searchInput').value;
    currentPage = 1;
    cargarPersonas(currentPage);
}

function abrirModalCrear() {
    document.getElementById('modalTitle').textContent = 'NUEVA PERSONA';
    document.getElementById('personaForm').reset();
    document.getElementById('personaId').value = '';
    modal.show();
}

async function abrirModalEditar(id) {
    try {
        const result = await api.getPersona(id);
        const persona = result.data;

        document.getElementById('modalTitle').textContent = 'EDITAR PERSONA';
        document.getElementById('personaId').value = persona.id;
        document.getElementById('nombres').value = persona.nombres;
        document.getElementById('apellidos').value = persona.apellidos;
        document.getElementById('ci').value = persona.ci;
        document.getElementById('direccion').value = persona.direccion;
        document.getElementById('telefono').value = persona.telefono;
        document.getElementById('email').value = persona.email;
        
        modal.show();
    } catch (error) {
        mostrarAlerta('ERROR AL CARGAR PERSONA: ' + error.message, 'danger');
    }
}

async function guardarPersona() {
    const form = document.getElementById('personaForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

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
            await api.updatePersona(id, data);
            mostrarAlerta('PERSONA ACTUALIZADA EXITOSAMENTE', 'success');
        } else {
            await api.createPersona(data);
            mostrarAlerta('PERSONA CREADA EXITOSAMENTE', 'success');
        }
        
        modal.hide();
        cargarPersonas(currentPage);
    } catch (error) {
        mostrarAlerta('ERROR: ' + error.message, 'danger');
    }
}

async function eliminarPersona(id) {
    if (!confirm('ESTA SEGURO DE ELIMINAR ESTA PERSONA?')) return;

    try {
        await api.deletePersona(id);
        mostrarAlerta('PERSONA ELIMINADA EXITOSAMENTE', 'success');
        cargarPersonas(currentPage);
    } catch (error) {
        mostrarAlerta('ERROR AL ELIMINAR: ' + error.message, 'danger');
    }
}

function mostrarAlerta(mensaje, tipo) {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} alert-dismissible fade show shadow-lg`;
    alert.style.minWidth = '300px';
    alert.innerHTML = `
        <strong>${tipo === 'success' ? '✓' : '✕'}</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 4000);
}

function mostrarCargando() {
    document.getElementById('tableBody').innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">CARGANDO DATOS...</p>
            </td>
        </tr>
    `;
}
